import { StyleSheet } from 'react-native';
import { colors as c } from '@/constants/theme';

export const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(22,27,49,0.5)', justifyContent: 'center', padding: 24 },
  card: { borderRadius: 23, padding: 23, backgroundColor: c.surface },
  heading: { color: c.ink, fontSize: 20, fontWeight: '800', marginBottom: 14 },
  message: { color: c.ink, fontSize: 14, lineHeight: 21 },
  error: { color: c.danger, fontSize: 12, marginTop: 10 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 18 },
  button: { flex: 1, padding: 15, alignItems: 'center', borderRadius: 12 },
  cancel: { backgroundColor: c.background },
  confirm: { backgroundColor: c.danger },
  cancelText: { color: c.muted, fontWeight: '700' },
  confirmText: { color: 'white', fontWeight: '700' },
});
