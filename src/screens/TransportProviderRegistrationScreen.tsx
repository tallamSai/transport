import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Assets } from '../constants/assets';
import { colors, spacing } from '../constants/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'TransportProviderRegistration'>;

export function TransportProviderRegistrationScreen({ navigation }: Props) {
  return (
    <ImageBackground source={Assets.truck2} style={styles.bg}>
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.box}>
        <Text style={styles.title}>Register Vehicle</Text>
        <Text style={styles.sub}>Transport provider form — UI mockup</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, justifyContent: 'flex-end' },
  back: { position: 'absolute', top: 48, left: spacing.md, zIndex: 2 },
  box: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.lg },
  title: { fontSize: 20, fontWeight: '700', color: colors.textNavy },
  sub: { marginTop: 8, color: colors.textMuted },
});
