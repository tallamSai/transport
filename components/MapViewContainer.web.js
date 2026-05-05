/**
 * Web build cannot load react-native-maps (native-only). Preview + open in Google Maps.
 */
import { StyleSheet, View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

function openInGoogleMaps(markers) {
  if (!markers?.length) return;
  if (markers.length === 1) {
    const m = markers[0];
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${m.latitude},${m.longitude}`)}`,
    );
    return;
  }
  const lat =
    markers.reduce((s, m) => s + Number(m.latitude), 0) / markers.length;
  const lng =
    markers.reduce((s, m) => s + Number(m.longitude), 0) / markers.length;
  Linking.openURL(
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`,
  );
}

export function MapViewContainer({ markers = [], routeCoords = [], children }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.mapPlaceholder}>
        <Text style={[typography.subtitle, { color: colors.primary, marginBottom: 8 }]}>
          Map (web preview)
        </Text>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>
          Interactive maps use the Android/iOS app with a valid Google Maps API key. Here you can open the
          same locations in Google Maps in your browser.
        </Text>
        {markers.length > 0 ? (
          <Pressable
            style={styles.linkBtn}
            onPress={() => openInGoogleMaps(markers)}
            accessibilityRole="link"
            accessibilityLabel="Open locations in Google Maps"
          >
            <Text style={styles.linkBtnText}>Open in Google Maps</Text>
          </Pressable>
        ) : null}
        <ScrollView style={styles.list} nestedScrollEnabled>
          {markers.length === 0 ? (
            <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 8 }]}>
              No markers yet — enable driver availability and location to see vehicles.
            </Text>
          ) : (
            markers.map((m) => (
              <Text key={m.id} style={[typography.caption, { color: colors.text, marginTop: 4 }]}>
                • {m.title || m.id} — {Number(m.latitude).toFixed(4)}, {Number(m.longitude).toFixed(4)}
              </Text>
            ))
          )}
        </ScrollView>
        {routeCoords.length > 1 ? (
          <Text style={[typography.caption, { marginTop: 10, color: colors.primaryMuted }]}>
            Route: {routeCoords.length} points (full polyline on mobile)
          </Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}

export function MapFallback({ message }) {
  return (
    <View style={styles.fallback}>
      <Text style={[typography.body, { color: colors.textSecondary }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, minHeight: 280 },
  mapPlaceholder: {
    flex: 1,
    minHeight: 280,
    backgroundColor: colors.accentSoft,
    padding: 16,
    justifyContent: 'flex-start',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  linkBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  linkBtnText: {
    ...typography.caption,
    color: colors.surface,
    fontWeight: '600',
  },
  list: { maxHeight: 160, marginTop: 12 },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
});
