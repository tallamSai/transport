import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from '../components';
import { FadeInView } from '../utils/animations';
import { colors, spacing, typography } from '../constants/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <FadeInView style={styles.logoWrap} duration={800}>
        <View style={styles.logoCircle}>
          <Ionicons name="leaf" size={48} color="#fff" />
        </View>
        <FadeInView delay={300}>
          <Text style={styles.logo}>FarmLift</Text>
        </FadeInView>
        <FadeInView delay={500}>
          <Text style={styles.tagline}>Smart Farm Transport Matching & Optimization</Text>
        </FadeInView>
      </FadeInView>
      <FadeInView delay={700} style={styles.footer}>
        <CustomButton title="Get Started" onPress={() => navigation.replace('Main')} />
      </FadeInView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  logoWrap: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logo: { ...typography.h1, color: colors.primary, fontSize: 36 },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    lineHeight: 24,
  },
  footer: { paddingBottom: spacing.xl },
});
