import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { Vehicle } from '../types';
import { vehicleImage } from '../constants/images';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import { formatStatus } from '../utils/format';

interface Props {
  vehicle: Vehicle;
  onPress?: () => void;
  compact?: boolean;
}

export function ImageVehicleCard({ vehicle, onPress, compact }: Props) {
  const statusColor =
    vehicle.status === 'available' ? colors.success : vehicle.status === 'busy' ? colors.accent : colors.textSecondary;

  return (
    <Pressable onPress={onPress} style={[styles.card, shadows.card, compact && styles.compact]}>
      <Image source={{ uri: vehicleImage(vehicle.type) }} style={styles.photo} contentFit="cover" />
      <View style={styles.body}>
        <Text style={styles.name}>{vehicle.name}</Text>
        <Text style={styles.meta}>{vehicle.type} · {vehicle.capacity}</Text>
        <View style={styles.row}>
          <Ionicons name="location" size={14} color={colors.primary} />
          <Text style={styles.loc}>{vehicle.location} · {vehicle.distance}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: `${statusColor}22` }]}>
          <Text style={[styles.badgeText, { color: statusColor }]}>{formatStatus(vehicle.status)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  compact: { marginBottom: spacing.sm },
  photo: { width: 110, height: '100%', minHeight: 100 },
  body: { flex: 1, padding: spacing.md, justifyContent: 'center' },
  name: { ...typography.h3, color: colors.textPrimary },
  meta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  loc: { ...typography.caption, color: colors.textPrimary, flex: 1 },
  badge: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeText: { ...typography.label, fontSize: 11 },
});
