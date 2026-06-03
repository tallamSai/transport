import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout, SectionTitle, Header } from '../components';
import { deliveries } from '../data';
import type { DeliveryStatus } from '../types';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'DeliveryTracking'>;

const steps: { key: DeliveryStatus; label: string }[] = [
  { key: 'request_created', label: 'Request Created' },
  { key: 'vehicle_assigned', label: 'Vehicle Assigned' },
  { key: 'pickup_completed', label: 'Pickup Completed' },
  { key: 'on_route', label: 'On Route' },
  { key: 'delivered', label: 'Delivered' },
];

const statusOrder: DeliveryStatus[] = steps.map((s) => s.key);

export function DeliveryTrackingScreen({ navigation }: Props) {
  const delivery = deliveries[0];
  const currentIndex = statusOrder.indexOf(delivery.status);

  return (
    <ScreenLayout>
      <Header title="Delivery Tracking" onBack={() => navigation.goBack()} />
      <SectionTitle title="Shipment Status" subtitle={`${delivery.cropType} · ${delivery.quantity}`} />

      <View style={[styles.card, shadows.card]}>
        {steps.map((step, i) => {
          const done = i <= currentIndex;
          const active = i === currentIndex;
          return (
            <View key={step.key} style={styles.step}>
              <View style={[styles.circle, done && styles.circleDone, active && styles.circleActive]}>
                <Ionicons
                  name={done ? 'checkmark' : 'ellipse-outline'}
                  size={18}
                  color={done ? '#fff' : colors.textSecondary}
                />
              </View>
              <View style={styles.stepBody}>
                <Text style={[styles.stepLabel, done && styles.stepLabelDone]}>{step.label}</Text>
                {active ? <Text style={styles.current}>Current stage</Text> : null}
              </View>
              {i < steps.length - 1 ? <View style={[styles.line, done && styles.lineDone]} /> : null}
            </View>
          );
        })}
      </View>

      <SectionTitle title="Driver Details" />
      <View style={[styles.driver, shadows.card]}>
        <View style={styles.driverAvatar}>
          <Ionicons name="person" size={28} color={colors.primary} />
        </View>
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{delivery.driverName}</Text>
          <Text style={styles.driverMeta}>{delivery.vehicleName} · {delivery.vehicleType}</Text>
          <Text style={styles.driverPhone}>{delivery.phone}</Text>
        </View>
        <View style={styles.eta}>
          <Text style={styles.etaLabel}>ETA</Text>
          <Text style={styles.etaValue}>{delivery.eta}</Text>
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg },
  step: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.lg, position: 'relative' },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  circleDone: { backgroundColor: colors.success, borderColor: colors.success },
  circleActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  stepBody: { flex: 1 },
  stepLabel: { ...typography.body, color: colors.textSecondary },
  stepLabelDone: { color: colors.textPrimary, fontWeight: '600' },
  current: { ...typography.label, color: colors.primary, marginTop: 2 },
  line: {
    position: 'absolute',
    left: 17,
    top: 36,
    width: 2,
    height: 28,
    backgroundColor: colors.border,
  },
  lineDone: { backgroundColor: colors.success },
  driver: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  driverInfo: { flex: 1 },
  driverName: { ...typography.h3, color: colors.textPrimary },
  driverMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  driverPhone: { ...typography.label, color: colors.primary, marginTop: 4 },
  eta: { alignItems: 'center', backgroundColor: colors.primaryLight, padding: spacing.md, borderRadius: radius.md },
  etaLabel: { ...typography.label, color: colors.textSecondary },
  etaValue: { ...typography.h2, color: colors.primary, fontSize: 18 },
});
