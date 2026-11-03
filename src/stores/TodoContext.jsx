import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { subscribeAuth, ensureAnonymousUser } from '@/services/firebase/auth';
import { createTodoSynchronizer, newTodoId } from '@/services/firebase/todo';
import {
  initializeLocal, listTodos, createLocalTodo, updateLocalTodo, deleteLocalTodo, countDirty,
} from '@/services/local/database';

const TodoContext = createContext(null);
const canSync = (state) => state.isConnected === true && state.isInternetReachable !== false;

function stopSynchronizer(engine) {
  if (!engine) return;
  if (typeof engine.stop !== 'function') {
    console.warn('[TodoContext] 동기화 엔진에 stop()이 없습니다.');
    return;
  }
  try {
    engine.stop();
  } catch (error) {
    console.warn('[TodoContext] 동기화 엔진 종료 실패:', error);
  }
}

export function TodoProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [online, setOnline] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [pending, setPending] = useState(0);
  const [error, setError] = useState('');
  const [conflicts, setConflicts] = useState([]);
  const userRef = useRef(null);
  const syncRef = useRef(null);
  const onlineRef = useRef(false);
  const initId = useRef(0);

  const refresh = useCallback(async (uid = userRef.current) => {
    if (!uid) { setTodos([]); return; }
    const rows = await listTodos(uid);
    if (userRef.current === uid) {
      setTodos(rows);
      setPending(await countDirty(uid));
    }
  }, []);

  useEffect(() => {
    let live = true;
    let unsubscribeNet = () => {};
    let unsubscribeAuth = () => {};
    let removeApp = () => {};
    const changeNetwork = (state) => {
      if (!live) return;
      const next = canSync(state);
      onlineRef.current = next;
      setOnline(next);
      syncRef.current?.setOnline(next);
    };

    const configure = async () => {
      try {
        await initializeLocal();
        const state = await NetInfo.fetch();
        if (!live) return;
        changeNetwork(state);
        unsubscribeNet = NetInfo.addEventListener(changeNetwork);
        unsubscribeAuth = subscribeAuth((authUser) => {
          if (!live) return;
          try {
            const uid = authUser?.uid ?? null;
            if (uid && userRef.current === uid && syncRef.current) {
              setUser(authUser);
              return;
            }

            const gen = ++initId.current;
            const previous = syncRef.current;
            syncRef.current = null;
            stopSynchronizer(previous);

            userRef.current = uid;
            setUser(authUser ?? null);
            setTodos([]);
            setConflicts([]);
            setPending(0);
            setError('');
            setSyncStatus(uid ? 'syncing' : 'idle');

            if (!uid) {
              setReady(true);
              void ensureAnonymousUser().catch((err) => {
                if (!live || gen !== initId.current) return;
                setError(err?.message || '익명 인증에 실패했습니다.');
                setSyncStatus('error');
              });
              return;
            }

            void (async () => {
              try {
                await refresh(uid);
                if (!live || gen !== initId.current) return;
                const sync = createTodoSynchronizer(
                  uid,
                  () => refresh(uid),
                  (data) => {
                    if (!live || gen !== initId.current) return;
                    setSyncStatus(data.status);
                    setPending(data.pending);
                    setError(data.error);
                  },
                  (data) => {
                    if (live && gen === initId.current) setConflicts(data);
                  },
                );
                syncRef.current = sync;
                sync.start();
                sync.setOnline(onlineRef.current);
                setReady(true);
              } catch (err) {
                if (live && gen === initId.current) {
                  const broken = syncRef.current;
                  syncRef.current = null;
                  stopSynchronizer(broken);
                  setError(err?.message || '동기화 초기화 실패');
                  setSyncStatus('error');
                  setReady(true);
                }
              }
            })();
          } catch (err) {
            console.error('[TodoContext] 인증 상태 처리 오류:', err);
            setError(err?.message || '인증 상태 처리 실패');
            setSyncStatus('error');
            setReady(true);
          }
        });
        const subscription = AppState.addEventListener('change', (status) => {
          if (status !== 'active' || !live) return;
          void refresh();
          void NetInfo.fetch().then((next) => {
            if (!live) return;
            changeNetwork(next);
            if (canSync(next)) void syncRef.current?.sync();
          }).catch(console.warn);
        });
        removeApp = () => subscription.remove();
      } catch (err) {
        if (live) { setError(err.message); setSyncStatus('error'); setReady(true); }
      }
    };
    void configure();
    return () => {
      live = false; ++initId.current;
      const previous = syncRef.current;
      syncRef.current = null;
      stopSynchronizer(previous);
      if (typeof unsubscribeNet === 'function') unsubscribeNet();
      if (typeof unsubscribeAuth === 'function') unsubscribeAuth();
      if (typeof removeApp === 'function') removeApp();
    };
  }, [refresh]);

  const changed = useCallback(async (uid) => {
    await refresh(uid);
    void syncRef.current?.sync();
  }, [refresh]);

  const add = useCallback(async (title) => {
    const uid = userRef.current;
    if (!uid) throw new Error('로그인이 필요합니다.');
    const id = newTodoId(uid);
    await createLocalTodo(uid, id, title);
    await changed(uid);
    return id;
  }, [changed]);

  const edit = useCallback(async (id, fields) => {
    const uid = userRef.current;
    if (!uid) throw new Error('로그인이 필요합니다.');
    await updateLocalTodo(uid, id, fields);
    await changed(uid);
  }, [changed]);

  const remove = useCallback(async (id) => {
    const uid = userRef.current;
    if (!uid) throw new Error('로그인이 필요합니다.');
    await deleteLocalTodo(uid, id);
    await changed(uid);
  }, [changed]);

  const resolveConflict = useCallback(async (id, choice) => {
    if (!syncRef.current) return;
    await syncRef.current.resolve(id, choice);
  }, []);

  return (
    <TodoContext.Provider value={{
      ready, user, todos, online, syncStatus, pending, error, conflicts,
      refresh, add, edit, remove, resolveConflict,
      syncNow: () => syncRef.current?.sync(),
    }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (!context) throw new Error('TodoProvider 내부에서만 사용할 수 있습니다.');
  return context;
}
