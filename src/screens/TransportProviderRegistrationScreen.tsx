import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { ScreenLayout, CustomInput, CustomButton, Header, SuccessModal } from '../components';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'TransportProviderRegistration'>;

export function TransportProviderRegistrationScreen({ navigation }: Props) {
  const [driverName, setDriverName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [location, setLocation] = useState('');
  const [available, setAvailable] = useState(true);
  const [success, setSuccess] = useState(false);

  return (
    <ScreenLayout>
      <Header title="Transport Provider" subtitle="Vehicle Registration" onBack={() => navigation.goBack()} />
      <View style={[styles.card, shadows.card]}>
        <CustomInput label="Driver Name" value={driverName} onChangeText={setDriverName} placeholder="Ramesh Kumar" />
        <CustomInput label="Phone Number" value={phone} onChangeText={setPhone} placeholder="+91 98765 11122" keyboardType="phone-pad" />
        <CustomInput label="Vehicle Type" value={vehicleType} onChangeText={setVehicleType} placeholder="Tractor / Truck / Mini Truck" />
        <CustomInput label="Vehicle Number" value={vehicleNumber} onChangeText={setVehicleNumber} placeholder="RJ-14-AB-4521" />
        <CustomInput label="Vehicle Capacity" value={capacity} onChangeText={setCapacity} placeholder="60 Quintal" />
        <CustomInput label="Current Location" value={location} onChangeText={setLocation} placeholder="Rampur Village" />
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Availability Status</Text>
          <Switch value={available} onValueChange={setAvailable} trackColor={{ true: colors.secondary }} thumbColor={colors.surface} />
          <Text style={[styles.avail, { color: available ? colors.success : colors.danger }]}>
            {available ? 'Available' : 'Unavailable'}
          </Text>
        </View>
        <CustomButton title="Submit" onPress={() => setSuccess(true)} />
      </View>
      <SuccessModal
        visible={success}
        title="Vehicle Registered!"
        message="Transport provider profile saved. Vehicle is now visible for matching."
        onClose={() => {
          setSuccess(false);
          navigation.goBack();
        }}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  switchLabel: { ...typography.body, flex: 1, color: colors.textPrimary },
  avail: { ...typography.label, marginLeft: spacing.sm },
});
