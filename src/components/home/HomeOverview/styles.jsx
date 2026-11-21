import { StyleSheet } from 'react-native';
import { colors as c } from '@/constants/theme';

export const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  logo: {
    fontWeight: '900',
    color: c.ink,
    fontSize: 25,
    letterSpacing: -0.7,
  },

  date: {
    color: c.muted,
    fontSize: 12,
    marginTop: 5,
  },

  profile: {
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },

  profileText: {
    fontSize: 12,
    fontWeight: '700',
    color: c.muted,
  },

  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.primary,
    padding: 22,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 160,
  },

  heroEyebrow: {
    color: '#D4D0FF',
    fontSize: 10,
    letterSpacing: 1.7,
    fontWeight: '800',
  },

  heroTitle: {
    color: 'white',
    fontWeight: '800',
    fontSize: 23,
    lineHeight: 32,
    marginTop: 12,
  },

  heroCaption: {
    color: '#E0DEFF',
    fontSize: 11,
    marginTop: 11,
  },

  progressOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 7,
    borderColor: '#B6B1FF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7770FF',
  },

  progressValue: {
    color: 'white',
    fontSize: 21,
    fontWeight: '900',
  },

  progressCaption: {
    color: '#E5E3FF',
    fontSize: 10,
    marginTop: 1,
  },

  progressTrack: {
    height: 6,
    backgroundColor: '#C9C6FF',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
  },

  progressFill: {
    backgroundColor: '#2BD7BA',
    height: '100%',
  },

  metrics: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 17,
  },

  metricCard: {
    flex: 1,
    backgroundColor: c.surface,
    borderRadius: 17,
    borderColor: c.border,
    borderWidth: 1,
    paddingVertical: 17,
    paddingHorizontal: 13,
  },

  metricLabel: {
    fontSize: 11,
    color: c.muted,
  },

  metricNumber: {
    marginTop: 6,
    fontSize: 23,
    fontWeight: '900',
    color: c.ink,
  },

  metricUnit: {
    color: c.muted,
    fontSize: 12,
    fontWeight: '500',
  },
});