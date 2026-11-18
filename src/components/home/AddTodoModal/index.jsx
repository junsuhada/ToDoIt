import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors as c } from '@/constants/theme';
import { styles } from './styles';

export default function AddTodoModal({ title, onChangeTitle, onClose, onAdd }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const close = () => {
    if (!busy) onClose();
  };

  const add = async () => {
    if (busy) return;
    if (!title.trim()) {
      setError('할 일을 입력해 주세요.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onAdd();
      onClose();
    } catch (err) {
      setError(err?.message || '할 일을 저장하지 못했습니다.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={close}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable
          style={styles.backdrop}
          accessibilityRole="button"
          accessibilityLabel="추가 창 닫기"
          onPress={close}
        />
        <View style={styles.card}>
          <Text style={styles.heading}>새로운 할 일</Text>
          <TextInput
            autoFocus
            maxLength={120}
            placeholder="새로운 할 일을 입력해 주세요"
            placeholderTextColor={c.muted}
            style={styles.field}
            value={title}
            onChangeText={(value) => { onChangeTitle(value); if (error) setError(''); }}
            onSubmitEditing={() => { void add(); }}
            returnKeyType="done"
            editable={!busy}
            accessibilityLabel="새 할 일 제목"
          />
          {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.cancel]} disabled={busy} onPress={close}>
              <Text style={styles.cancelText}>취소</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.confirm]} disabled={busy} onPress={() => { void add(); }}>
              <Text style={styles.confirmText}>{busy ? '추가 중...' : '추가'}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
