import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../constants/theme';

interface MapMarker {
  id: string;
  label: string;
  top: string;
  left: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface Props {
  title?: string;
  gpsActive?: boolean;
  markers?: MapMarker[];
}

const defaultMarkers: MapMarker[] = [
  { id: '1', label: 'Tractor A', top: '25%', left: '20%', icon: 'construct' },
  { id: '2', label: 'Truck B', top: '45%', left: '65%', icon: 'bus' },
  { id: '3', label: 'Tractor C', top: '70%', left: '35%', icon: 'construct' },
  { id: 'you', label: 'You', top: '50%', left: '48%', icon: 'person' },
];

export function StaticMap({ title, gpsActive = true, markers = defaultMarkers }: Props) {
  return (
    <View style={styles.wrap}>
      {title ? (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {gpsActive ? (
            <View style={styles.gps}>
              <View style={styles.gpsDot} />
              <Text style={styles.gpsText}>GPS Active</Text>
            </View>
          ) : null}
        </View>
      ) : null}
      <View style={styles.map}>
        <View style={styles.gridH} />
        <View style={styles.gridV} />
        <View style={styles.radar} />
        {markers.map((m) => (
          <View key={m.id} style={[styles.marker, { top: m.top, left: m.left }]}>
            <View style={[styles.pin, m.id === 'you' && styles.pinYou]}>
              <Ionicons name={m.icon} size={m.id === 'you' ? 18 : 16} color={m.id === 'you' ? '#fff' : colors.primary} />
            </View>
            <Text style={styles.markerLabel}>{m.label}</Text>
          </View>
        ))}
        <View style={styles.routeLine} />
      </View>
      <Text style={styles.hint}>Static map preview — no live GPS integration</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: { ...typography.h3, color: colors.textPrimary },
  gps: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  gpsDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  gpsText: { ...typography.label, color: colors.success },
  map: {
    height: 220,
    backgroundColor: '#C8E6C9',
    borderRadius: radius.lg,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  gridH: {
    position: 'absolute',
    top: '33%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(46,125,50,0.15)',
  },
  gridV: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(46,125,50,0.15)',
  },
  radar: {
    position: 'absolute',
    top: '42%',
    left: '40%',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(46,125,50,0.4)',
    backgroundColor: 'rgba(76,175,80,0.15)',
  },
  marker: { position: 'absolute', alignItems: 'center' },
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  pinYou: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  markerLabel: { ...typography.label, fontSize: 9, color: colors.primaryDark, marginTop: 2 },
  routeLine: {
    position: 'absolute',
    top: '30%',
    left: '25%',
    width: '50%',
    height: 3,
    backgroundColor: colors.primary,
    opacity: 0.5,
    transform: [{ rotate: '25deg' }],
    borderRadius: 2,
  },
  hint: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm },
});
