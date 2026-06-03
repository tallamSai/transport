import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenLayout, CustomInput, CustomButton, Header, SuccessModal } from '../components';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'FarmerRegistration'>;

export function FarmerRegistrationScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [cropType, setCropType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pickup, setPickup] = useState('');
  const [success, setSuccess] = useState(false);

  function submit() {
    setSuccess(true);
  }

  return (
    <ScreenLayout>
      <Header title="Farmer Registration" subtitle="Phase 1 — Data Collection" onBack={() => navigation.goBack()} />
      <View style={[styles.card, shadows.card]}>
        <Text style={styles.phase}>Register your farm details for transport matching</Text>
        <CustomInput label="Farmer Name" value={name} onChangeText={setName} placeholder="Rajesh Patel" />
        <CustomInput label="Phone Number" value={phone} onChangeText={setPhone} placeholder="+91 98765 43210" keyboardType="phone-pad" />
        <CustomInput label="Village" value={village} onChangeText={setVillage} placeholder="Rampur" />
        <CustomInput label="Crop Type" value={cropType} onChangeText={setCropType} placeholder="Tomato" />
        <CustomInput label="Crop Quantity" value={quantity} onChangeText={setQuantity} placeholder="50 Quintal" />
        <CustomInput label="Pickup Location" value={pickup} onChangeText={setPickup} placeholder="Rampur Village, Block A" />
        <CustomButton title="Submit" onPress={submit} />
      </View>
      <SuccessModal
        visible={success}
        title="Registration Successful!"
        message="Farmer profile saved locally. You can now request transport matching."
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
  phase: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.lg },
});
