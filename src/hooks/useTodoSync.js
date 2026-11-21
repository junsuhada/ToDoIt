import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {
  acknowledgeStoredUpload, applyRemoteTodos, getPendingCount, loadPendingTodos,
} from '@/services/local/todoStorage';
import { ensureAnonymousSignIn } from '@/services/firebase/client';
import { fetchServerTodos, uploadTodo, watchServerTodos } from '@/services/firebase/todoSync';

function networkAvailable(state) {
  return state.isConnected !== false && state.isInternetReachable !== false;
}

export default function useTodoSync({ ready, enqueue, refresh }) {
  const [online, setOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState('connecting');
  const [syncError, setSyncError] = useState('');
  const [pendingCount, setPendingCount] = useState(0);
  const activeRef = useRef(false);
  const onlineRef = useRef(true);
  const unsubscribeRef = useRef(null);
  const connectRef = useRef(null);
  const flushingRef = useRef(null);
  const flushAgainRef = useRef(false);

  const updatePending = useCallback(async () => {
    const count = await getPendingCount();
    if (activeRef.current) setPendingCount(count);
    return count;
  }, []);

  const showError = useCallback((error) => {
    if (!activeRef.current) return;
    setSyncError(error?.message || 'Firebase 동기화에 실패했습니다.');
    setSyncStatus('error');
  }, []);

  const stopListener = useCallback(() => {
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
  }, []);

  const connect = useCallback(async () => {
    if (!ready || !activeRef.current || !onlineRef.current) return;
    if (unsubscribeRef.current) return;
    if (connectRef.current) return connectRef.current;

    setSyncStatus('connecting');
    const connecting = (async () => {
      await ensureAnonymousSignIn();
      if (!activeRef.current || !onlineRef.current) return;
      unsubscribeRef.current = watchServerTodos(
        (remoteTodos) => {
          if (!activeRef.current || !onlineRef.current) return;
          void enqueue(async () => {
            await applyRemoteTodos(remoteTodos);
            await refresh();
            return updatePending();
          }).then((count) => {
            if (!activeRef.current || !onlineRef.current) return;
            setSyncError('');
            setSyncStatus(count > 0 ? 'uploading' : 'synced');
          }).catch(showError);
        },
        (error) => {
          stopListener();
          showError(error);
        }
      );
    })();
    connectRef.current = connecting;
    try {
      await connecting;
    } catch (error) {
      showError(error);
      throw error;
    } finally {
      connectRef.current = null;
    }
  }, [ready, enqueue, refresh, updatePending, showError, stopListener]);

  const flushPending = useCallback(async () => {
    if (!activeRef.current || !onlineRef.current) return;
    if (flushingRef.current) {
      flushAgainRef.current = true;
      return flushingRef.current;
    }

    const run = (async () => {
      do {
        flushAgainRef.current = false;
        const pending = await enqueue(loadPendingTodos);
        if (pending.length === 0) break;
        if (activeRef.current) setSyncStatus('uploading');

        for (const todo of pending) {
          if (!activeRef.current || !onlineRef.current) return;
          await uploadTodo(todo);
          await enqueue(async () => {
            await acknowledgeStoredUpload(todo);
            await updatePending();
          });
        }
      } while (flushAgainRef.current && activeRef.current && onlineRef.current);

      const count = await enqueue(updatePending);
      if (activeRef.current && onlineRef.current) {
        setSyncError('');
        setSyncStatus(count ? 'uploading' : 'synced');
      }
    })();

    flushingRef.current = run;
    let completed = false;
    try {
      await run;
      completed = true;
    } catch (error) {
      showError(error);
      throw error;
    } finally {
      flushingRef.current = null;
      if (completed && flushAgainRef.current && activeRef.current && onlineRef.current) {
        void flushPending().catch(showError);
      }
    }
  }, [enqueue, updatePending, showError]);

  const requestUpload = useCallback(() => {
    if (!activeRef.current || !onlineRef.current) return;
    void connect().then(() => flushPending()).catch(showError);
  }, [connect, flushPending, showError]);

  const onLocalChange = useCallback(() => {
    void enqueue(updatePending).catch(showError);
    requestUpload();
  }, [enqueue, updatePending, showError, requestUpload]);

  const syncNow = useCallback(async () => {
    if (!onlineRef.current) {
      setSyncStatus('offline');
      return;
    }
    try {
      await connect();
      await flushPending();
      const remoteTodos = await fetchServerTodos();
      const count = await enqueue(async () => {
        await applyRemoteTodos(remoteTodos);
        await refresh();
        return updatePending();
      });
      if (activeRef.current && onlineRef.current) {
        setSyncStatus(count > 0 ? 'uploading' : 'synced');
        setSyncError('');
      }
    } catch (error) {
      showError(error);
      throw error;
    }
  }, [connect, flushPending, enqueue, refresh, updatePending, showError]);

  useEffect(() => {
    if (!ready) return;
    activeRef.current = true;
    let disposed = false;

    const onNetwork = (state) => {
      if (disposed) return;
      const available = networkAvailable(state);
      const wasOnline = onlineRef.current;
      onlineRef.current = available;
      setOnline(available);
      if (!available) {
        stopListener();
        setSyncStatus('offline');
      } else if (!wasOnline || !unsubscribeRef.current) {
        requestUpload();
      }
    };

    void enqueue(updatePending).catch(showError);
    const unsubscribeNetwork = NetInfo.addEventListener(onNetwork);
    void NetInfo.fetch().then(onNetwork).catch(showError);
    const appListener = AppState.addEventListener('change', (state) => {
      if (state === 'active' && !disposed && onlineRef.current) {
        void syncNow().catch(showError);
      }
    });

    return () => {
      disposed = true;
      activeRef.current = false;
      stopListener();
      unsubscribeNetwork();
      appListener.remove();
    };
  }, [ready, enqueue, updatePending, stopListener, requestUpload, syncNow, showError]);

  return { online, syncStatus, syncError, pendingCount, syncNow, onLocalChange };
}
