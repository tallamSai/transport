import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '../../components/Screen';
import { MapViewContainer } from '../../components/MapViewContainer';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useAgriStore } from '../../store/useAgriStore';
import { subscribeFarmerRequests, subscribeVehicles } from '../../services/transportApi';
import { normalizeCoords } from '../../utils/firestoreNormalize';

/**
 * @param {object} props
 * @param {import('@react-navigation/native').RouteProp<any, 'Tracking'>} props.route
 */
export function TrackingScreen({ route }) {
  const requestId = route.params?.requestId;
  const user = useAgriStore((s) => s.user);
  const [vehicles, setVehicles] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!user?.id) return () => {};
    return subscribeFarmerRequests(user.id, setRequests);
  }, [user?.id]);

  useEffect(() => subscribeVehicles(setVehicles), []);

  const req = requests.find((r) => r.id === requestId);
  const vehicle = vehicles.find((v) => v.id === req?.assignedVehicleId);

  const routeCoords = useMemo(() => {
    if (!req?.routePolyline) return [];
    try {
      const parsed = JSON.parse(req.routePolyline);
      if (Array.isArray(parsed) && parsed[0]?.latitude) return parsed;
      if (Array.isArray(parsed) && parsed[0]?.lat) {
        return parsed.map((p) => ({ latitude: p.lat, longitude: p.lng }));
      }
    } catch {
      return [];
    }
    return [];
  }, [req?.routePolyline]);

  const markers = useMemo(() => {
    const list = [];
    const p = req?.pickup ? normalizeCoords(req.pickup.coords) : null;
    if (p) {
      list.push({
        id: 'pickup',
        latitude: p.lat,
        longitude: p.lng,
        title: 'Pickup',
        pinColor: colors.accent,
      });
    }
    const d = req?.destination ? normalizeCoords(req.destination.coords) : null;
    if (d) {
      list.push({
        id: 'dest',
        latitude: d.lat,
        longitude: d.lng,
        title: 'Mandi',
        pinColor: colors.primary,
      });
    }
    const vloc = vehicle ? normalizeCoords(vehicle.currentLocation) : null;
    if (vloc && vehicle) {
      list.push({
        id: vehicle.id,
        latitude: vloc.lat,
        longitude: vloc.lng,
        title: 'Vehicle',
        pinColor: colors.urgent,
      });
    }
    return list;
  }, [req, vehicle]);

  const region = useMemo(() => {
    const m = markers[0];
    if (!m) {
      return {
        latitude: 28.62,
        longitude: 77.25,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
      };
    }
    return {
      latitude: m.latitude,
      longitude: m.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
  }, [markers]);

  if (!req) {
    return (
      <Screen>
        <Text style={typography.body}>Loading request…</Text>
      </Screen>
    );
  }

  const driverLine =
    req.assignedDriverName || req.assignedDriverPhone
      ? [req.assignedDriverName, req.assignedDriverPhone].filter(Boolean).join(' · ')
      : req.status === 'matched' || req.status === 'accepted' || req.status === 'en_route'
        ? 'Driver details loading…'
        : 'Driver assigned after match';

  let statusBanner = '';
  if (req.status === 'pending')
    statusBanner = 'Finding the nearest available vehicle — this updates automatically.';
  else if (req.status === 'cancelled')
    statusBanner =
      'No vehicle could be assigned (capacity, offline drivers, or distance). Try again later.';
  else if (req.status === 'matched')
    statusBanner = 'A driver is assigned — they must accept in the transport app.';
  else if (req.status === 'accepted' || req.status === 'en_route')
    statusBanner = 'Trip in progress — vehicle location updates on this map when shared.';

  return (
    <Screen scroll={false} contentStyle={{ flex: 1, padding: 0 }}>
      <View style={styles.mapBox}>
        <MapViewContainer
          initialRegion={region}
          markers={markers}
          routeCoords={routeCoords.length > 1 ? routeCoords : []}
        />
        <LinearGradient
          colors={['transparent', 'rgba(20,32,21,0.75)']}
          style={styles.gradBottom}
          pointerEvents="none"
        />
        <Card style={styles.panel}>
          <Text style={[typography.subtitle, { color: colors.text }]}>{req.cropType}</Text>
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 4 }]}>
            {req.pickup?.label} → {req.destination?.label}
          </Text>
          {statusBanner ? (
            <Text style={[typography.caption, { color: colors.primaryMuted, marginTop: 8 }]}>
              {statusBanner}
            </Text>
          ) : null}
          <View style={styles.divider} />
          <Text style={[typography.caption, { color: colors.text }]}>{driverLine}</Text>
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 8 }]}>
            Status: {req.status} · Est. ₹{req.estimatedCost ?? '—'} · ETA ~{req.etaMinutes ?? '—'} min
          </Text>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapBox: { flex: 1 },
  gradBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },
  panel: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
});
