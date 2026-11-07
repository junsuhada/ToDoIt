import { StyleSheet } from 'react-native';
import { colors as c } from '@/constants/theme';

export const styles = StyleSheet.create({
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 29,
  },

  sectionTitle: {
    color: c.ink,
    fontSize: 20,
    fontWeight: '800',
  },

  sectionCount: {
    color: c.muted,
    fontSize: 12,
  },

  list: {
    marginTop: 16,
  },
});