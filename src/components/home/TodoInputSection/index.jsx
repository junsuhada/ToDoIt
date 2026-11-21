import { colors as c } from '@/constants/theme';
import { Pressable, Text, TextInput, View } from 'react-native';
import { styles } from './styles';

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