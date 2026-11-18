import { Pressable, Text, View } from 'react-native';
import { FILTERS, filterTodoItems } from '@/utils/todoOperations.mjs';
import { useState } from 'react';
import TodoRow from '@/components/common/TodoRow';
import EmptyState from '@/components/common/EmptyState';
import { styles } from './styles';

export default function TodoListSection({ todos, onToggle, onEdit, onRemove }) {
  const [filter, setFilter] = useState('all');
  const visibleTodos = filterTodoItems(todos, filter);

  return (
    <>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>내 할 일</Text>
        <Text style={styles.sectionCount}>{todos.length}개의 일정</Text>
      </View>
      <View style={styles.filters}>
        {FILTERS.map(({ key, label }) => (
          <Pressable
            key={key}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === key }}
            onPress={() => setFilter(key)}
            style={[styles.filterChip, filter === key && styles.activeChip]}
          >
            <Text style={[styles.filterText, filter === key && styles.activeFilterText]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
      {visibleTodos.length === 0 ? (
        <EmptyState filtered={todos.length > 0 && filter !== 'all'} />
      ) : (
        <View style={styles.list}>
          {visibleTodos.map((todo) => (
            <TodoRow
              key={todo.id}
              todo={todo}
              onToggle={() => onToggle(todo.id)}
              onEdit={() => onEdit(todo)}
              onRemove={() => onRemove(todo)}
            />
          ))}
        </View>
      )}
    </>
  );
}
