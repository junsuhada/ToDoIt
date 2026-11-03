import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors as c } from '@/constants/theme';
export default function TodoRow({ todo, onToggle, onEdit, onRemove }) {
  return (
    <View style={styles.card}>
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: todo.completed }} onPress={onToggle} style={[styles.checkbox, todo.completed && styles.checked]}>
        {todo.completed && <Text style={styles.checkmark}>✓</Text>}
      </Pressable>
      <Pressable onPress={onEdit} style={styles.main}>
        <Text numberOfLines={2} style={[styles.title, todo.completed && styles.finished]}>{todo.title}</Text>
        <Text style={styles.subtitle}>{todo.completed ? '완료했어요' : '진행 중'}</Text>
      </Pressable>
      <Pressable onPress={onEdit} accessibilityLabel="할 일 수정" style={styles.action}><Text style={styles.edit}>수정</Text></Pressable>
      <Pressable onPress={onRemove} accessibilityLabel="할 일 삭제" style={styles.action}><Text style={styles.del}>삭제</Text></Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: c.surface, borderRadius: 17, paddingVertical: 15, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 11, gap: 11, borderWidth: 1, borderColor: c.border },
  checkbox: { borderWidth: 2, borderColor: '#CBD0E0', borderRadius: 9, width: 27, height: 27, alignItems: 'center', justifyContent: 'center' },
  checked: { backgroundColor: c.primary, borderColor: c.primary }, checkmark: { color: 'white', fontWeight: '900' },
  main: { flex: 1 }, title: { color: c.ink, fontSize: 15, fontWeight: '600' }, finished: { color: c.muted, textDecorationLine: 'line-through' },
  subtitle: { color: c.muted, fontSize: 11, marginTop: 5 }, action: { paddingVertical: 8 }, edit: { color: c.primary, fontSize: 12, fontWeight: '700' }, del: { color: c.danger, fontSize: 12, fontWeight: '700' },
});
