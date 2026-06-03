import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FadeInView } from '../utils/animations';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';

interface Props {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  index?: number;
}

export function StatCard({ label, value, icon, color = colors.primary, index = 0 }: Props) {
  return (
    <FadeInView delay={index * 80} style={[styles.card, shadows.card]}>
      <View style={[styles.iconWrap, { backgroundColor: `${color}18` }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  value: { ...typography.h2, color: colors.textPrimary, fontSize: 20 },
  label: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
