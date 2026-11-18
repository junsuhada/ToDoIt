export const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'active', label: '미완료' },
  { key: 'done', label: '완료' },
];

export function addTodoItem(todos, id, title) {
  const trimmed = title.trim();
  if (!trimmed) return todos;
  return [{ id, title: trimmed, completed: false }, ...todos];
}

export function toggleTodoItem(todos, id) {
  return todos.map((todo) => (
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  ));
}

export function editTodoItem(todos, id, title) {
  const trimmed = title.trim();
  if (!trimmed) throw new Error('할 일을 입력해 주세요.');
  return todos.map((todo) => (
    todo.id === id ? { ...todo, title: trimmed } : todo
  ));
}

export function deleteTodoItem(todos, id) {
  return todos.filter((todo) => todo.id !== id);
}

export function filterTodoItems(todos, filter) {
  if (filter === 'done') return todos.filter((todo) => todo.completed);
  if (filter === 'active') return todos.filter((todo) => !todo.completed);
  return todos;
}

export function isValidTodo(todo) {
  return todo !== null && typeof todo === 'object' && !Array.isArray(todo)
    && typeof todo.id === 'string' && todo.id.length > 0
    && typeof todo.title === 'string' && todo.title.trim().length > 0
    && typeof todo.completed === 'boolean';
}
