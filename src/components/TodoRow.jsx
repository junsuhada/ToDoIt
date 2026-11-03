import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors as c } from '@/constants/theme';

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
        {todo.completed && <Text style={styles.checkmark}>✓</Text>}
      </Pressable>
      <Pressable accessibilityRole="button" onPress={onToggle} style={styles.main}>
        <Text numberOfLines={2} style={[styles.title, todo.completed && styles.finished]}>
          {todo.title}
        </Text>
        <Text style={styles.subtitle}>
          {todo.completed ? '완료했어요' : '진행 중'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: c.surface, borderRadius: 17, paddingVertical: 15, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 11, gap: 11, borderWidth: 1, borderColor: c.border },
  checkbox: { borderWidth: 2, borderColor: '#CBD0E0', borderRadius: 9, width: 27, height: 27, alignItems: 'center', justifyContent: 'center' },
  checked: { backgroundColor: c.primary, borderColor: c.primary },
  checkmark: { color: 'white', fontWeight: '900' },
  main: { flex: 1 },
  title: { color: c.ink, fontSize: 15, fontWeight: '600' },
  finished: { color: c.muted, textDecorationLine: 'line-through' },
  subtitle: { color: c.muted, fontSize: 11, marginTop: 5 },
});
