import { useRef, useState } from 'react';

export default function useHomeTodos() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const nextId = useRef(0);

  const addTodo = () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    const todo = {
      id: String(++nextId.current),
      title: trimmed,
      completed: false,
    };

    setTodos((current) => [todo, ...current]);
    setTitle('');
  };

  const toggleTodo = (id) => {
    setTodos((current) => current.map((todo) => (
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )));
  };

  const countDone = todos.filter((todo) => todo.completed).length;
  const progress = todos.length ? Math.round((countDone / todos.length) * 100) : 0;

  return {
    todos,
    title,
    setTitle,
    countDone,
    progress,
    addTodo,
    toggleTodo,
  };
}
