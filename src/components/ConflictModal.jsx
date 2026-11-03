import { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors as c } from '@/constants/theme';

export default function ConflictModal({ conflict, onResolve }) {
  const [busy, setBusy] = useState(false);
  if (!conflict) return null;
  const choose = async (choice) => {
    setBusy(true);
    try { await onResolve(conflict.id, choice); }
    catch (err) { Alert.alert('충돌 해결 실패', err.message); }
    finally { setBusy(false); }
  };
  const content = (item) => item == null || item.deleted
    ? '삭제된 항목' : `${item.title}\n${item.completed ? '완료' : '진행 중'}`;
  return (
    <Modal visible transparent animationType="fade" onRequestClose={() => {}}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.icon}>!</Text>
          <Text style={styles.title}>동기화 충돌</Text>
          <Text style={styles.desc}>다른 기기에서 같은 항목이 변경되었어요. 어떤 내용을 남길까요?</Text>
          <View style={styles.compare}><Text style={styles.label}>이 기기의 변경</Text><Text style={styles.value}>{content(conflict.local)}</Text></View>
          <View style={styles.compare}><Text style={styles.label}>Firebase에 저장된 변경</Text><Text style={styles.value}>{content(conflict.remote)}</Text></View>
          <Pressable disabled={busy} style={styles.primary} onPress={() => choose('local')}><Text style={styles.primaryText}>이 기기 내용 유지</Text></Pressable>
          <Pressable disabled={busy} style={styles.secondary} onPress={() => choose('server')}><Text style={styles.secondaryText}>서버 내용 사용</Text></Pressable>
          <Text style={styles.note}>선택 전에는 어느 쪽도 덮어쓰지 않습니다.</Text>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(22,27,49,.56)', justifyContent: 'center', padding: 22 },
  card: { backgroundColor: 'white', borderRadius: 25, padding: 23 },
  icon: { width: 35, height: 35, textAlign: 'center', textAlignVertical: 'center', backgroundColor: c.warningSoft, color: c.warning, fontWeight: '900', borderRadius: 12, overflow: 'hidden' },
  title: { fontSize: 22, fontWeight: '800', color: c.ink, marginTop: 12 }, desc: { color: c.muted, lineHeight: 22, marginTop: 8, marginBottom: 13 },
  compare: { backgroundColor: c.background, borderRadius: 13, padding: 13, marginBottom: 9 },
  label: { color: c.muted, fontSize: 12, fontWeight: '600' }, value: { color: c.ink, fontWeight: '600', marginTop: 6, lineHeight: 20 },
  primary: { backgroundColor: c.primary, alignItems: 'center', padding: 15, borderRadius: 12, marginTop: 13 }, primaryText: { color: 'white', fontWeight: '700' },
  secondary: { backgroundColor: c.primarySoft, alignItems: 'center', padding: 15, borderRadius: 12, marginTop: 8 }, secondaryText: { color: c.primary, fontWeight: '700' },
  note: { textAlign: 'center', fontSize: 11, color: c.muted, marginTop: 13 },
});
