import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FadeInView } from '../utils/animations';
import type { Vehicle } from '../types';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import { formatStatus, getVehicleIcon } from '../utils/format';

interface Props {
  vehicle: Vehicle;
  index?: number;
  onPress?: () => void;
}

export function VehicleCard({ vehicle, index = 0, onPress }: Props) {
  const statusColor =
    vehicle.status === 'available'
      ? colors.success
      : vehicle.status === 'busy'
        ? colors.accent
        : colors.textSecondary;

  return (
    <FadeInView delay={index * 60} slideFrom={20}>
      <Pressable onPress={onPress} style={[styles.card, shadows.card]}>
        <View style={styles.iconBox}>
          <Ionicons name={getVehicleIcon(vehicle.type)} size={28} color={colors.primary} />
        </View>
        <View style={styles.body}>
          <Text style={styles.name}>{vehicle.name}</Text>
          <Text style={styles.meta}>
            {vehicle.type} · {vehicle.capacity}
          </Text>
          <Text style={styles.loc}>{vehicle.location}</Text>
          <Text style={styles.dist}>{vehicle.distance} away</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: `${statusColor}22` }]}>
          <Text style={[styles.badgeText, { color: statusColor }]}>{formatStatus(vehicle.status)}</Text>
        </View>
      </Pressable>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  body: { flex: 1 },
  name: { ...typography.h3, color: colors.textPrimary },
  meta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  loc: { ...typography.caption, color: colors.textPrimary, marginTop: 4 },
  dist: { ...typography.label, color: colors.primary, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.full },
  badgeText: { ...typography.label, fontSize: 11 },
});
