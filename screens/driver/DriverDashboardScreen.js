import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useAgriStore } from '../../store/useAgriStore';
import { setDriverOnline, subscribeDriverRequests, updateDriverLiveLocation } from '../../services/transportApi';

const ACTIVE = ['matched', 'accepted', 'en_route'];

export function DriverDashboardScreen() {
  const navigation = useNavigation();
  const user = useAgriStore((s) => s.user);
  const driverVehicle = useAgriStore((s) => s.driverVehicle);
  const [online, setOnline] = useState(!!driverVehicle?.availability);
  const [allJobs, setAllJobs] = useState([]);

  useEffect(() => {
    setOnline(!!driverVehicle?.availability);
  }, [driverVehicle?.availability]);

  useEffect(() => {
    if (!user?.id) return () => {};
    return subscribeDriverRequests(user.id, setAllJobs);
  }, [user?.id]);

  const completedTrips = allJobs.filter((r) => r.status === 'completed');
  const activeJobs = allJobs.filter((r) => ACTIVE.includes(r.status));

  useEffect(() => {
    if (!online || !user?.id) return () => {};
    let subscription;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      try {
        const pos = await Location.getCurrentPositionAsync({});
        await updateDriverLiveLocation(pos.coords);
      } catch {
        /* ignore */
      }
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 35,
          timeInterval: 18000,
        },
        (loc) => updateDriverLiveLocation(loc.coords),
      );
    })();
    return () => {
      subscription?.remove();
    };
  }, [online, user?.id]);

  return (
    <Screen scroll={false} contentStyle={{ flex: 1, padding: 0 }}>
      <LinearGradient
        colors={[colors.primary, colors.primaryMuted]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.heroTitle}>Dashboard</Text>
        <Text style={styles.heroSub}>Hello, {user?.name || 'Driver'}</Text>
        <Text style={styles.heroHint}>
          {activeJobs.length > 0
            ? `${activeJobs.length} active load(s) — open Requests to act`
            : 'Stay online to receive transport matches'}
        </Text>

        <View style={styles.heroSpacer} />

        <Button
          title="Open requests"
          variant="inverse"
          onPress={() => navigation.navigate('DriverRequests')}
          style={styles.heroButton}
        />

        <View style={styles.heroBottomPad} />
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeJobs.length > 0 ? (
          <Card style={styles.activeCard}>
            <Text style={[typography.subtitle, { color: colors.primary }]}>Active on your account</Text>
            <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 4 }]}>
              Updates live from Firestore — same list as the Requests tab
            </Text>
            {activeJobs.map((r) => (
              <Pressable
                key={r.id}
                style={styles.activeRow}
                onPress={() => navigation.navigate('DriverRequests')}
              >
                <Text style={[typography.body, { color: colors.text }]}>
                  {r.cropType} · {r.quantity} kg
                </Text>
                <Text style={[typography.caption, { color: colors.primaryMuted }]}>
                  {r.status} · ₹{r.estimatedCost ?? '—'}
                </Text>
              </Pressable>
            ))}
          </Card>
        ) : (
          <Card style={styles.hintCard}>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              No active assignments yet. Turn on availability, ensure your vehicle capacity meets typical crop
              loads, and keep GPS on so farmer requests can match you.
            </Text>
          </Card>
        )}

        <Card style={[styles.row, { marginTop: spacing.md }]}>
          <View style={{ flex: 1, paddingRight: spacing.sm }}>
            <Text style={[typography.subtitle, { color: colors.text }]}>Availability</Text>
            <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 4 }]}>
              Required for matching — shares your live GPS with the fleet map
            </Text>
          </View>
          <Switch
            value={online}
            onValueChange={(v) => {
              setOnline(v);
              setDriverOnline(v);
            }}
            trackColor={{ false: colors.border, true: colors.primaryMuted }}
            thumbColor={colors.surface}
          />
        </Card>

        <Card style={{ marginTop: spacing.md }}>
          <Text style={[typography.subtitle, { color: colors.primary }]}>Vehicle</Text>
          <Text style={[typography.body, { color: colors.text, marginTop: 4 }]}>
            {driverVehicle?.type || '—'} · {driverVehicle?.capacityKg ?? '—'} kg
          </Text>
          <View style={{ height: spacing.md }} />
          <Button title="Edit vehicle" variant="ghost" onPress={() => navigation.navigate('VehicleForm')} />
        </Card>

        <Card style={{ marginTop: spacing.md }}>
          <Text style={[typography.subtitle, { color: colors.text }]}>Trips completed</Text>
          <Text style={[typography.title, { color: colors.primary, marginTop: 8 }]}>
            {completedTrips.length}
          </Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            From your account history
          </Text>
        </Card>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  heroTitle: { ...typography.title, color: colors.surface },
  heroSub: {
    ...typography.caption,
    color: colors.surfaceMuted,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  heroHint: {
    ...typography.caption,
    color: colors.surfaceMuted,
    marginTop: spacing.xs,
    opacity: 0.95,
  },
  heroSpacer: {
    height: spacing.xl,
  },
  heroButton: {
    alignSelf: 'stretch',
    width: '100%',
  },
  heroBottomPad: {
    height: spacing.lg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  activeCard: { marginBottom: 0 },
  activeRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  hintCard: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
