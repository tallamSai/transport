import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Assets } from '../constants/assets';
import { colors, radius, spacing, shadow } from '../constants/theme';

export function VehicleDetectionScreen() {
  return (
    <View style={styles.root}>
      <ImageBackground source={Assets.vehicleDetectionMap} style={styles.map} resizeMode="cover">
        <SafeAreaView edges={['top']} style={styles.mapTop}>
          <Text style={styles.screenLabel}>Live Vehicle Tracking</Text>
        </SafeAreaView>
      </ImageBackground>

      <View style={[styles.sheet, shadow.card]}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>Nearby Vehicles</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.vehicleRow}>
            <Image source={Assets.tractor1} style={styles.vehicleImg} resizeMode="contain" />
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>Tractor 1</Text>
              <Text style={styles.vehicleMeta}>2.1 km away</Text>
              <Text style={styles.vehicleMeta}>Capacity: 60 Quintal</Text>
              <Text style={styles.available}>Available</Text>
            </View>
            <View style={styles.leafBadge}>
              <Text style={styles.leafIcon}>🌱</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.detailsBtn} activeOpacity={0.9}>
            <Text style={styles.detailsText}>View Details</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  map: { flex: 1, minHeight: '62%' },
  mapTop: { padding: spacing.md },
  screenLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 6,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    maxHeight: '42%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  sheetTitle: { fontSize: 17, fontWeight: '700', color: colors.textNavy, marginBottom: spacing.md },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  vehicleImg: { width: 100, height: 80 },
  vehicleInfo: { flex: 1, paddingHorizontal: spacing.sm },
  vehicleName: { fontSize: 17, fontWeight: '700', color: colors.textNavy },
  vehicleMeta: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  available: { fontSize: 14, fontWeight: '700', color: colors.secondary, marginTop: 4 },
  leafBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leafIcon: { fontSize: 20 },
  detailsBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
