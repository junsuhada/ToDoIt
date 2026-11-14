import { StyleSheet } from 'react-native';
import { colors as c } from '@/constants/theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(22,27,49,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  backdrop: { ...StyleSheet.absoluteFillObject },
  card: { borderRadius: 23, padding: 23, backgroundColor: c.surface },
  heading: { color: c.ink, fontSize: 20, fontWeight: '800', marginBottom: 14 },
  field: {
    backgroundColor: c.background,
    borderColor: c.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 13,
    fontSize: 14,
    color: c.ink,
  },
  error: { color: c.danger, fontSize: 12, marginTop: 10 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 18 },
  button: { flex: 1, padding: 15, alignItems: 'center', borderRadius: 12 },
  cancel: { backgroundColor: c.background },
  confirm: { backgroundColor: c.primary },
  cancelText: { color: c.muted, fontWeight: '700' },
  confirmText: { color: 'white', fontWeight: '700' },
});
