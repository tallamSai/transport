import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Screen } from '../../components/Screen';
import { MapViewContainer } from '../../components/MapViewContainer';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useAgriStore } from '../../store/useAgriStore';
import { subscribeDriverRequests, subscribeVehicles } from '../../services/transportApi';
import { normalizeCoords } from '../../utils/firestoreNormalize';

/**
 * @param {object} props
 * @param {import('@react-navigation/native').RouteProp<any, 'NavigationMap'>} props.route
 */
export function NavigationMapScreen({ route }) {
  const requestId = route.params?.requestId;
  const user = useAgriStore((s) => s.user);
  const [vehicles, setVehicles] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!user?.id) return () => {};
    return subscribeDriverRequests(user.id, setRequests);
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
    const me = vehicle ? normalizeCoords(vehicle.currentLocation) : null;
    if (me && vehicle) {
      list.push({
        id: 'me',
        latitude: me.lat,
        longitude: me.lng,
        title: 'Your vehicle',
        pinColor: colors.urgent,
      });
    }
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
    const dest = req?.destination ? normalizeCoords(req.destination.coords) : null;
    if (dest) {
      list.push({
        id: 'dest',
        latitude: dest.lat,
        longitude: dest.lng,
        title: 'Mandi',
        pinColor: colors.primary,
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

  function openGoogleMaps() {
    if (!req?.pickup?.coords || !req?.destination?.coords) return;
    const { lat: lat1, lng: lon1 } = req.pickup.coords;
    const { lat: lat2, lng: lon2 } = req.destination.coords;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${lat1},${lon1}&destination=${lat2},${lon2}&travelmode=driving`;
    Linking.openURL(url);
  }

  if (!req) {
    return (
      <Screen>
        <Text style={typography.body}>Select a request from the list.</Text>
      </Screen>
    );
  }

  return (
    <Screen scroll={false} contentStyle={{ flex: 1, padding: 0 }}>
      <View style={styles.mapBox}>
        <MapViewContainer
          initialRegion={region}
          markers={markers}
          routeCoords={routeCoords.length > 1 ? routeCoords : []}
        />
        <Card style={styles.panel}>
          <Text style={[typography.subtitle, { color: colors.text }]}>{req.cropType}</Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            {req.pickup?.label} → {req.destination?.label}
          </Text>
          <View style={{ height: spacing.sm }} />
          <Button title="Open in Google Maps" variant="ghost" onPress={openGoogleMaps} />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapBox: { flex: 1 },
  panel: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
  },
});
