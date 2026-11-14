import { Text, View } from 'react-native';
import { styles } from './styles';

export default function EmptyState({ filtered = false }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.illustration}><Text style={styles.symbol}>✓</Text></View>
      <Text style={styles.title}>
        {filtered ? '조건에 맞는 할 일이 없어요' : '아직 등록된 할 일이 없어요'}
      </Text>
      <Text style={styles.desc}>
        {filtered ? '다른 필터를 선택해 보세요.' : '오늘 해야 할 일을 하나 추가해 볼까요?'}
      </Text>
    </View>
  );
}
