import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FadeInView } from '../utils/animations';
import { ScreenLayout, DashboardCard, StatCard, SectionTitle } from '../components';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import { dashboardStats, recentActivity, todaySummary } from '../data';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList, MainTabParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeDashboard'>,
  BottomTabScreenProps<MainTabParamList>
>;

const quickActions = [
  { label: 'Register Farmer', icon: 'person-add' as const, screen: 'FarmerRegistration' as const },
  { label: 'Register Vehicle', icon: 'car' as const, screen: 'TransportProviderRegistration' as const },
  { label: 'Request Transport', icon: 'cube' as const, tab: 'Matching' as const },
  { label: 'Track Delivery', icon: 'navigate' as const, screen: 'DeliveryTracking' as const },
  { label: 'View Routes', icon: 'map' as const, tab: 'Routes' as const },
  { label: 'Notifications', icon: 'notifications' as const, screen: 'NotificationMonitoring' as const },
];

export function HomeDashboardScreen({ navigation }: Props) {
  return (
    <ScreenLayout>
      <Text style={styles.greeting}>Good Morning, Farmer 👋</Text>
      <Text style={styles.header}>FarmLift Dashboard</Text>

      <DashboardCard
        title="Smart Transport Matching System"
        description="Match crops with the right vehicle — fast, transparent, tracked."
        icon="leaf"
      />

      <SectionTitle title="Statistics" />
      <View style={styles.statsGrid}>
        <StatCard label="Active Vehicles" value={dashboardStats.activeVehicles} icon="car" index={0} />
        <StatCard label="Pending Deliveries" value={dashboardStats.pendingDeliveries} icon="time" index={1} />
        <StatCard label="Completed" value={dashboardStats.completedDeliveries} icon="checkmark-done" index={2} />
        <StatCard label="Requests" value={dashboardStats.transportRequests} icon="document-text" index={3} />
      </View>

      <SectionTitle title="Quick Actions" />
      <View style={styles.grid}>
        {quickActions.map((a, i) => (
          <FadeInView key={a.label} delay={i * 50}>
            <Pressable
              style={[styles.action, shadows.card]}
              onPress={() => {
                if ('screen' in a && a.screen) {
                  navigation.navigate(a.screen);
                } else if ('tab' in a && a.tab) {
                  navigation.getParent()?.navigate(a.tab as keyof MainTabParamList);
                }
              }}
            >
              <View style={styles.actionIcon}>
                <Ionicons name={a.icon} size={24} color={colors.primary} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </Pressable>
          </FadeInView>
        ))}
      </View>

      <SectionTitle title="Recent Activity" />
      {recentActivity.map((item) => (
        <View key={item.id} style={[styles.activity, shadows.card]}>
          <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={22} color={colors.primary} />
          <View style={styles.activityBody}>
            <Text style={styles.activityTitle}>{item.title}</Text>
            <Text style={styles.activitySub}>{item.subtitle}</Text>
          </View>
          <Text style={styles.activityTime}>{item.time}</Text>
        </View>
      ))}

      <SectionTitle title="Today's Delivery Summary" />
      <View style={[styles.summary, shadows.card]}>
        <SummaryItem label="Scheduled" value={String(todaySummary.scheduled)} />
        <SummaryItem label="In Transit" value={String(todaySummary.inTransit)} />
        <SummaryItem label="Completed" value={String(todaySummary.completed)} />
        <SummaryItem label="On-Time Rate" value={todaySummary.onTimeRate} />
      </View>
    </ScreenLayout>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  greeting: { ...typography.caption, color: colors.textSecondary },
  header: { ...typography.h1, color: colors.primary, marginBottom: spacing.lg },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'space-between' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  action: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionLabel: { ...typography.caption, color: colors.textPrimary, textAlign: 'center', fontWeight: '600' },
  activity: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  activityBody: { flex: 1 },
  activityTitle: { ...typography.h3, fontSize: 14, color: colors.textPrimary },
  activitySub: { ...typography.caption, color: colors.textSecondary },
  activityTime: { ...typography.label, color: colors.textSecondary, fontSize: 10 },
  summary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  summaryItem: { width: '50%', padding: spacing.sm, alignItems: 'center' },
  summaryValue: { ...typography.h2, color: colors.primary, fontSize: 20 },
  summaryLabel: { ...typography.caption, color: colors.textSecondary },
});
