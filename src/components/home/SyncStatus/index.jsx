import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from './styles';

const LABELS = {
  connecting: '서버에 연결 중...',
  uploading: '서버에 반영 중...',
  synced: '동기화 완료',
  offline: '오프라인 · 기기에 저장 중',
  error: '동기화 확인 필요',
};

export default function SyncStatus({ online, status, error, pendingCount, onRefresh }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);

    if (status !== 'synced') return;

    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [status]);

  if (!visible) return null;

  return (
    <View style={styles.box}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {LABELS[status] || LABELS.connecting}
        </Text>
        <Text style={styles.caption}>
          {error || (pendingCount > 0
            ? `서버에 반영할 변경 ${pendingCount}개 · 로컬 저장됨`
            : '변경 사항은 SQLite에도 저장됩니다.')}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Firebase 새로고침"
        disabled={!online}
        onPress={onRefresh}
        style={[styles.button, !online && styles.buttonDisabled]}
      >
        <Text style={styles.buttonText}>새로고침</Text>
      </Pressable>
    </View>
  );
}