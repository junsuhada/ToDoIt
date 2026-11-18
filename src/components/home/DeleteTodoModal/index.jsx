import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { styles } from './styles';

export default function DeleteTodoModal({ todo, onClose, onConfirm }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const remove = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await onConfirm(todo.id);
      onClose();
    } catch (err) {
      setError(err?.message || '항목을 삭제하지 못했습니다.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={() => { if (!busy) onClose(); }}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.heading}>할 일 삭제</Text>
          <Text style={styles.message} numberOfLines={3}>
            “{todo.title}”을(를) 삭제할까요?
          </Text>
          {!!error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.cancel]} disabled={busy} onPress={onClose}>
              <Text style={styles.cancelText}>취소</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.confirm]} disabled={busy} onPress={() => { void remove(); }}>
              <Text style={styles.confirmText}>{busy ? '삭제 중...' : '삭제'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
