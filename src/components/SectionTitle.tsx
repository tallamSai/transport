import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../constants/theme';

interface Props {
  title: string;
  subtitle?: string;
}

export function SectionTitle({ title, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md, marginTop: spacing.sm },
  title: { ...typography.h3, color: colors.textPrimary },
  subtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
});
