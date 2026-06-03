import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Assets } from '../constants/assets';
import { colors, radius, spacing, shadow } from '../constants/theme';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList, MainTabParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeDashboard'>,
  BottomTabScreenProps<MainTabParamList>
>;

const stats = [
  { label: 'Active Vehicles', value: '24', icon: 'car' as const, color: '#1976D2' },
  { label: 'Pending Deliveries', value: '12', icon: 'time' as const, color: '#D32F2F' },
  { label: 'Completed Deliveries', value: '48', icon: 'checkmark-done' as const, color: '#546E7A' },
  { label: 'Transport Requests', value: '8', icon: 'document-text' as const, color: colors.secondary },
];

const actions = [
  { label: 'Register Farmer', icon: 'person-add' as const, screen: 'FarmerRegistration' as const },
  { label: 'Register Vehicle', icon: 'bus' as const, screen: 'TransportProviderRegistration' as const },
  { label: 'Request Transport', icon: 'cube' as const, tab: 'Matching' as const },
  { label: 'Track Delivery', icon: 'search' as const, screen: 'DeliveryTracking' as const },
  { label: 'View Routes', icon: 'location' as const, tab: 'Routes' as const },
  { label: 'Notifications', icon: 'notifications' as const, screen: 'NotificationMonitoring' as const },
];

export function HomeDashboardScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={22} color="#fff" />
            </View>
            <View>
              <Text style={styles.greet}>Good Morning, Farmer 👋</Text>
              <Text style={styles.title}>FarmLift Dashboard</Text>
            </View>
          </View>
          <View style={styles.bells}>
            <Ionicons name="notifications-outline" size={24} color={colors.textNavy} />
           
          </View>
        </View>

        <View style={[styles.hero]}>
          <Image source={Assets.homeHero} style={styles.heroImg} resizeMode="cover" />
        </View>

        <Text style={styles.section}>Overview</Text>
        <View style={styles.statsGrid}>
          {stats.map((s) => (
            <View key={s.label} style={[styles.statCard, shadow.card]}>
              <View style={[styles.statIcon, { backgroundColor: `${s.color}18` }]}>
                <Ionicons name={s.icon} size={22} color={s.color} />
              </View>
              <Text style={styles.statVal}>{s.value}</Text>
              <Text style={styles.statLbl}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.section}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          {actions.map((a) => (
            <TouchableOpacity
              key={a.label}
              style={[styles.actionBtn, shadow.card]}
              onPress={() => {
                if ('screen' in a) navigation.navigate(a.screen);
                else navigation.getParent()?.navigate(a.tab);
              }}
            >
              <Ionicons name={a.icon} size={28} color={colors.primary} />
              <Text style={styles.actionLbl}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.activityHead}>
          <Text style={styles.section}>Recent Activity</Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>
        <TouchableOpacity style={[styles.activityRow, shadow.card]}>
          <Image source={Assets.tractor1} style={styles.activityThumb} resizeMode="cover" />
          <View style={styles.activityText}>
            <View style={styles.placeholder} />
            <View style={[styles.placeholder, { width: '70%' }]} />
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  headerLeft: { flexDirection: 'row', gap: spacing.sm, flex: 1 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greet: { fontSize: 13, color: colors.textMuted },
  title: { fontSize: 20, fontWeight: '700', color: colors.textNavy },
  bells: { flexDirection: 'row', gap: 12 },
  hero: { borderRadius: radius.lg, overflow: 'hidden', height: 160, marginBottom: spacing.lg },
  heroImg: { width: '100%', height: '100%' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  heroText: { color: '#fff', fontSize: 18, fontWeight: '700', lineHeight: 24 },
  section: { fontSize: 17, fontWeight: '700', color: colors.textNavy, marginBottom: spacing.md },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  statIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statVal: { fontSize: 22, fontWeight: '700', color: colors.text },
  statLbl: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: spacing.lg },
  actionBtn: {
    width: '31%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
    minHeight: 96,
    justifyContent: 'center',
  },
  actionLbl: { fontSize: 11, color: colors.text, textAlign: 'center', marginTop: 8, fontWeight: '600' },
  activityHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAll: { color: colors.primary, fontWeight: '600', fontSize: 14 },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    paddingRight: spacing.md,
  },
  activityThumb: { width: 72, height: 72 },
  activityText: { flex: 1, padding: spacing.md, gap: 8 },
  placeholder: { height: 10, backgroundColor: '#E0E0E0', borderRadius: 4, width: '90%' },
});
