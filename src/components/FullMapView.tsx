import { Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { MAP_REGION, ROUTE_COORDS, vehicleImage } from '../constants/images';
import { colors } from '../constants/theme';

interface MarkerData {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  type: string;
}

interface Props {
  markers?: MarkerData[];
  showRoute?: boolean;
  showUserLocation?: boolean;
}

export function FullMapView({
  markers = [],
  showRoute = false,
  showUserLocation = true,
}: Props) {
  const provider = Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined;

  return (
    <View style={styles.wrap}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={provider}
        initialRegion={MAP_REGION}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={false}
        mapType="standard"
      >
        {showRoute ? (
          <Polyline coordinates={ROUTE_COORDS} strokeColor={colors.primary} strokeWidth={5} />
        ) : null}
        {markers.map((m) => (
          <Marker key={m.id} coordinate={{ latitude: m.latitude, longitude: m.longitude }} title={m.title}>
            <View style={styles.markerWrap}>
              {m.type === 'Farm' ? (
                <View style={[styles.marker, styles.farmMarker]}>
                  <Ionicons name="person" size={18} color="#fff" />
                </View>
              ) : (
                <View style={styles.markerPhoto}>
                  <Image
                    source={{ uri: vehicleImage(m.type) }}
                    style={styles.markerImg}
                    contentFit="cover"
                  />
                </View>
              )}
            </View>
          </Marker>
        ))}
        {showRoute ? (
          <>
            <Marker coordinate={ROUTE_COORDS[0]} title="Farm">
              <View style={[styles.pin, { backgroundColor: colors.secondary }]}>
                <Ionicons name="leaf" size={16} color="#fff" />
              </View>
            </Marker>
            <Marker coordinate={ROUTE_COORDS[ROUTE_COORDS.length - 1]} title="Mandi">
              <View style={[styles.pin, { backgroundColor: colors.danger }]}>
                <Ionicons name="storefront" size={16} color="#fff" />
              </View>
            </Marker>
          </>
        ) : null}
      </MapView>
      <View style={styles.fallbackTint} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.primaryLight },
  markerWrap: { alignItems: 'center' },
  marker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  farmMarker: { backgroundColor: colors.primary },
  markerPhoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#fff',
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  markerImg: { width: '100%', height: '100%' },
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  fallbackTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(46,125,50,0.08)',
  },
});
