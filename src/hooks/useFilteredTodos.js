import { useMemo } from 'react';

export function useFilteredTodos(todos, filter) {
  return useMemo(() => {
    if (filter === 'active') return todos.filter((todo) => !todo.is_done);
    if (filter === 'done') return todos.filter((todo) => todo.is_done);
    return todos;
  }, [todos, filter]);
}
