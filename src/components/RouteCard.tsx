import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RouteInfo } from '../types';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';

interface Props {
  route: RouteInfo;
}

export function RouteCard({ route }: Props) {
  return (
    <View style={[styles.card, shadows.card, route.isBest && styles.best]}>
      <View style={styles.header}>
        <Ionicons name={route.isBest ? 'star' : 'git-branch'} size={20} color={route.isBest ? colors.accent : colors.primary} />
        <Text style={styles.name}>{route.name}</Text>
        {route.isBest ? (
          <View style={styles.bestTag}>
            <Text style={styles.bestText}>Recommended</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.row}>
        <Ionicons name="location" size={16} color={colors.secondary} />
        <Text style={styles.detail}>{route.farmerLocation} → {route.destinationMandi}</Text>
      </View>
      <View style={styles.stats}>
        <Stat label="Distance" value={route.distance} />
        <Stat label="ETA" value={route.estimatedTime} />
        <Stat label="Fuel" value={route.fuelCost} />
        <Stat label="Cost" value={route.transportCost} />
      </View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  best: { borderColor: colors.primary, borderWidth: 2 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  name: { ...typography.h3, color: colors.textPrimary, flex: 1 },
  bestTag: { backgroundColor: colors.primaryLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.sm },
  bestText: { ...typography.label, color: colors.primary, fontSize: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  detail: { ...typography.caption, color: colors.textSecondary, flex: 1 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  stat: { minWidth: '40%' },
  statLabel: { ...typography.label, color: colors.textSecondary },
  statValue: { ...typography.h3, color: colors.primary, fontSize: 15 },
});
