import { StyleSheet, Text, View } from 'react-native';
import { colors as c } from '@/constants/theme';
export default function EmptyState({ filtered }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.illustration}><Text style={styles.symbol}>✓</Text></View>
      <Text style={styles.title}>{filtered ? '해당하는 할 일이 없어요' : '아직 등록된 할 일이 없어요'}</Text>
      <Text style={styles.desc}>{filtered ? '다른 필터를 선택해 보세요.' : '오늘 해야 할 일을 하나 추가해 볼까요?'}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 48 }, illustration: { backgroundColor: c.primarySoft, borderRadius: 40, width: 80, height: 80, justifyContent: 'center', alignItems: 'center' },
  symbol: { fontSize: 36, color: c.primary, fontWeight: '800' }, title: { color: c.ink, fontSize: 16, fontWeight: '700', marginTop: 18 }, desc: { fontSize: 13, color: c.muted, marginTop: 7 },
});
