import { ActivityIndicator, Pressable, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { colors as c } from '@/constants/theme';
import useHomeTodos from '@/hooks/useHomeTodos';
import HomeOverview from '../HomeOverview';
import TodoListSection from '../TodoListSection';
import AddTodoModal from '../AddTodoModal';
import EditTodoModal from '../EditTodoModal';
import DeleteTodoModal from '../DeleteTodoModal';
import { styles } from './styles';

export default function TodoScreen() {
  const {
    todos, title, setTitle, countDone, progress,
    ready, loadError, saveError, retryLoad,
    addTodo, toggleTodo, editTodo, removeTodo,
  } = useHomeTodos();

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const closeAddModal = () => {
    setAdding(false);
    setTitle('');
  };

  if (!ready) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        {loadError ? (
          <>
            <Text style={styles.errorText}>{loadError}</Text>
            <Text style={styles.hint}>기존 데이터가 삭제되지 않도록 자동 초기화하지 않았습니다.</Text>
            <Pressable style={styles.retryButton} onPress={retryLoad}>
              <Text style={styles.retryText}>다시 불러오기</Text>
            </Pressable>
          </>
        ) : (
          <>
            <ActivityIndicator color={c.primary} size="large" />
            <Text style={styles.hint}>저장된 할 일을 불러오는 중...</Text>
          </>
        )}
      </SafeAreaView>
    );
  }

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
          onAdd={() => setAdding(true)}
        />
        <TodoListSection
          todos={todos}
          onToggle={(id) => { void toggleTodo(id).catch(() => {}); }}
          onEdit={setEditing}
          onRemove={setDeleting}
        />
        {!!saveError && (
          <Text accessibilityRole="alert" style={styles.errorText}>
            저장 실패: {saveError}
          </Text>
        )}
      </ScrollView>

      {adding && (
        <AddTodoModal
          title={title}
          onChangeTitle={setTitle}
          onClose={closeAddModal}
          onAdd={addTodo}
        />
      )}
      {!!editing && (
        <EditTodoModal
          key={editing.id}
          todo={editing}
          onClose={() => setEditing(null)}
          onSave={editTodo}
        />
      )}
      {!!deleting && (
        <DeleteTodoModal
          key={deleting.id}
          todo={deleting}
          onClose={() => setDeleting(null)}
          onConfirm={removeTodo}
        />
      )}
    </SafeAreaView>
  );
}
