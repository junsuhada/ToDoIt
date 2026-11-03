import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { COLORS } from '@/constants/app';

export default function ActionButton({ title, onPress, outline = false, danger = false, disabled = false, loading = false, testID, style }) {
  return (
    <Pressable
      accessibilityRole="button"
      testID={testID}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button, outline ? styles.outline : styles.filled,
        danger && !outline && styles.danger,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={outline ? COLORS.primary : '#fff'} />
      ) : (
        <Text style={[styles.label, outline && styles.outlineLabel, danger && outline && styles.dangerLabel]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 46, paddingHorizontal: 16, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  filled: { backgroundColor: COLORS.primary },
  outline: { backgroundColor: '#fff', borderWidth: 1, borderColor: COLORS.line },
  danger: { backgroundColor: COLORS.danger },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.8 },
  label: { color: '#fff', fontSize: 15, fontWeight: '700' },
  outlineLabel: { color: COLORS.text },
  dangerLabel: { color: COLORS.danger },
});
