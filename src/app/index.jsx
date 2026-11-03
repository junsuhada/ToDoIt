import { useMemo, useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform,
  Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTodos } from '@/stores/TodoContext';
import { ensureAnonymousUser } from '@/services/firebase/auth';
import { colors as c } from '@/constants/theme';
import TodoRow from '@/components/TodoRow';
import EmptyState from '@/components/EmptyState';
import ConflictModal from '@/components/ConflictModal';
import OcrImport from '@/components/OcrImport';

const filters = [['all', '전체'], ['active', '해야 할 일'], ['done', '완료']];
const dateLabel = () => new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });
const fail = (error, title = '오류') => Alert.alert(title, error?.message || String(error));

function EditModal({ todo, onClose, onSave }) {
  const [value, setValue] = useState(todo?.title ?? '');
  const [busy, setBusy] = useState(false);
  const save = async () => {
    if (!value.trim()) return Alert.alert('확인', '할 일을 입력해 주세요.');
    setBusy(true);
    try { await onSave(todo.id, { title: value }); onClose(); }
    catch (err) { fail(err, '수정 실패'); }
    finally { setBusy(false); }
  };
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
        <View style={styles.editCard}>
          <Text style={styles.modalHeading}>할 일 수정</Text>
          <TextInput autoFocus maxLength={120} placeholder="무엇을 할까요?" placeholderTextColor={c.muted} style={styles.field} value={value} onChangeText={setValue} />
          <View style={styles.modalRow}>
            <Pressable style={[styles.modalBtn, styles.cancel]} onPress={onClose}><Text style={styles.cancelText}>취소</Text></Pressable>
            <Pressable style={[styles.modalBtn, styles.confirm]} disabled={busy} onPress={save}><Text style={styles.confirmText}>저장</Text></Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function TodoScreen() {
  const {
    user, todos, online, syncStatus, pending, error, conflicts,
    add, edit, remove, resolveConflict, syncNow,
  } = useTodos();
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const [ocrOpen, setOcrOpen] = useState(false);
  const countDone = todos.filter((todo) => todo.completed).length;
  const progress = todos.length ? Math.round(countDone / todos.length * 100) : 0;
  const filtered = useMemo(() => todos.filter((todo) =>
    filter === 'all' || (filter === 'done' ? todo.completed : !todo.completed)
  ), [todos, filter]);
  const addTodo = async () => {
    if (!title.trim()) return;
    try { await add(title); setTitle(''); }
    catch (err) { fail(err, '추가 실패'); }
  };
  const confirmDelete = (todo) => Alert.alert('할 일 삭제', `“${todo.title}”을(를) 삭제할까요?`, [
    { text: '취소', style: 'cancel' },
    { text: '삭제', style: 'destructive', onPress: () => void remove(todo.id).catch((err) => fail(err, '삭제 실패')) },
  ]);
  const statusText = !online ? '오프라인 · 기기에 저장 중'
    : syncStatus === 'conflict' ? '충돌 해결이 필요해요'
    : syncStatus === 'error' ? '동기화 오류 · 로컬 데이터 유지'
    : syncStatus === 'synced' && pending === 0 ? '모든 변경사항 동기화 완료'
    : 'Firebase 동기화 진행 중';
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.page} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.topBar}>
          <View><Text style={styles.logo}>To Do <Text style={{ color: c.primary }}>it!</Text></Text><Text style={styles.date}>{dateLabel()}</Text></View>
          <View style={styles.profile}><Text style={styles.profileText}>개인 할 일</Text></View>
        </View>
        <View style={styles.hero}>
          <View style={{ flex: 1 }}><Text style={styles.heroEyebrow}>MY DAILY PLAN</Text><Text style={styles.heroTitle}>오늘도, 하나씩{`\n`}완료해 볼까요?</Text><Text style={styles.heroCaption}>작은 실천이 큰 변화를 만들어요.</Text></View>
          <View style={styles.progressOuter}><Text style={styles.progressValue}>{progress}%</Text><Text style={styles.progressCaption}>달성률</Text></View>
        </View>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View>
        <View style={styles.metrics}>
          <View style={styles.metricCard}><Text style={styles.metricLabel}>전체 할 일</Text><Text style={styles.metricNumber}>{todos.length}<Text style={styles.metricUnit}> 개</Text></Text></View>
          <View style={styles.metricCard}><Text style={styles.metricLabel}>완료</Text><Text style={[styles.metricNumber, { color: c.success }]}>{countDone}<Text style={styles.metricUnit}> 개</Text></Text></View>
          <View style={styles.metricCard}><Text style={styles.metricLabel}>남은 할 일</Text><Text style={styles.metricNumber}>{todos.length - countDone}<Text style={styles.metricUnit}> 개</Text></Text></View>
        </View>
        <View style={styles.sectionTitleRow}><Text style={styles.sectionTitle}>내 할 일</Text><Text style={styles.sectionCount}>{todos.length}개의 일정</Text></View>
        <View style={styles.filters}>{filters.map(([key, label]) => (
          <Pressable key={key} onPress={() => setFilter(key)} style={[styles.filterChip, filter === key && styles.activeChip]}>
            <Text style={[styles.filterText, filter === key && styles.activeFilterText]}>{label}</Text>
          </Pressable>
        ))}</View>
        {filtered.length ? filtered.map((todo) => (
          <TodoRow key={todo.id} todo={todo} onToggle={() => void edit(todo.id, { completed: !todo.completed }).catch((err) => fail(err))}
            onEdit={() => setEditing(todo)} onRemove={() => confirmDelete(todo)} />
        )) : <EmptyState filtered={filter !== 'all'} />}
        <View style={styles.addBox}>
          <Text style={styles.addTitle}>+ 새로운 할 일</Text>
          <View style={styles.inputRow}>
            <TextInput style={styles.addInput} placeholder="새로운 할 일을 입력해 주세요" placeholderTextColor={c.muted} maxLength={120} value={title} onChangeText={setTitle} onSubmitEditing={addTodo} returnKeyType="done" />
            <Pressable style={styles.plusButton} onPress={() => void addTodo()}><Text style={styles.plus}>＋</Text></Pressable>
          </View>
          <Pressable style={styles.ocrBtn} onPress={() => setOcrOpen(true)}>
            <Text style={styles.ocrIcon}>▧</Text><Text style={styles.ocrText}>사진에서 할 일 가져오기</Text><Text style={styles.ocrArrow}>›</Text>
          </Pressable>
        </View>
        <View style={styles.statusBox}>
          <View style={[styles.statusDot, { backgroundColor: !online ? c.warning : syncStatus === 'error' ? c.danger : c.success }]} />
          <View style={{ flex: 1 }}><Text style={styles.statusLabel}>{statusText}</Text><Text style={styles.statusHint}>미전송 변경 {pending}개 · {user?.isAnonymous ? '익명 계정' : '현재 계정'}</Text></View>
          <Pressable onPress={() => void syncNow()} disabled={!online} style={styles.refresh}><Text style={styles.refreshText}>↻ 동기화</Text></Pressable>
        </View>
        {!!error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>
      {!!editing && <EditModal key={editing.id} todo={editing} onClose={() => setEditing(null)} onSave={edit} />}
      <ConflictModal conflict={conflicts[0]} onResolve={resolveConflict} />
      <OcrImport visible={ocrOpen} onClose={() => setOcrOpen(false)} />
    </SafeAreaView>
  );
}

