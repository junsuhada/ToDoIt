import { StyleSheet } from 'react-native';
import { colors as c } from '@/constants/theme';

export const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 48,
  },

  illustration: {
    backgroundColor: c.primarySoft,
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },

  symbol: {
    fontSize: 36,
    color: c.primary,
    fontWeight: '800',
  },

  title: {
    color: c.ink,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 18,
  },

  desc: {
    fontSize: 13,
    color: c.muted,
    marginTop: 7,
  },
});