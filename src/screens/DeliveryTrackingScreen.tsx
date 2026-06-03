import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Assets } from '../constants/assets';
import { colors, radius, spacing, shadow } from '../constants/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'DeliveryTracking'>;

const timeline = [
  { label: 'Request Created', time: '10:00 AM', done: true },
  { label: 'Vehicle Assigned', time: '10:05 AM', done: true },
  { label: 'Pickup Completed', time: '10:30 AM', done: true },
  { label: 'On Route', time: '10:35 AM', done: true, active: true },
  { label: 'Delivered', time: '11:00 AM', done: false },
];

export function DeliveryTrackingScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.scroll}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textNavy} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Delivery Tracking</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.block, shadow.card]}>
        <View style={styles.blockHead}>
          <Text style={styles.blockHeadText}>Order ID: FL12345</Text>
        </View>
        <View style={styles.timeline}>
          {timeline.map((step, i) => (
            <View key={step.label} style={[styles.step, step.active && styles.stepActive]}>
              <View style={styles.stepLeft}>
                <View style={[styles.dot, step.done && styles.dotDone, !step.done && styles.dotPending]}>
                  {step.done ? (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  ) : (
                    <View style={styles.dotInner} />
                  )}
                </View>
                {i < timeline.length - 1 ? <View style={[styles.line, step.done && styles.lineDone]} /> : null}
              </View>
              <View style={styles.stepBody}>
                <Text style={styles.stepLabel}>{step.label}</Text>
                <Text style={styles.stepTime}>{step.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.block, shadow.card, { marginTop: spacing.md }]}>
        <View style={styles.blockHead}>
          <Text style={styles.blockHeadText}>Driver Details</Text>
        </View>
        <View style={styles.driverRow}>
          <Image source={Assets.loginBg} style={styles.driverPhoto} resizeMode="cover" />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>Ramesh Kumar</Text>
            <Text style={styles.driverMeta}>Tractor 1</Text>
            <Text style={styles.driverMeta}>UP 12 AB 3456</Text>
          </View>
        </View>
        <View style={styles.etaBar}>
          <Text style={styles.etaText}>ETA: 20 mins</Text>
          <View style={styles.etaActions}>
            <TouchableOpacity style={styles.circleBtn}>
              <Ionicons name="call" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleBtn}>
              <Ionicons name="mail" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: 40 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  screenTitle: { fontSize: 18, fontWeight: '700', color: colors.textNavy },
  block: { borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.surface },
  blockHead: { backgroundColor: colors.primary, padding: spacing.md },
  blockHeadText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  timeline: { padding: spacing.md },
  step: { flexDirection: 'row', minHeight: 52 },
  stepActive: { backgroundColor: colors.lightGreen, marginHorizontal: -spacing.md, paddingHorizontal: spacing.md, borderRadius: radius.sm },
  stepLeft: { alignItems: 'center', width: 32 },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: colors.secondary },
  dotPending: { backgroundColor: '#E0E0E0' },
  dotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  line: { width: 2, flex: 1, backgroundColor: '#E0E0E0', minHeight: 20 },
  lineDone: { backgroundColor: colors.secondary },
  stepBody: { flex: 1, paddingLeft: spacing.md, paddingBottom: spacing.sm },
  stepLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  stepTime: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  driverRow: { flexDirection: 'row', padding: spacing.md, alignItems: 'center' },
  driverPhoto: { width: 64, height: 64, borderRadius: 32 },
  driverInfo: { marginLeft: spacing.md },
  driverName: { fontSize: 17, fontWeight: '700', color: colors.text },
  driverMeta: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  etaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lightGreen,
    margin: spacing.md,
    marginTop: 0,
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  etaText: { fontSize: 16, fontWeight: '700', color: colors.primary },
  etaActions: { flexDirection: 'row', gap: spacing.sm },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
