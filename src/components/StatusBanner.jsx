import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, LOCAL_ROOM } from '@/constants/app';

export default function StatusBanner({ room, online, status, error }) {
  let label = '기기에만 저장 중';
  let backgroundColor = '#E2E8F0';
  if (room !== LOCAL_ROOM) {
    if (!online || status === 'offline') {
      label = '오프라인 · 변경사항은 기기에 저장됩니다.';
      backgroundColor = COLORS.warningBg;
    } else if (status === 'syncing') {
      label = '서버와 동기화 중…';
      backgroundColor = '#DBEAFE';
    } else if (status === 'error') {
      label = `동기화 오류 · ${error || '연결을 확인하세요.'}`;
      backgroundColor = '#FEE2E2';
    } else {
      label = '서버 동기화 완료';
      backgroundColor = COLORS.successBg;
    }
  }
  return (
    <View style={[styles.banner, { backgroundColor }]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { borderRadius: 9, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  text: { color: COLORS.text, fontSize: 12, fontWeight: '600' },
});