export default function Home() {
  const { ready, user } = useTodos();
  if (!ready) return <View style={[styles.safe, styles.center]}><ActivityIndicator color={c.primary} size="large" /><Text style={{ color: c.muted, marginTop: 14 }}>할 일을 준비하고 있어요...</Text></View>;
  if (user) return <TodoScreen />;
  return (
    <SafeAreaView style={[styles.safe, styles.center]}>
      <Text style={{ color: c.ink, fontWeight: '800' }}>익명 인증 연결이 필요해요</Text>
      <Text style={{ color: c.muted, marginTop: 10, textAlign: 'center', paddingHorizontal: 24 }}>
        최초 실행에서 익명 계정을 만들려면 인터넷 연결이 필요합니다.
      </Text>
      <Pressable style={[styles.wideButton, { paddingHorizontal: 24 }]} onPress={() => void ensureAnonymousUser().catch((err) => fail(err, '인증 실패'))}>
        <Text style={styles.wideButtonText}>다시 연결</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.background }, center: { alignItems: 'center', justifyContent: 'center' }, page: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 50 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 25 },
  logo: { fontWeight: '900', color: c.ink, fontSize: 25, letterSpacing: -0.7 }, date: { color: c.muted, fontSize: 12, marginTop: 5 },
  profile: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderRadius: 14, paddingHorizontal: 13, paddingVertical: 11 },
  profileText: { fontSize: 12, fontWeight: '700', color: c.muted },
  hero: { flexDirection: 'row', alignItems: 'center', backgroundColor: c.primary, padding: 22, borderTopLeftRadius: 24, borderTopRightRadius: 24, minHeight: 160 },
  heroEyebrow: { color: '#D4D0FF', fontSize: 10, letterSpacing: 1.7, fontWeight: '800' },
  heroTitle: { color: 'white', fontWeight: '800', fontSize: 23, lineHeight: 32, marginTop: 12 },
  heroCaption: { color: '#E0DEFF', fontSize: 11, marginTop: 11 },
  progressOuter: { width: 90, height: 90, borderRadius: 45, borderWidth: 7, borderColor: '#B6B1FF', alignItems: 'center', justifyContent: 'center', backgroundColor: '#7770FF' },
  progressValue: { color: 'white', fontSize: 21, fontWeight: '900' }, progressCaption: { color: '#E5E3FF', fontSize: 10, marginTop: 1 },
  progressTrack: { height: 6, backgroundColor: '#C9C6FF', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, overflow: 'hidden' },
  progressFill: { backgroundColor: '#2BD7BA', height: '100%' },
  metrics: { flexDirection: 'row', gap: 9, marginTop: 17 }, metricCard: { flex: 1, backgroundColor: c.surface, borderRadius: 17, borderColor: c.border, borderWidth: 1, paddingVertical: 17, paddingHorizontal: 13 },
  metricLabel: { fontSize: 11, color: c.muted }, metricNumber: { marginTop: 6, fontSize: 23, fontWeight: '900', color: c.ink }, metricUnit: { color: c.muted, fontSize: 12, fontWeight: '500' },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 29 },
  sectionTitle: { color: c.ink, fontSize: 20, fontWeight: '800' }, sectionCount: { color: c.muted, fontSize: 12 },
  filters: { flexDirection: 'row', gap: 8, marginTop: 16, marginBottom: 15 }, filterChip: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 22, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border },
  activeChip: { backgroundColor: c.primary, borderColor: c.primary }, filterText: { color: c.muted, fontSize: 12, fontWeight: '700' }, activeFilterText: { color: 'white' },
  addBox: { backgroundColor: c.surface, borderRadius: 20, padding: 17, borderWidth: 1, borderColor: c.border, marginTop: 18 },
  addTitle: { color: c.ink, fontWeight: '800', fontSize: 15 }, inputRow: { flexDirection: 'row', marginTop: 12, alignItems: 'center', gap: 10 },
  addInput: { flex: 1, backgroundColor: c.background, color: c.ink, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 13 },
  plusButton: { backgroundColor: c.primary, width: 46, height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 13 },
  plus: { color: 'white', fontSize: 25, fontWeight: '800', lineHeight: 31 },
  ocrBtn: { marginTop: 14, borderTopWidth: 1, borderColor: c.border, paddingTop: 14, flexDirection: 'row', alignItems: 'center' },
  ocrIcon: { color: c.primary, fontSize: 20 }, ocrText: { color: c.primary, fontSize: 12, fontWeight: '700', marginLeft: 10, flex: 1 }, ocrArrow: { color: c.primary, fontSize: 22 },
  statusBox: { flexDirection: 'row', backgroundColor: c.primarySoft, borderRadius: 15, paddingHorizontal: 13, paddingVertical: 14, marginTop: 19, alignItems: 'center', gap: 9 },
  statusDot: { width: 8, height: 8, borderRadius: 4 }, statusLabel: { color: c.ink, fontSize: 12, fontWeight: '700' }, statusHint: { fontSize: 10, color: c.muted, marginTop: 5 },
  refresh: { padding: 7 }, refreshText: { fontSize: 11, fontWeight: '700', color: c.primary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(22,27,49,.5)', justifyContent: 'center', padding: 24 }, editCard: { borderRadius: 23, padding: 23, backgroundColor: 'white' },
  modalHeading: { color: c.ink, fontSize: 20, fontWeight: '800', marginBottom: 14 }, modalRow: { flexDirection: 'row', gap: 10, marginTop: 18 }, modalBtn: { flex: 1, padding: 15, alignItems: 'center', borderRadius: 12 },
  cancel: { backgroundColor: c.background }, confirm: { backgroundColor: c.primary }, cancelText: { color: c.muted, fontWeight: '700' }, confirmText: { color: 'white', fontWeight: '700' },
  loginRoot: { flex: 1, padding: 24, justifyContent: 'center' }, brandIcon: { alignSelf: 'center', backgroundColor: c.primary, width: 66, height: 66, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  brandCheck: { fontSize: 36, color: 'white', fontWeight: '900' }, loginTitle: { marginTop: 14, fontSize: 30, color: c.ink, fontWeight: '900', textAlign: 'center' },
  loginSubtitle: { color: c.muted, textAlign: 'center', marginTop: 6 }, loginBox: { marginTop: 34, backgroundColor: c.surface, borderRadius: 23, padding: 22, borderWidth: 1, borderColor: c.border },
  loginHeading: { fontWeight: '800', fontSize: 18, color: c.ink, marginBottom: 21 }, fieldLabel: { fontSize: 12, fontWeight: '700', color: c.muted, marginBottom: 7, marginTop: 7 },
  field: { backgroundColor: c.background, borderColor: c.border, borderWidth: 1, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 13, fontSize: 14, color: c.ink, marginBottom: 10 },
  wideButton: { marginTop: 16, backgroundColor: c.primary, padding: 16, borderRadius: 13, alignItems: 'center' }, wideButtonText: { fontWeight: '800', color: 'white' },
  switchText: { color: c.primary, fontWeight: '700', fontSize: 12 }, loginHelp: { marginTop: 18, color: c.muted, textAlign: 'center', fontSize: 11 }, errorText: { color: c.danger, marginTop: 12, fontSize: 12 },
});
