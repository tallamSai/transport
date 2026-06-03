import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout, RouteCard, SectionTitle, StaticMap } from '../components';
import { routes } from '../data';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';

export function RouteOptimizationScreen() {
  const best = routes.find((r) => r.isBest)!;

  const timeline = [
    { label: 'Pickup Time', value: best.pickupTime, icon: 'time' as const },
    { label: 'Delivery Time', value: best.deliveryTime, icon: 'flag' as const },
    { label: 'Arrival Time', value: best.arrivalTime, icon: 'checkmark-circle' as const },
  ];

  return (
    <ScreenLayout>
      <SectionTitle title="Route Optimization" subtitle="Phase 4 — Best & alternate routes" />

      <View style={[styles.topCard, shadows.card]}>
        <Text style={styles.topTitle}>Optimized Route</Text>
        <StaticMap gpsActive={false} />
      </View>

      {routes.map((r) => (
        <RouteCard key={r.id} route={r} />
      ))}

      <SectionTitle title="Schedule" />
      <View style={[styles.timeline, shadows.card]}>
        {timeline.map((item, i) => (
          <View key={item.label} style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={[styles.dot, i < timeline.length - 1 && styles.dotLine]} />
              <Ionicons name={item.icon} size={20} color={colors.primary} style={styles.timelineIcon} />
            </View>
            <View style={styles.timelineBody}>
              <Text style={styles.timelineLabel}>{item.label}</Text>
              <Text style={styles.timelineValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  topCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  topTitle: { ...typography.h3, color: colors.primary, marginBottom: spacing.sm },
  timeline: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg },
  timelineItem: { flexDirection: 'row', marginBottom: spacing.lg },
  timelineLeft: { alignItems: 'center', width: 40 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.secondary },
  dotLine: { position: 'absolute', top: 16, width: 2, height: 40, backgroundColor: colors.border },
  timelineIcon: { marginTop: spacing.sm },
  timelineBody: { flex: 1, marginLeft: spacing.md },
  timelineLabel: { ...typography.caption, color: colors.textSecondary },
  timelineValue: { ...typography.h3, color: colors.textPrimary },
});
