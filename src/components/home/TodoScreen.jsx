import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors as c } from '@/constants/theme';
import useHomeTodos from '@/hooks/useHomeTodos';
import HomeOverview from './HomeOverview';
import TodoListSection from './TodoListSection';
import TodoInputSection from './TodoInputSection';

export default function TodoScreen() {
  const {
    todos, title, setTitle, countDone, progress, addTodo, toggleTodo,
  } = useHomeTodos();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <HomeOverview
          total={todos.length}
          countDone={countDone}
          progress={progress}
        />
        <TodoListSection todos={todos} onToggle={toggleTodo} />
        <TodoInputSection
          title={title}
          onChangeTitle={setTitle}
          onAdd={addTodo}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.background },
  page: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 50 },
});
