import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors as c } from '@/constants/theme';

export default function TodoInputSection({ title, onChangeTitle, onAdd }) {
  return (
    <View style={styles.addBox}>
      <Text style={styles.addTitle}>+ 새로운 할 일</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.addInput}
          placeholder="새로운 할 일을 입력해 주세요"
          placeholderTextColor={c.muted}
          maxLength={120}
          value={title}
          onChangeText={onChangeTitle}
          onSubmitEditing={onAdd}
          returnKeyType="done"
        />
        <Pressable
          style={styles.plusButton}
          accessibilityRole="button"
          accessibilityLabel="할 일 추가"
          onPress={onAdd}
        >
          <Text style={styles.plus}>＋</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addBox: { backgroundColor: c.surface, borderRadius: 20, padding: 17, borderWidth: 1, borderColor: c.border, marginTop: 18 },
  addTitle: { color: c.ink, fontWeight: '800', fontSize: 15 },
  inputRow: { flexDirection: 'row', marginTop: 12, alignItems: 'center', gap: 10 },
  addInput: { flex: 1, backgroundColor: c.background, color: c.ink, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 13 },
  plusButton: { backgroundColor: c.primary, width: 46, height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 13 },
  plus: { color: 'white', fontSize: 25, fontWeight: '800', lineHeight: 31 },
});
