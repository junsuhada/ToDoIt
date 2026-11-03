import { useState } from 'react';
import {
  ActivityIndicator, Alert, Modal, Pressable, ScrollView,
  StyleSheet, Text, View,
} from 'react-native';
import { recognizePhoto, PermissionDeniedError } from '@/services/ocr/recognize';
import { useTodos } from '@/stores/TodoContext';
import { colors as c } from '@/constants/theme';

export default function OcrImport({ visible, onClose }) {
  const { add } = useTodos();
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState([]);
  const [busy, setBusy] = useState(false);
  const [duration, setDuration] = useState(null);
  const close = () => {
    if (busy) return;
    setCandidates([]); setSelected([]); setDuration(null); onClose();
  };
  const scan = async (source) => {
    setBusy(true);
    try {
      const result = await recognizePhoto(source);
      if (!result) return;
      setCandidates(result.candidates);
      setSelected(result.candidates);
      setDuration(result.elapsedMs);
      if (!result.candidates.length) Alert.alert('텍스트를 찾지 못했습니다', '다른 사진으로 다시 시도해 주세요.');
    } catch (err) {
      Alert.alert(err instanceof PermissionDeniedError ? '권한 안내' : '인식 실패', err.message);
    } finally { setBusy(false); }
  };
  const save = async () => {
    if (!selected.length) return;
    setBusy(true);
    try {
      for (const text of selected) await add(text);
      setCandidates([]); setSelected([]); setDuration(null);
      onClose();
    } catch (err) { Alert.alert('저장 실패', err.message); }
    finally { setBusy(false); }
  };
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={close}>
      <View style={styles.root}>
        <View style={styles.header}>
          <View><Text style={styles.heading}>사진으로 할 일 추가</Text><Text style={styles.hint}>이미지는 기기에서만 인식하고 저장하지 않아요</Text></View>
          <Pressable accessibilityRole="button" accessibilityLabel="닫기" onPress={close}><Text style={styles.close}>✕</Text></Pressable>
        </View>
        <View style={styles.actionRow}>
          <Pressable style={[styles.action, { backgroundColor: c.primary }]} onPress={() => scan('camera')} disabled={busy}>
            <Text style={styles.actionLabel}>카메라로 촬영</Text>
          </Pressable>
          <Pressable style={[styles.action, styles.soft]} onPress={() => scan('library')} disabled={busy}>
            <Text style={[styles.actionLabel, { color: c.primary }]}>앨범에서 선택</Text>
          </Pressable>
        </View>
        {busy && <ActivityIndicator style={{ marginVertical: 22 }} color={c.primary} />}
        {duration != null && <Text style={styles.elapsed}>온디바이스 OCR: {duration}ms · README에 실측값 기록</Text>}
        <Text style={styles.label}>인식된 후보 {candidates.length}개 · 선택 {selected.length}개</Text>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {candidates.map((text) => {
            const checked = selected.includes(text);
            return <Pressable key={text} style={styles.candidate} onPress={() => setSelected((prev) => checked ? prev.filter((x) => x !== text) : [...prev, text])}>
              <View style={[styles.check, checked && styles.checkActive]}><Text style={styles.checkText}>{checked ? '✓' : ''}</Text></View>
              <Text style={styles.candidateText}>{text}</Text>
            </Pressable>;
          })}
          {!candidates.length && !busy && <Text style={styles.empty}>사진을 촬영하거나 선택하면 할 일 후보가 표시돼요.</Text>}
        </ScrollView>
        <Pressable style={[styles.save, (!selected.length || busy) && { opacity: 0.45 }]} disabled={!selected.length || busy} onPress={save}>
          <Text style={styles.actionLabel}>선택한 {selected.length}개 저장하기</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 22, paddingTop: 44, paddingBottom: 24, backgroundColor: c.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  heading: { fontSize: 22, fontWeight: '800', color: c.ink },
  hint: { fontSize: 12, color: c.muted, marginTop: 8 }, close: { fontSize: 24, color: c.muted },
  actionRow: { flexDirection: 'row', gap: 10 }, action: { flex: 1, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  actionLabel: { color: 'white', fontWeight: '700', fontSize: 14 }, soft: { backgroundColor: c.primarySoft },
  elapsed: { marginVertical: 16, fontSize: 12, color: c.success }, label: { marginTop: 24, marginBottom: 14, color: c.ink, fontWeight: '700' },
  candidate: { backgroundColor: 'white', borderRadius: 13, padding: 15, marginBottom: 9, flexDirection: 'row', alignItems: 'center', gap: 12 },
  candidateText: { color: c.ink, flex: 1 }, check: { width: 22, height: 22, borderWidth: 1.5, borderColor: c.border, borderRadius: 7 },
  checkActive: { backgroundColor: c.primary, borderColor: c.primary }, checkText: { color: 'white', textAlign: 'center', fontWeight: '800' },
  empty: { textAlign: 'center', marginTop: 34, color: c.muted, lineHeight: 22 },
  save: { backgroundColor: c.primary, padding: 17, borderRadius: 14, alignItems: 'center' },
});
