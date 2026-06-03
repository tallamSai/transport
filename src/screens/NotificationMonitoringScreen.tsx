import { StyleSheet, Text, View } from 'react-native';
import { ScreenLayout, NotificationCard, SectionTitle, StatCard, SimpleBarChart, SimpleDonutChart, Header } from '../components';
import { notifications, monitoringStats } from '../data';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'NotificationMonitoring'>;

export function NotificationMonitoringScreen({ navigation }: Props) {
  return (
    <ScreenLayout>
      <Header title="Notifications" subtitle="Phase 5 — Monitoring" onBack={() => navigation.goBack()} />
      <SectionTitle title="Real-time Alerts" />

      {notifications.map((n) => (
        <NotificationCard key={n.id} item={n} />
      ))}

      <SectionTitle title="Monitoring Dashboard" />
      <View style={styles.statsRow}>
        <StatCard label="Deliveries Today" value={monitoringStats.deliveriesToday} icon="cube" index={0} />
        <StatCard label="On-Time Rate" value={`${monitoringStats.onTimeRate}%`} icon="trending-up" index={1} />
      </View>
      <View style={[styles.costCard, shadows.card]}>
        <Text style={styles.costLabel}>Cost Savings</Text>
        <Text style={styles.costValue}>₹{monitoringStats.costSaved.toLocaleString()}</Text>
      </View>

      <SimpleBarChart title="Vehicle Utilization" data={monitoringStats.vehicleUtilization} />
      <SimpleDonutChart
        title="Delivery Status"
        completed={monitoringStats.deliveryStatus.completed}
        inTransit={monitoringStats.deliveryStatus.inTransit}
        pending={monitoringStats.deliveryStatus.pending}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  costCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  costLabel: { ...typography.caption, color: 'rgba(255,255,255,0.8)' },
  costValue: { ...typography.h1, color: '#fff', fontSize: 32 },
});
