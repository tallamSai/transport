import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { createTransportRequest, subscribeMandis } from '../../services/transportApi';
import { useAgriStore } from '../../store/useAgriStore';

const URGENCY_OPTS = [
  { key: 'normal', label: 'Normal' },
  { key: 'urgent', label: 'Urgent' },
  { key: 'perishable', label: 'Perishable' },
];

/**
 * @param {object} props
 * @param {import('@react-navigation/native').NavigationProp<any>} props.navigation
 */
export function CreateRequestScreen({ navigation }) {
  const user = useAgriStore((s) => s.user);
  const [cropType, setCropType] = useState('Wheat');
  const [quantity, setQuantity] = useState('800');
  const [urgency, setUrgency] = useState('normal');
  const [mandiIndex, setMandiIndex] = useState(0);
  const [mandis, setMandis] = useState([]);
  const [mandisLoading, setMandisLoading] = useState(true);
  const [pickup, setPickup] = useState({ lat: 28.62, lng: 77.25, label: 'GPS pickup' });
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMandisLoading(true);
    const unsub = subscribeMandis((next) => {
      setMandis(next);
      setMandisLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    setMandiIndex((i) => (mandis.length === 0 ? 0 : Math.min(i, mandis.length - 1)));
  }, [mandis]);

  useEffect(() => {
    (async () => {
      setLoadingLoc(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const pos = await Location.getCurrentPositionAsync({});
        setPickup({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'Current location',
        });
      } catch {
        /* ignore */
      } finally {
        setLoadingLoc(false);
      }
    })();
  }, []);

  async function onSubmit() {
    setError('');
    if (!user?.id) {
      setError('Not signed in');
      return;
    }
    const q = parseFloat(quantity);
    if (!cropType.trim() || !q || q <= 0) {
      setError('Enter crop and valid quantity');
      return;
    }
    if (!mandis.length) {
      setError('Mandi list not loaded');
      return;
    }
    const dest = mandis[mandiIndex];
    if (!dest?.coords) {
      setError('Invalid destination');
      return;
    }
    setSubmitting(true);
    try {
      const req = await createTransportRequest({
        cropType: cropType.trim(),
        quantity: q,
        urgency,
        pickup: { label: pickup.label, coords: { lat: pickup.lat, lng: pickup.lng } },
        destination: { label: dest.label, coords: dest.coords },
      });
      if (req.status === 'cancelled') {
        setError('No vehicle available — go online as a driver or try again later.');
      } else {
        navigation.replace('Tracking', { requestId: req.id });
      }
    } catch (e) {
      setError(e?.message || 'Failed to create request');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen scroll>
      <LinearGradient
        colors={[colors.primary, colors.primaryMuted]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.heroTitle}>New transport</Text>
        <Text style={styles.heroSub}>Match to the nearest available vehicle</Text>
      </LinearGradient>

      <View style={styles.body}>
        <Text style={styles.label}>Crop type</Text>
        <TextInput style={styles.input} value={cropType} onChangeText={setCropType} />

        <Text style={styles.label}>Quantity (kg)</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={quantity}
          onChangeText={setQuantity}
        />

        <Text style={styles.label}>Pickup</Text>
        <Card style={styles.cardSoft}>
          <Text style={[typography.body, { color: colors.text }]}>
            {pickup.label}: {pickup.lat.toFixed(4)}, {pickup.lng.toFixed(4)}
          </Text>
          {loadingLoc ? <ActivityIndicator color={colors.primary} style={{ marginTop: 8 }} /> : null}
        </Card>

        <Text style={[styles.label, { marginTop: spacing.md }]}>Destination mandi</Text>
        {mandisLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.md }} />
        ) : (
          mandis.map((m, i) => (
            <Pressable key={m.id} onPress={() => setMandiIndex(i)} style={styles.mandiRow}>
              <View style={[styles.radio, mandiIndex === i && styles.radioOn]} />
              <Text style={typography.body}>{m.label}</Text>
            </Pressable>
          ))
        )}

        <Text style={[styles.label, { marginTop: spacing.md }]}>Urgency</Text>
        <View style={styles.row}>
          {URGENCY_OPTS.map((u) => (
            <Pressable
              key={u.key}
              onPress={() => setUrgency(u.key)}
              style={[styles.chip, urgency === u.key && styles.chipOn]}
            >
              <Text style={[typography.caption, urgency === u.key && { color: colors.surface }]}>
                {u.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {error ? <Text style={styles.err}>{error}</Text> : null}
        <View style={{ height: spacing.md }} />
        <Button title="Find best vehicle" onPress={onSubmit} loading={submitting} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginHorizontal: -spacing.md,
    marginTop: -spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  heroTitle: {
    ...typography.title,
    color: colors.surface,
  },
  heroSub: {
    ...typography.caption,
    color: colors.surfaceMuted,
    marginTop: spacing.xs,
  },
  body: { marginTop: spacing.md },
  label: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  cardSoft: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.border,
  },
  mandiRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: spacing.sm,
  },
  radioOn: { backgroundColor: colors.primary },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  err: { color: colors.error, marginTop: spacing.sm },
});
