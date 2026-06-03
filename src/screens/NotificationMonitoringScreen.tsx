import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Assets } from '../constants/assets';
import { SimpleBarChart, SimpleDonutChart } from '../components/SimpleCharts';
import { colors, radius, spacing, shadow } from '../constants/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'NotificationMonitoring'>;

const notifications = [
  {
    title: 'To Farmer',
    msg: 'Your transport has been assigned. Tractor 1 is on the way.',
    time: '10:00 AM',
    avatar: Assets.tractor1,
    round: true,
  },
  {
    title: 'To Driver',
    msg: 'Pickup: Rampur Village Drop: City Mandi',
    time: '10:01 AM',
    avatar: Assets.truck2,
    round: true,
  },
  {
    title: 'Delivery Update',
    msg: 'Your crop has been delivered successfully.',
    time: '10:00 AM',
    icon: 'notifications' as const,
    round: false,
  },
];

export function NotificationMonitoringScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.scroll}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textNavy} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      {notifications.map((n) => (
        <View key={n.title} style={[styles.card, shadow.card]}>
          {n.icon ? (
            <View style={styles.iconCircle}>
              <Ionicons name={n.icon} size={24} color={colors.primary} />
            </View>
          ) : (
            <Image source={n.avatar!} style={styles.avatar} resizeMode="cover" />
          )}
          <View style={styles.cardBody}>
            <View style={styles.cardHead}>
              <Text style={styles.cardTitle}>{n.title}</Text>
              <Text style={styles.time}>{n.time}</Text>
            </View>
            <Text style={styles.msg}>{n.msg}</Text>
          </View>
        </View>
      ))}

      <View style={[styles.dash, shadow.card]}>
        <View style={styles.dashHeader}>
          <Text style={styles.dashHeaderText}>Monitoring Dashboard</Text>
        </View>
        <View style={styles.metrics}>
          <Metric value="24" label="Deliveries Today" />
          <Metric value="92%" label="On-time Delivery" highlight />
          <Metric value="₹3,240" label="Cost Saved" highlight />
        </View>
        <View style={styles.charts}>
          <SimpleBarChart title="Vehicle Utilization" data={[40, 55, 48, 72, 65, 80, 68]} />
          <SimpleDonutChart title="Delivery Status" completed={18} inTransit={4} pending={2} />
        </View>
      </View>
    </ScrollView>
  );
}

function Metric({ value, label, highlight }: { value: string; label: string; highlight?: boolean }) {
  return (
    <View style={styles.metric}>
      <Text style={[styles.metricVal, highlight && { color: colors.secondary }]}>{value}</Text>
      <Text style={styles.metricLbl}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: 40 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  screenTitle: { fontSize: 18, fontWeight: '700', color: colors.textNavy },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1, marginLeft: spacing.md },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between' },
  cardTitle: { fontWeight: '700', color: colors.text, fontSize: 15 },
  time: { fontSize: 12, color: colors.textMuted },
  msg: { fontSize: 13, color: colors.textMuted, marginTop: 4, lineHeight: 18 },
  dash: { borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.surface, marginTop: spacing.sm },
  dashHeader: { backgroundColor: colors.navy, padding: spacing.md },
  dashHeaderText: { color: '#fff', fontWeight: '700', textAlign: 'center', fontSize: 16 },
  metrics: { flexDirection: 'row', padding: spacing.md, justifyContent: 'space-between' },
  metric: { alignItems: 'center', flex: 1 },
  metricVal: { fontSize: 22, fontWeight: '700', color: colors.text },
  metricLbl: { fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 4 },
  charts: { padding: spacing.md, paddingTop: 0 },
});
