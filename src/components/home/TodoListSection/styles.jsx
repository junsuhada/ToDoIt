import { StyleSheet } from 'react-native';
import { colors as c } from '@/constants/theme';

export const styles = StyleSheet.create({
  sectionTitleRow: {
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 29,
  },
  sectionTitle: { color: c.ink, fontSize: 20, fontWeight: '800' },
  sectionCount: { color: c.muted, fontSize: 12 },
  filters: { flexDirection: 'row', gap: 8, marginTop: 16, marginBottom: 12 },
  filterChip: {
    paddingVertical: 10, paddingHorizontal: 15, borderRadius: 22,
    backgroundColor: c.surface, borderWidth: 1, borderColor: c.border,
  },
  activeChip: { backgroundColor: c.primary, borderColor: c.primary },
  filterText: { color: c.muted, fontSize: 12, fontWeight: '700' },
  activeFilterText: { color: 'white' },
  list: { marginTop: 6 },
});
