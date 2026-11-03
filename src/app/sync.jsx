import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import ActionButton from '@/components/ActionButton';
import StatusBanner from '@/components/StatusBanner';
import { COLORS, LOCAL_ROOM } from '@/constants/app';
import { useTodos } from '@/stores/TodoContext';
import { isValidRoomCode, normalizeRoomCode } from '@/utils/id';

export default function SyncScreen() {
  const { room, setRoomCode, online, syncStatus, error, syncNow } = useTodos();
  const [code, setCode] = useState(room === LOCAL_ROOM ? '' : room);
  const [saving, setSaving] = useState(false);

  async function join() {
    const normalized = normalizeRoomCode(code);
    if (!isValidRoomCode(normalized)) {
      Alert.alert('코드 확인', '동기화 코드는 영문 소문자, 숫자, 하이픈으로 8~64자 입력해주세요.');
      return;
    }
    try {
      setSaving(true);
      await setRoomCode(normalized);
      router.back();
    } catch (e) {
      Alert.alert('연결 실패', e.message);
    } finally {
      setSaving(false);
    }
  }

  function disconnect() {
    Alert.alert('동기화 해제', '공유 공간에서 나가면 기존 공유 할 일은 이 기기에서 보이지 않습니다. 다시 같은 코드를 입력하면 조회할 수 있습니다.', [
      { text: '취소', style: 'cancel' },
      { text: '해제', style: 'destructive', onPress: async () => {
        try {
          await setRoomCode(LOCAL_ROOM);
          setCode('');
          router.back();
        } catch (e) {
          Alert.alert('해제 실패', e.message);
        }
      } },
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.heading}>기기 간 동기화</Text>
      <StatusBanner room={room} online={online} status={syncStatus} error={error} />
      <Text style={styles.description}>
        두 기기에 동일한 동기화 코드를 입력하면 하나의 할 일 목록을 공유합니다. 처음 연결할 때 기기에만 있던 할 일도 공유 공간에 등록됩니다.
      </Text>
      <Text style={styles.label}>동기화 코드</Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="예: team-todo-demo-2026"
        maxLength={64}
      />
      <ActionButton title="이 코드로 연결" loading={saving} onPress={join} />
      {room !== LOCAL_ROOM && (
        <View style={styles.extra}>
          <ActionButton title="지금 동기화" outline disabled={!online} onPress={syncNow} />
          <ActionButton title="동기화 해제" outline danger onPress={disconnect} style={{ marginTop: 10 }} />
        </View>
      )}
      <View style={styles.warning}>
        <Text style={styles.warningText}>
          [개발·시연 전용] 현재 버전에는 사용자 인증이 없다. 동기화 코드는 계정이나 접근 권한을 보장하지 않는다. 실제 사용자 데이터에 사용하거나 공개 배포하지 않는다.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 18, flexGrow: 1, backgroundColor: COLORS.background },
  heading: { fontSize: 21, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  description: { fontSize: 14, lineHeight: 22, color: COLORS.muted, marginBottom: 20 },
  label: { fontWeight: '700', marginBottom: 8, color: COLORS.text },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: COLORS.line, borderRadius: 10, paddingHorizontal: 12, minHeight: 48, marginBottom: 14 },
  extra: { marginTop: 12 },
  warning: { padding: 14, borderRadius: 10, backgroundColor: COLORS.warningBg, marginTop: 30 },
  warningText: { color: COLORS.warning, lineHeight: 20, fontSize: 12 },
});
