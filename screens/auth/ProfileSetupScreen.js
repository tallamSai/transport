import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useAgriStore } from '../../store/useAgriStore';
import { isMockMode } from '../../services/config';
import { persistLocalProfile, persistMockFlag } from '../../services/session';
import { initMockSession } from '../../services/mock/mockApi';
import { upsertUserDoc, saveVehicleDoc } from '../../services/firestoreApi';
import { getFirebaseAuth } from '../../services/firebase';
import { DEMO_DRIVER_ID, DEMO_FARMER_ID } from '../../services/constants';

/**
 * @param {object} props
 * @param {import('@react-navigation/native').NavigationProp<any>} props.navigation
 * @param {import('@react-navigation/native').RouteProp<any, 'ProfileSetup'>} props.route
 */
export function ProfileSetupScreen({ navigation, route }) {
  const role = route.params?.role || 'farmer';
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vType, setVType] = useState('truck');
  const [capacity, setCapacity] = useState('2000');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const mock = isMockMode();

  async function onSave() {
    setError('');
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    setLoading(true);
    try {
      let driverCoords = { lat: 28.62, lng: 77.25 };
      if (role === 'driver') {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const pos = await Location.getCurrentPositionAsync({});
            driverCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          }
        } catch {
          /* keep default Delhi anchor */
        }
      }

      if (mock) {
        const userId = role === 'farmer' ? DEMO_FARMER_ID : DEMO_DRIVER_ID;
        /** @type {import('../../types/entities').AppUser} */
        const user = {
          id: userId,
          name: name.trim(),
          phone: phone.trim(),
          role,
        };
        const vehicle =
          role === 'driver'
            ? {
                id: `veh_${userId}`,
                driverId: userId,
                type: vType === 'tractor' ? 'tractor' : 'truck',
                capacityKg: Math.max(100, parseInt(capacity, 10) || 2000),
                availability: true,
                currentLocation: driverCoords,
                updatedAt: Date.now(),
              }
            : null;
        await persistLocalProfile(user, vehicle);
        await persistMockFlag(true);
        initMockSession(user, vehicle);
        useAgriStore.getState().setUser(user);
        if (vehicle) useAgriStore.getState().setDriverVehicle(vehicle);
      } else {
        const auth = getFirebaseAuth();
        const fb = auth?.currentUser;
        if (!fb) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }
        await upsertUserDoc(fb.uid, {
          name: name.trim(),
          phone: phone.trim(),
          role,
          onboardingComplete: true,
        });
        if (role === 'driver') {
          const vdoc = {
            id: fb.uid,
            type: vType === 'tractor' ? 'tractor' : 'truck',
            capacityKg: Math.max(100, parseInt(capacity, 10) || 2000),
            availability: true,
            currentLocation: driverCoords,
          };
          await saveVehicleDoc(fb.uid, vdoc);
          useAgriStore.getState().setDriverVehicle({ ...vdoc, driverId: fb.uid });
        } else {
          useAgriStore.getState().setDriverVehicle(null);
        }
        useAgriStore.getState().setUser({
          id: fb.uid,
          name: name.trim(),
          phone: phone.trim(),
          role,
        });
      }
    } catch (e) {
      setError(e?.message || 'Could not save profile');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen scroll>
      <Text style={[typography.caption, styles.sub]}>
        {role === 'farmer' ? 'Farmer profile' : 'Driver profile'}
      </Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Full name"
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="+91 ..."
        placeholderTextColor={colors.textSecondary}
        value={phone}
        onChangeText={setPhone}
      />

      {role === 'driver' ? (
        <>
          <Text style={styles.label}>Vehicle type</Text>
          <TextInput
            style={styles.input}
            placeholder="truck or tractor"
            placeholderTextColor={colors.textSecondary}
            value={vType}
            onChangeText={setVType}
          />
          <Text style={styles.label}>Capacity (kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={capacity}
            onChangeText={setCapacity}
          />
        </>
      ) : null}

      {error ? <Text style={styles.err}>{error}</Text> : null}
      <View style={{ height: spacing.md }} />
      <Button title="Continue" onPress={onSave} loading={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sub: { color: colors.textSecondary, marginBottom: spacing.md },
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
  err: { color: colors.error, marginBottom: spacing.sm },
});
