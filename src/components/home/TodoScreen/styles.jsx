import { StyleSheet } from 'react-native';
import { colors as c } from '@/constants/theme';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.background },
  page: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 50 },
  center: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  hint: { color: c.muted, fontSize: 13, marginTop: 14, textAlign: 'center' },
  errorText: { color: c.danger, fontSize: 13, marginTop: 14, textAlign: 'center' },
  retryButton: { marginTop: 20, backgroundColor: c.primary, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 14 },
  retryText: { color: 'white', fontWeight: '700' },
});
