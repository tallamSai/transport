import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FadeInView } from '../utils/animations';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';

interface Props {
  title: string;
  description: string;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

export function DashboardCard({ title, description, icon = 'leaf', style }: Props) {
  return (
    <FadeInView duration={600} style={[styles.wrap, style]}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, shadows.soft]}
      >
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={32} color="#fff" />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>
      </LinearGradient>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  card: { borderRadius: radius.lg, padding: spacing.lg },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: { ...typography.h2, color: '#fff', marginBottom: spacing.xs },
  desc: { ...typography.body, color: 'rgba(255,255,255,0.9)', lineHeight: 22 },
});
