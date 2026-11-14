import { useCallback, useEffect, useRef, useState } from 'react';
import {
  loadTodos, addStoredTodo, editStoredTodo, toggleStoredTodo, removeStoredTodo,
} from '@/services/local/todoStorage';

export default function useHomeTodos() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const queueRef = useRef(Promise.resolve());
  const nextId = useRef(0);
  const addingRef = useRef(false);
  const readyRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    readyRef.current = false;
    setReady(false);
    setLoadError('');

    async function restore() {
      try {
        await queueRef.current;
        const restored = await loadTodos();
        if (cancelled) return;
        setTodos(restored);
        readyRef.current = true;
        setReady(true);
      } catch (error) {
        if (!cancelled) {
          setLoadError(error?.message || 'SQLite에서 할 일을 불러오지 못했습니다.');
        }
      }
    }
    void restore();
    return () => { cancelled = true; };
  }, [reloadKey]);

  const retryLoad = () => setReloadKey((key) => key + 1);

  const persistChange = useCallback((write) => {
    const operation = queueRef.current.then(async () => {
      if (!readyRef.current) throw new Error('할 일 목록을 불러오는 중입니다.');
      await write();
      const latest = await loadTodos();
      setTodos(latest);
      setSaveError('');
    });
    queueRef.current = operation.catch(() => {});
    return operation.catch((error) => {
      setSaveError(error?.message || 'SQLite 저장에 실패했습니다.');
      throw error;
    });
  }, []);

  const addTodo = async () => {
    const trimmed = title.trim();
    if (!trimmed || addingRef.current) return;
    addingRef.current = true;
    try {
      const currentTitle = title;
      const todo = {
        id: `${Date.now()}-${++nextId.current}`,
        title: trimmed,
        completed: false,
      };
      await persistChange(() => addStoredTodo(todo));
      setTitle((current) => current === currentTitle ? '' : current);
    } finally {
      addingRef.current = false;
    }
  };

  const toggleTodo = (id) => persistChange(() => toggleStoredTodo(id));
  const editTodo = (id, nextTitle) => {
    const trimmed = nextTitle.trim();
    if (!trimmed) return Promise.reject(new Error('할 일을 입력해 주세요.'));
    return persistChange(() => editStoredTodo(id, trimmed));
  };
  const removeTodo = (id) => persistChange(() => removeStoredTodo(id));

  const countDone = todos.filter((todo) => todo.completed).length;
  const progress = todos.length ? Math.round(countDone / todos.length * 100) : 0;

  return {
    todos, title, setTitle, countDone, progress,
    ready, loadError, saveError, retryLoad,
    addTodo, toggleTodo, editTodo, removeTodo,
  };
}
