import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import ActionButton from '@/components/ActionButton';
import { COLORS } from '@/constants/app';
import { useTodos } from '@/stores/TodoContext';

export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const { find, edit } = useTodos();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const todo = await find(String(id));
        if (active) {
          if (!todo || todo.is_deleted) setError('할 일을 찾을 수 없습니다.');
          else setTitle(todo.title);
        }
      } catch (e) {
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [find, id]);

  async function save() {
    if (!title.trim()) {
      setError('할 일을 입력해주세요.');
      return;
    }
    try {
      setSaving(true);
      await edit(String(id), { title });
      router.back();
    } catch (e) {
      Alert.alert('수정 실패', e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.label}>할 일 내용</Text>
      <TextInput
        testID="todo-edit-input"
        value={title}
        onChangeText={(next) => { setTitle(next); setError(''); }}
        placeholder="할 일을 입력하세요"
        multiline maxLength={300}
        style={styles.input}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.buttons}>
        <ActionButton title="취소" outline onPress={() => router.back()} style={styles.button} />
        <ActionButton title="저장" loading={saving} onPress={save} style={styles.button} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  page: { flex: 1, backgroundColor: COLORS.background, padding: 18 },
  label: { color: COLORS.text, fontWeight: '700', marginBottom: 10 },
  input: { backgroundColor: '#fff', minHeight: 110, borderWidth: 1, borderColor: COLORS.line, borderRadius: 10, padding: 14, textAlignVertical: 'top', color: COLORS.text },
  error: { color: COLORS.danger, marginTop: 8 },
  buttons: { flexDirection: 'row', gap: 10, marginTop: 22 },
  button: { flex: 1 },
});
