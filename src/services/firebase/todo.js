import {
  collection, doc, getDocsFromServer, getFirestore,
  onSnapshot, runTransaction, serverTimestamp,
} from '@react-native-firebase/firestore';
import { classify } from '@/services/sync/policy.mjs';
import {
  listTodos, applyRemote, acknowledgePush, countDirty,
  rebaseLocal, chooseServer,
} from '@/services/local/database';

const db = getFirestore();
const todosRef = (uid) => collection(db, 'users', uid, 'todos');
export const newTodoId = (uid) => doc(todosRef(uid)).id;

const readRemote = (snap) => {
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id, title: data.title ?? '', completed: !!data.completed,
    deleted: !!data.deleted, createdAt: data.createdAt ?? 0,
    updatedAt: data.updatedAt ?? 0, version: data.version ?? 0,
  };
};
const message = (error) => error?.message || String(error);

/**
 * Single-account synchronizer. Local SQLite is the UI source of truth.
 * Fetch authoritative server versions, then optimistically commit pending
 * changes with Firestore transactions. Never silently choose a conflict side.
 * No room codes, invitations or cross-user sharing.
 */
export function createTodoSynchronizer(uid, onLocalChange, onStatus, onConflictChange) {
  let stopped = false;
  let online = false;
  let started = false;
  let running = false;
  let rerun = false;
  let unsubscribe = () => {};
  const conflicts = new Map();

  const emitConflicts = () => { if (!stopped) onConflictChange([...conflicts.values()]); };
  const status = async (value, error = '') => {
    if (!stopped) onStatus({ status: value, error, pending: await countDirty(uid) });
  };
  const addConflict = (local, remote) => {
    // Keep a decision open until the user explicitly resolves it.
    if (!conflicts.has(local.id)) {
      conflicts.set(local.id, { id: local.id, local, remote });
      emitConflicts();
    }
  };

  async function pushOne(local) {
    const ref = doc(todosRef(uid), local.id);
    const outcome = await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(ref);
      const remote = readRemote(snap);
      const currentVersion = remote?.version ?? 0;
      if (currentVersion !== local.baseVersion) return { conflict: true, remote };
      const version = currentVersion + 1;
      transaction.set(ref, {
        title: local.title, completed: local.completed, deleted: local.deleted,
        createdAt: remote?.createdAt ?? local.createdAt,
        updatedAt: local.updatedAt, version, serverUpdatedAt: serverTimestamp(),
      });
      return { conflict: false, version };
    });
    if (stopped) return;
    if (outcome.conflict) {
      addConflict(local, outcome.remote);
    } else {
      await acknowledgePush(uid, local.id, local.revision, local.baseVersion, outcome.version);
      if (!stopped) await onLocalChange();
    }
  }

  async function syncOnce() {
    if (stopped || !online) return;
    await status('syncing');
    // Important: cached Firestore snapshots are NOT authoritative for conflicts.
    const snapshot = await getDocsFromServer(todosRef(uid));
    if (stopped || !online) return;
    const remoteMap = new Map(snapshot.docs.map((item) => [item.id, readRemote(item)]));
    const localRows = await listTodos(uid, true);
    const localMap = new Map(localRows.map((item) => [item.id, item]));

    for (const remote of remoteMap.values()) {
      if (stopped) return;
      const local = localMap.get(remote.id);
      const choice = classify(local, remote);
      if (choice === 'pull') await applyRemote(uid, remote);
      else if (choice === 'conflict') addConflict(local, remote);
    }
    if (stopped) return;
    await onLocalChange();

    for (const local of localRows) {
      if (stopped || !online) return;
      if (!local.dirty || conflicts.has(local.id)) continue;
      const remote = remoteMap.get(local.id);
      if (classify(local, remote) === 'conflict') {
        addConflict(local, remote ?? null);
        continue;
      }
      await pushOne(local);
    }
    if (stopped || !online) return;
    await onLocalChange();
    const pending = await countDirty(uid);
    await status(conflicts.size ? 'conflict' : pending ? 'pending' : 'synced');
  }

  async function sync() {
    if (stopped || !online) return;
    if (running) { rerun = true; return; }
    running = true;
    try {
      do {
        rerun = false;
        await syncOnce();
      } while (rerun && online && !stopped);
    } catch (error) {
      if (!stopped) await status('error', message(error));
    } finally {
      running = false;
      if (rerun && !stopped && online) void sync();
    }
  }

  const setOnline = (value) => {
    online = value;
    if (!online) void status('offline');
    else void sync();
  };

  const resolve = async (id, choice) => {
    const conflict = conflicts.get(id);
    if (!conflict) return;
    if (choice === 'server') await chooseServer(uid, id, conflict.remote);
    else if (choice === 'local') await rebaseLocal(uid, id, conflict.remote?.version ?? 0);
    else throw new Error('충돌 해결 선택이 올바르지 않습니다.');
    conflicts.delete(id);
    emitConflicts();
    await onLocalChange();
    if (online) await sync();
    else await status('offline');
  };

  const start = () => {
    if (started || stopped) return;
    started = true;
    unsubscribe = onSnapshot(todosRef(uid),
      (snapshot) => {
        if (!stopped && online && !snapshot.metadata.fromCache && !snapshot.metadata.hasPendingWrites) {
          void sync();
        }
      },
      (error) => { if (!stopped) void status('error', message(error)); }
    );
  };
  const stop = () => {
    stopped = true;
    online = false;
    if (typeof unsubscribe === 'function') unsubscribe();
    conflicts.clear();
  };
  return { start, stop, setOnline, sync, resolve };
}
