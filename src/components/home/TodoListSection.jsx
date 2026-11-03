import { StyleSheet, Text, View } from 'react-native';
import { colors as c } from '@/constants/theme';
import TodoRow from '@/components/TodoRow';
import EmptyState from '@/components/EmptyState';

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

const styles = StyleSheet.create({
  sectionTitleRow: {
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 29,
  },
  sectionTitle: { color: c.ink, fontSize: 20, fontWeight: '800' },
  sectionCount: { color: c.muted, fontSize: 12 },
  list: { marginTop: 16 },
});
