import * as SQLite from 'expo-sqlite';

// Separate DB prevents accidental corruption of the old room-based schema.
// No images, passwords, or raw OCR text are persisted.
let dbPromise;
const getDB = () => {
  if (!dbPromise) dbPromise = (async () => {
    const db = await SQLite.openDatabaseAsync('todoit-personal-v1.db');
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS todos (
        user_id TEXT NOT NULL,
        id TEXT NOT NULL,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        deleted INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        base_version INTEGER NOT NULL DEFAULT 0,
        revision INTEGER NOT NULL DEFAULT 1,
        dirty INTEGER NOT NULL DEFAULT 1,
        PRIMARY KEY (user_id, id)
      );
      CREATE INDEX IF NOT EXISTS todos_owner_idx ON todos (user_id, deleted);
    `);
    return db;
  })().catch((err) => { dbPromise = null; throw err; });
  return dbPromise;
};

const toTodo = (row) => ({
  id: row.id, userId: row.user_id, title: row.title,
  completed: !!row.completed, deleted: !!row.deleted,
  createdAt: row.created_at, updatedAt: row.updated_at,
  baseVersion: row.base_version, revision: row.revision, dirty: !!row.dirty,
});

export async function initializeLocal() { await getDB(); }

export async function listTodos(uid, includeDeleted = false) {
  const db = await getDB();
  const rows = await db.getAllAsync(
    `SELECT * FROM todos WHERE user_id = ? ${includeDeleted ? '' : 'AND deleted = 0'} ORDER BY created_at DESC, id DESC`, uid
  );
  return rows.map(toTodo);
}

export async function findTodo(uid, id) {
  const db = await getDB();
  const row = await db.getFirstAsync('SELECT * FROM todos WHERE user_id=? AND id=?', uid, id);
  return row ? toTodo(row) : null;
}

export async function countDirty(uid) {
  const db = await getDB();
  const row = await db.getFirstAsync('SELECT COUNT(*) AS count FROM todos WHERE user_id=? AND dirty=1', uid);
  return row.count;
}

export async function createLocalTodo(uid, id, title) {
  const trimmed = title.trim();
  if (!trimmed || trimmed.length > 120) throw new Error('할 일은 1~120자로 입력해 주세요.');
  const now = Date.now();
  const db = await getDB();
  await db.runAsync(`INSERT INTO todos
    (user_id,id,title,completed,deleted,created_at,updated_at,base_version,revision,dirty)
    VALUES(?,?,?,0,0,?,?,0,1,1)`, uid, id, trimmed, now, now);
  return id;
}

export async function updateLocalTodo(uid, id, fields) {
  const db = await getDB();
  const old = await findTodo(uid, id);
  if (!old || old.deleted) throw new Error('할 일을 찾을 수 없습니다.');
  const title = typeof fields.title === 'string' ? fields.title.trim() : old.title;
  if (!title || title.length > 120) throw new Error('할 일은 1~120자로 입력해 주세요.');
  const completed = typeof fields.completed === 'boolean' ? fields.completed : old.completed;
  await db.runAsync(`UPDATE todos SET title=?, completed=?, updated_at=?, dirty=1, revision=revision+1
    WHERE user_id=? AND id=? AND deleted=0`, title, Number(completed), Date.now(), uid, id);
}

export async function deleteLocalTodo(uid, id) {
  const db = await getDB();
  await db.runAsync(`UPDATE todos SET deleted=1, updated_at=?, dirty=1, revision=revision+1
    WHERE user_id=? AND id=?`, Date.now(), uid, id);
}

// Pull never replaces locally edited rows. Tombstones are retained so deletion syncs.
export async function applyRemote(uid, data) {
  const db = await getDB();
  await db.runAsync(`INSERT INTO todos
    (user_id,id,title,completed,deleted,created_at,updated_at,base_version,revision,dirty)
    VALUES(?,?,?,?,?,?,?,?,0,0)
    ON CONFLICT(user_id,id) DO UPDATE SET
      title=excluded.title, completed=excluded.completed, deleted=excluded.deleted,
      created_at=excluded.created_at, updated_at=excluded.updated_at,
      base_version=excluded.base_version, dirty=0
    WHERE todos.dirty=0 AND excluded.base_version > todos.base_version`,
    uid, data.id, data.title, Number(data.completed), Number(data.deleted),
    data.createdAt, data.updatedAt, data.version);
}

// Accepted push keeps newer edits pending if the user edited during network upload.
export async function acknowledgePush(uid, id, expectedRevision, expectedBaseVersion, version) {
  const db = await getDB();
  await db.runAsync(`UPDATE todos SET base_version=?, dirty=CASE WHEN revision=? THEN 0 ELSE 1 END
    WHERE user_id=? AND id=? AND base_version=?`,
    version, expectedRevision, uid, id, expectedBaseVersion);
}

// Local wins: the explicit user decision rebases a local edit onto the seen remote version.
export async function rebaseLocal(uid, id, remoteVersion) {
  const db = await getDB();
  await db.runAsync('UPDATE todos SET base_version=?,dirty=1 WHERE user_id=? AND id=?', remoteVersion, uid, id);
}

// Server wins: explicit user decision overwrites a dirty row or removes an absent remote.
export async function chooseServer(uid, id, remote) {
  const db = await getDB();
  if (!remote) {
    await db.runAsync('DELETE FROM todos WHERE user_id=? AND id=?', uid, id);
    return;
  }
  await db.runAsync(`INSERT INTO todos
    (user_id,id,title,completed,deleted,created_at,updated_at,base_version,revision,dirty)
    VALUES(?,?,?,?,?,?,?,?,0,0)
    ON CONFLICT(user_id,id) DO UPDATE SET
      title=excluded.title, completed=excluded.completed, deleted=excluded.deleted,
      created_at=excluded.created_at,updated_at=excluded.updated_at,
      base_version=excluded.base_version,revision=todos.revision+1,dirty=0`,
    uid, id, remote.title, Number(remote.completed), Number(remote.deleted),
    remote.createdAt, remote.updatedAt, remote.version);
}
