import { StyleSheet } from 'react-native';
import { colors as c } from '@/constants/theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: c.surface, borderRadius: 17, paddingVertical: 15,
    paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center',
    marginBottom: 11, gap: 11, borderWidth: 1, borderColor: c.border,
  },
  checkbox: {
    borderWidth: 2, borderColor: '#CBD0E0', borderRadius: 9,
    width: 27, height: 27, alignItems: 'center', justifyContent: 'center',
  },
  checked: { backgroundColor: c.primary, borderColor: c.primary },
  checkmark: { color: 'white', fontWeight: '900' },
  main: { flex: 1 },
  title: { color: c.ink, fontSize: 15, fontWeight: '600' },
  finished: { color: c.muted, textDecorationLine: 'line-through' },
  subtitle: { color: c.muted, fontSize: 11, marginTop: 5 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: { paddingHorizontal: 5, paddingVertical: 3 },
  actionText: { color: c.primary, fontSize: 12, fontWeight: '700' },
  deleteText: { color: c.danger, fontSize: 12, fontWeight: '700' },
});
