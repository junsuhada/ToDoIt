import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { colors as c } from '@/constants/theme';
import { styles } from './styles';

export default function EditTodoModal({ todo, onClose, onSave }) {
  const [value, setValue] = useState(todo.title);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    if (!value.trim()) { setError('할 일을 입력해 주세요.'); return; }
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await onSave(todo.id, value);
      onClose();
    } catch (err) {
      setError(err?.message || '수정 내용을 저장하지 못했습니다.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={() => { if (!busy) onClose(); }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.card}>
          <Text style={styles.heading}>할 일 수정</Text>
          <TextInput
            autoFocus
            maxLength={120}
            placeholder="수정할 내용을 입력해 주세요"
            placeholderTextColor={c.muted}
            style={styles.field}
            value={value}
            onChangeText={setValue}
            onSubmitEditing={() => { void save(); }}
            returnKeyType="done"
            editable={!busy}
          />
          {!!error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.cancel]} disabled={busy} onPress={onClose}>
              <Text style={styles.cancelText}>취소</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.confirm]} disabled={busy} onPress={() => { void save(); }}>
              <Text style={styles.confirmText}>{busy ? '저장 중...' : '저장'}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
