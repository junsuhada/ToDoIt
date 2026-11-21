import { StyleSheet } from 'react-native';
import { colors as c } from '@/constants/theme';

export const styles = StyleSheet.create({
  box: {
    marginTop: 16, padding: 13, borderWidth: 1, borderColor: c.border,
    backgroundColor: c.surface, borderRadius: 14, flexDirection: 'row',
    alignItems: 'center', gap: 10,
  },
  content: { flex: 1 },
  title: { fontSize: 13, color: c.ink, fontWeight: '800' },
  caption: { fontSize: 11, color: c.muted, marginTop: 4, lineHeight: 16 },
  button: {
    backgroundColor: c.primary, paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: 10,
  },
  buttonDisabled: { opacity: 0.45 },
  buttonText: { fontSize: 11, color: 'white', fontWeight: '700' },
  compact: {
    justifyContent: 'flex-end',
  },
});
