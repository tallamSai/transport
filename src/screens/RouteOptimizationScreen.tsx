import { View, Text, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MAP_REGION, ROUTE_LINE } from '../constants/map';
import { colors, radius, spacing, shadow } from '../constants/theme';

export function RouteOptimizationScreen() {
  const provider = Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined;

  return (
    <View style={styles.root}>
      <View style={styles.mapBlock}>
        <View style={styles.greenBar}>
          <Text style={styles.barTitle}>Optimized Route</Text>
        </View>
        <View style={styles.mapWrap}>
          <MapView style={StyleSheet.absoluteFill} provider={provider} initialRegion={MAP_REGION}>
            <Polyline coordinates={ROUTE_LINE} strokeColor={colors.routeBlue} strokeWidth={5} />
            <Marker coordinate={ROUTE_LINE[0]} title="Farm Location">
              <View style={[styles.pin, { backgroundColor: colors.secondary }]}>
                <Ionicons name="leaf" size={14} color="#fff" />
              </View>
            </Marker>
            <Marker coordinate={ROUTE_LINE[ROUTE_LINE.length - 1]} title="Mandi">
              <View style={[styles.pin, { backgroundColor: colors.danger }]}>
                <Ionicons name="storefront" size={14} color="#fff" />
              </View>
            </Marker>
          </MapView>
          <View style={[styles.routeCard, shadow.card]}>
            <View style={styles.routeCardHead}>
              <Text style={styles.routeCardTitle}>Best Route</Text>
            </View>
            <View style={styles.routeCardBody}>
              <RouteRow icon="navigate" label="Distance" value="28.1 km" />
              <RouteRow icon="time" label="ETA" value="55 mins" />
              <RouteRow icon="water" label="Fuel Cost" value="₹420" />
              <RouteRow icon="cash" label="Toll Cost" value="₹80" />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.scheduleBlock}>
        <View style={styles.greenBar}>
          <Text style={styles.barTitle}>Schedule</Text>
        </View>
        <View style={[styles.scheduleCard, shadow.card]}>
          <Ionicons name="calendar" size={48} color={colors.primary} style={styles.calIcon} />
          <View style={styles.scheduleCols}>
            <ScheduleCol label="Pickup Time" value="10:00 AM" />
            <View style={styles.vDivider} />
            <ScheduleCol label="Delivery Time" value="10:55 AM" />
            <View style={styles.vDivider} />
            <ScheduleCol label="Total Duration" value="55 mins" />
          </View>
        </View>
      </View>
      <SafeAreaView edges={['bottom']} />
    </View>
  );
}

function RouteRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.routeRow}>
      <Ionicons name={icon} size={16} color={colors.primary} />
      <Text style={styles.routeLbl}>{label}</Text>
      <Text style={styles.routeVal}>{value}</Text>
    </View>
  );
}

function ScheduleCol({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.schedCol}>
      <Text style={styles.schedLbl}>{label}</Text>
      <Text style={styles.schedVal}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  mapBlock: { flex: 1 },
  greenBar: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  barTitle: { color: '#fff', fontWeight: '700', fontSize: 16, textAlign: 'center' },
  mapWrap: { flex: 1, marginHorizontal: spacing.md, borderBottomLeftRadius: radius.lg, borderBottomRightRadius: radius.lg, overflow: 'hidden', minHeight: 280 },
  pin: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  routeCard: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 150,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  routeCardHead: { backgroundColor: colors.primary, padding: 8 },
  routeCardTitle: { color: '#fff', fontWeight: '700', fontSize: 13, textAlign: 'center' },
  routeCardBody: { backgroundColor: colors.surface, padding: 10, gap: 6 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  routeLbl: { fontSize: 10, color: colors.textMuted, flex: 1 },
  routeVal: { fontSize: 11, fontWeight: '700', color: colors.text },
  scheduleBlock: { paddingBottom: spacing.md },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    padding: spacing.md,
  },
  calIcon: { marginRight: spacing.md },
  scheduleCols: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  schedCol: { flex: 1, alignItems: 'center' },
  schedLbl: { fontSize: 11, color: colors.textMuted },
  schedVal: { fontSize: 14, fontWeight: '700', color: colors.text, marginTop: 4 },
  vDivider: { width: 1, height: 40, backgroundColor: colors.border },
});
