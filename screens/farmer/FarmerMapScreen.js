import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '../../components/Screen';
import { MapViewContainer } from '../../components/MapViewContainer';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { subscribeVehicles } from '../../services/transportApi';
import { useAgriStore } from '../../store/useAgriStore';
import { normalizeCoords } from '../../utils/firestoreNormalize';

const FALLBACK_REGION = {
  latitude: 28.62,
  longitude: 77.25,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

export function FarmerMapScreen() {
  const [vehicles, setVehicles] = useState([]);
  const user = useAgriStore((s) => s.user);

  useEffect(() => subscribeVehicles(setVehicles), []);

  const markers = useMemo(() => {
    const list = [];
    for (const v of vehicles) {
      if (!v.availability) continue;
      const c = normalizeCoords(v.currentLocation);
      if (!c) continue;
      list.push({
        id: v.id,
        latitude: c.lat,
        longitude: c.lng,
        title: `${v.type} · ${v.capacityKg} kg`,
        pinColor: colors.primaryMuted,
      });
    }
    return list;
  }, [vehicles]);

  const initialRegion = FALLBACK_REGION;

  return (
    <Screen scroll={false} contentStyle={{ flex: 1, padding: 0 }}>
      <View style={styles.mapBox}>
        <MapViewContainer initialRegion={initialRegion} markers={markers} />
        <LinearGradient
          colors={[colors.gradientTop, 'transparent']}
          style={styles.gradient}
          pointerEvents="none"
        />
        <Card style={styles.legend}>
          <Text style={[typography.subtitle, { color: colors.surface }]}>Nearby capacity</Text>
          <Text style={[typography.caption, { color: colors.surfaceMuted, marginTop: 4 }]}>
            {markers.length > 0
              ? `${markers.length} vehicle(s) online · ${user?.name || 'Farmer'}`
              : 'No vehicles — ask drivers to go online and allow location access.'}
          </Text>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapBox: { flex: 1 },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 100,
  },
  legend: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
    borderRadius: radius.lg,
  },
});
