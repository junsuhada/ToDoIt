import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import ActionButton from '@/components/ActionButton';
import { COLORS } from '@/constants/app';
import { useTodos } from '@/stores/TodoContext';

export default function AddScreen() {
  const { add } = useTodos();
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!title.trim()) {
      setError('할 일을 입력해주세요.');
      return;
    }
    try {
      setSaving(true);
      await add(title);
      router.back();
    } catch (e) {
      Alert.alert('등록 실패', e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.label}>할 일 내용</Text>
      <TextInput
        testID="todo-input"
        placeholder="할 일을 입력하세요"
        value={title}
        onChangeText={(text) => { setTitle(text); if (error) setError(''); }}
        multiline
        maxLength={300}
        style={styles.input}
        autoFocus
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.buttons}>
        <ActionButton title="취소" outline onPress={() => router.back()} style={styles.button} />
        <ActionButton title="추가" testID="todo-save" loading={saving} onPress={submit} style={styles.button} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 18, backgroundColor: COLORS.background },
  label: { color: COLORS.text, fontWeight: '700', marginBottom: 10 },
  input: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: COLORS.line, padding: 14, minHeight: 110, textAlignVertical: 'top', color: COLORS.text },
  error: { color: COLORS.danger, marginTop: 8 },
  buttons: { flexDirection: 'row', gap: 10, marginTop: 22 },
  button: { flex: 1 },
});
