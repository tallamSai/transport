import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Assets } from '../constants/assets';
import { colors, radius, spacing } from '../constants/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  return (
    <ImageBackground source={Assets.loginBg} style={styles.bg} resizeMode="cover">
      <LinearGradient colors={['transparent', 'rgba(27,67,50,0.9)']} style={styles.grad}>
        <View style={styles.center}>
          <Text style={styles.leaf}>🌱</Text>
          <Text style={styles.brand}>FarmLift</Text>
          <Text style={styles.tag}>Smart Farm Transport Matching & Optimization</Text>
        </View>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.replace('Login')}>
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  grad: { flex: 1, justifyContent: 'space-between', padding: spacing.lg, paddingBottom: 48 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  leaf: { fontSize: 48 },
  brand: { fontSize: 36, fontWeight: '700', color: '#fff', marginTop: spacing.md },
  tag: { color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: spacing.md, fontSize: 16, lineHeight: 24 },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 17 },
});
