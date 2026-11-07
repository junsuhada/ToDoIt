import { colors as c } from '@/constants/theme';
import { Text, View } from 'react-native';
import { styles } from './styles';

const dateLabel = () =>
  new Date().toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

export default function HomeOverview({ total, countDone, progress }) {
  return (
    <>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.logo}>
            To Do <Text style={{ color: c.primary }}>it!</Text>
          </Text>
          <Text style={styles.date}>{dateLabel()}</Text>
        </View>

        <View style={styles.profile}>
          <Text style={styles.profileText}>개인 할 일</Text>
        </View>
      </View>

      <View style={styles.hero}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heroEyebrow}>MY DAILY PLAN</Text>
          <Text style={styles.heroTitle}>
            오늘도, 하나씩{'\n'}완료해 볼까요?
          </Text>
          <Text style={styles.heroCaption}>
            작은 실천이 큰 변화를 만들어요.
          </Text>
        </View>

        <View style={styles.progressOuter}>
          <Text style={styles.progressValue}>{progress}%</Text>
          <Text style={styles.progressCaption}>달성률</Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress}%` },
          ]}
        />
      </View>

      <View style={styles.metrics}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>전체 할 일</Text>
          <Text style={styles.metricNumber}>
            {total}
            <Text style={styles.metricUnit}> 개</Text>
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>완료</Text>
          <Text style={[styles.metricNumber, { color: c.success }]}>
            {countDone}
            <Text style={styles.metricUnit}> 개</Text>
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>남은 할 일</Text>
          <Text style={styles.metricNumber}>
            {total - countDone}
            <Text style={styles.metricUnit}> 개</Text>
          </Text>
        </View>
      </View>
    </>
  );
}