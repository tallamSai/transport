import { useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { getGoogleMapsKey } from '../services/config';

const DEFAULT_REGION = {
  latitude: 28.62,
  longitude: 77.25,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

/**
 * Google Maps on Android requires a valid API key in app.config / native project.
 * On iOS, omitting the provider uses Apple Maps and works without a Google key.
 */
function mapProvider() {
  const key = getGoogleMapsKey()?.trim();
  if (Platform.OS === 'ios') {
    if (key) return PROVIDER_GOOGLE;
    return undefined;
  }
  if (key) return PROVIDER_GOOGLE;
  return undefined;
}

/**
 * @param {object} props
 * @param {import('react-native-maps').Region} [props.region] — initial camera (legacy alias)
 * @param {import('react-native-maps').Region} [props.initialRegion]
 * @param {{ id: string, latitude: number, longitude: number, title?: string, pinColor?: string }[]} [props.markers]
 * @param {{ latitude: number, longitude: number }[]} [props.routeCoords]
 * @param {import('react').ReactNode} [props.children]
 */
export function MapViewContainer({ region, initialRegion, markers = [], routeCoords = [], children }) {
  const mapRef = useRef(null);
  const base = initialRegion || region || DEFAULT_REGION;
  const hasKey = !!getGoogleMapsKey()?.trim();
  const provider = mapProvider();

  const fitMap = useCallback(() => {
    if (!mapRef.current) return;
    const coords = markers
      .filter((m) => Number.isFinite(m.latitude) && Number.isFinite(m.longitude))
      .map((m) => ({ latitude: m.latitude, longitude: m.longitude }));
    if (coords.length === 0) return;

    try {
      if (coords.length === 1) {
        mapRef.current.animateToRegion(
          {
            latitude: coords[0].latitude,
            longitude: coords[0].longitude,
            latitudeDelta: 0.06,
            longitudeDelta: 0.06,
          },
          400,
        );
        return;
      }
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 72, right: 48, bottom: 160, left: 48 },
        animated: true,
      });
    } catch {
      /* snapshot / web */
    }
  }, [markers]);

  useEffect(() => {
    fitMap();
  }, [fitMap]);

  const onMapReady = useCallback(() => {
    fitMap();
  }, [fitMap]);

  const showAndroidKeyHint = Platform.OS === 'android' && !hasKey;

  return (
    <View style={styles.wrap}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={provider}
        initialRegion={base}
        onMapReady={onMapReady}
        showsUserLocation
        showsMyLocationButton={false}
        loadingEnabled
        mapType="standard"
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.latitude, longitude: m.longitude }}
            title={m.title}
            pinColor={m.pinColor || colors.primary}
          />
        ))}
        {routeCoords.length > 1 ? (
          <Polyline
            coordinates={routeCoords}
            strokeColor={colors.primaryMuted}
            strokeWidth={4}
          />
        ) : null}
      </MapView>

      {showAndroidKeyHint ? (
        <View style={styles.hint} pointerEvents="box-none">
          <Text style={styles.hintTitle}>Maps need a Google API key</Text>
          <Text style={styles.hintBody}>
            Set EXPO_PUBLIC_GOOGLE_MAPS_KEY in .env, enable Maps SDK for Android in Google Cloud, then
            run a development build (npx expo prebuild or EAS) so the key is embedded in the native app.
          </Text>
        </View>
      ) : null}

      {children}
    </View>
  );
}

/**
 * @param {object} props
 * @param {string} [props.message]
 */
export function MapFallback({ message }) {
  return (
    <View style={styles.fallback}>
      <Text style={[typography.body, { color: colors.textSecondary }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, minHeight: 280, backgroundColor: colors.accentSoft },
  map: { ...StyleSheet.absoluteFillObject },
  hint: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  hintTitle: { ...typography.subtitle, color: colors.text, marginBottom: 4 },
  hintBody: { ...typography.caption, color: colors.textSecondary },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
});
