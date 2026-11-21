import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import useHomeTodos from '@/hooks/useHomeTodos';
import HomeOverview from '../HomeOverview';
import TodoInputSection from '../TodoInputSection';
import TodoListSection from '../TodoListSection';

import { styles } from './styles';

export default function TodoScreen() {
  const {
    todos,
    title,
    setTitle,
    countDone,
    progress,
    addTodo,
    toggleTodo,
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

        <TodoListSection
          todos={todos}
          onToggle={toggleTodo}
        />

        <TodoInputSection
          title={title}
          onChangeTitle={setTitle}
          onAdd={addTodo}
        />
      </ScrollView>
    </SafeAreaView>
  );
}