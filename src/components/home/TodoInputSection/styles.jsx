import { StyleSheet } from 'react-native';
import { colors as c } from '@/constants/theme';

export const styles = StyleSheet.create({
  addBox: {
    backgroundColor: c.surface,
    borderRadius: 20,
    padding: 17,
    borderWidth: 1,
    borderColor: c.border,
    marginTop: 18,
  },

  addTitle: {
    color: c.ink,
    fontWeight: '800',
    fontSize: 15,
  },

  inputRow: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
    gap: 10,
  },

  addInput: {
    flex: 1,
    backgroundColor: c.background,
    color: c.ink,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 13,
  },

  plusButton: {
    backgroundColor: c.primary,
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
  },

  plus: {
    color: 'white',
    fontSize: 25,
    fontWeight: '800',
    lineHeight: 31,
  },
});