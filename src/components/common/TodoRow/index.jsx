import { Pressable, Text, View } from 'react-native';
import { styles } from './styles';

export default function TodoRow({ todo, onToggle }) {
  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={`${todo.title} 완료 상태 변경`}
        accessibilityState={{ checked: todo.completed }}
        onPress={onToggle}
        style={[styles.checkbox, todo.completed && styles.checked]}
      >
        {todo.completed && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={onToggle}
        style={styles.main}
      >
        <Text
          numberOfLines={2}
          style={[styles.title, todo.completed && styles.finished]}
        >
          {todo.title}
        </Text>

        <Text style={styles.subtitle}>
          {todo.completed ? '완료했어요' : '진행 중'}
        </Text>
      </Pressable>
    </View>
  );
}