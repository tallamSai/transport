import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FadeInView, PulseView } from '../utils/animations';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';

interface Props {
  steps: string[];
  activeStep: number;
  loading?: boolean;
}

export function AIAnalysisCard({ steps, activeStep, loading = false }: Props) {
  return (
    <View style={[styles.card, shadows.card]}>
      <View style={styles.header}>
        <PulseView active={loading} style={styles.aiIcon}>
          <Ionicons name="hardware-chip" size={32} color="#fff" />
        </PulseView>
        <View>
          <Text style={styles.title}>AI Matching Engine</Text>
          <Text style={styles.sub}>Smart capacity & distance analysis</Text>
        </View>
      </View>
      {steps.map((step, i) => (
        <FadeInView key={step} delay={i * 80} style={[styles.step, i <= activeStep && styles.stepActive]}>
          <Ionicons
            name={i < activeStep ? 'checkmark-circle' : i === activeStep && loading ? 'sync' : 'ellipse-outline'}
            size={20}
            color={i <= activeStep ? colors.success : colors.textSecondary}
          />
          <Text style={[styles.stepText, i <= activeStep && styles.stepTextActive]}>{step}</Text>
        </FadeInView>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  aiIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...typography.h3, color: colors.textPrimary },
  sub: { ...typography.caption, color: colors.textSecondary },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },
  stepActive: { backgroundColor: colors.primaryLight },
  stepText: { ...typography.body, color: colors.textSecondary, fontSize: 14 },
  stepTextActive: { color: colors.primary, fontWeight: '600' },
});
