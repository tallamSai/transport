import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Assets } from '../constants/assets';
import { colors, radius, spacing, shadow } from '../constants/theme';

/** Web: static map image fallback */
export function RouteOptimizationScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.greenBar}>
        <Text style={styles.barTitle}>Optimized Route</Text>
      </View>
      <ImageBackground source={Assets.vehicleDetectionMap} style={styles.map} resizeMode="cover">
        <View style={[styles.routeCard, shadow.card]}>
          <Text style={styles.routeCardTitle}>Best Route · 28.1 km · 55 mins</Text>
        </View>
      </ImageBackground>
      <View style={[styles.greenBar, { marginTop: spacing.md }]}>
        <Text style={styles.barTitle}>Schedule</Text>
      </View>
      <View style={[styles.scheduleCard, shadow.card]}>
        <Ionicons name="calendar" size={40} color={colors.primary} />
        <Text style={styles.schedText}>Pickup 10:00 AM · Delivery 10:55 AM</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  greenBar: { backgroundColor: colors.primary, padding: 12, borderRadius: radius.lg },
  barTitle: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  map: { height: 300, marginVertical: spacing.sm, borderRadius: radius.lg, overflow: 'hidden', justifyContent: 'flex-start', padding: 12 },
  routeCard: { backgroundColor: colors.surface, padding: 12, borderRadius: radius.md, alignSelf: 'flex-end' },
  routeCardTitle: { fontWeight: '700', fontSize: 12 },
  scheduleCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, padding: spacing.md, borderRadius: radius.lg },
  schedText: { flex: 1, fontSize: 14 },
});
