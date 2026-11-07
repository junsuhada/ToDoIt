import EmptyState from '@/components/common/EmptyState';
import TodoRow from '@/components/common/TodoRow';
import { Text, View } from 'react-native';
import { styles } from './styles';

export default function TodoListSection({ todos, onToggle }) {
  return (
    <>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>내 할 일</Text>
        <Text style={styles.sectionCount}>{todos.length}개의 일정</Text>
      </View>

      {todos.length === 0 ? (
        <EmptyState />
      ) : (
        <View style={styles.list}>
          {todos.map((todo) => (
            <TodoRow
              key={todo.id}
              todo={todo}
              onToggle={() => onToggle(todo.id)}
            />
          ))}
        </View>
      )}
    </>
  );
}