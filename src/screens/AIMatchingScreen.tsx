import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FadeInView } from '../utils/animations';
import {
  ScreenLayout,
  AIAnalysisCard,
  PriorityBadge,
  SectionTitle,
  CustomButton,
} from '../components';
import { bestMatch, matchInput, matchingSteps } from '../data';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';

export function AIMatchingScreen() {
  const [activeStep, setActiveStep] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [matched, setMatched] = useState(false);

  function runMatching() {
    setMatched(false);
    setLoading(true);
    setActiveStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step >= matchingSteps.length) {
        clearInterval(interval);
        setLoading(false);
        setMatched(true);
        return;
      }
      setActiveStep(step);
    }, 800);
  }

  useEffect(() => {
    runMatching();
  }, []);

  const inputs = [
    { icon: 'cube' as const, label: 'Crop Quantity', value: matchInput.cropQuantity },
    { icon: 'location' as const, label: 'Pickup Location', value: matchInput.pickupLocation },
    { icon: 'storefront' as const, label: 'Destination Mandi', value: matchInput.destinationMandi },
    { icon: 'flash' as const, label: 'Urgency', value: matchInput.urgency },
  ];

  return (
    <ScreenLayout>
      <SectionTitle title="AI-Based Matching" subtitle="Phase 3 — Smart capacity & priority" />

      <View style={[styles.inputCard, shadows.card]}>
        <Text style={styles.cardTitle}>Input Summary</Text>
        {inputs.map((item) => (
          <View key={item.label} style={styles.inputRow}>
            <Ionicons name={item.icon} size={20} color={colors.primary} />
            <View>
              <Text style={styles.inputLabel}>{item.label}</Text>
              <Text style={styles.inputValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>

      <AIAnalysisCard steps={matchingSteps} activeStep={matched ? matchingSteps.length - 1 : activeStep} loading={loading} />

      {!loading && matched ? (
        <FadeInView slideFrom={24}>
          <View style={[styles.successCard, shadows.card]}>
            <Ionicons name="checkmark-circle" size={32} color={colors.success} />
            <Text style={styles.successTitle}>Best Vehicle Found!</Text>
            <Text style={styles.successSub}>{bestMatch.vehicleName} · Score {bestMatch.score}%</Text>
          </View>

          <View style={[styles.matchCard, shadows.card]}>
            <Text style={styles.matchTitle}>{bestMatch.vehicleName}</Text>
            <MatchRow label="Distance" value={bestMatch.distance} />
            <MatchRow label="Capacity" value={bestMatch.capacity} />
            <MatchRow label="ETA" value={bestMatch.eta} />
            <MatchRow label="Matching Score" value={`${bestMatch.score}%`} />
          </View>

          <PriorityBadge
            priority={bestMatch.priority}
            note={`Perishable crop — ${bestMatch.cropType}. Delivery before 6:00 PM.`}
          />
        </FadeInView>
      ) : null}

      <CustomButton title="Run Matching Again" onPress={runMatching} variant="outline" style={{ marginTop: spacing.md }} />
    </ScreenLayout>
  );
}

function MatchRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.matchRow}>
      <Text style={styles.matchLabel}>{label}</Text>
      <Text style={styles.matchValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inputCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  cardTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.md },
  inputRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.sm, alignItems: 'center' },
  inputLabel: { ...typography.caption, color: colors.textSecondary },
  inputValue: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  successCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.success,
  },
  successTitle: { ...typography.h2, color: colors.primary, marginTop: spacing.sm },
  successSub: { ...typography.caption, color: colors.textSecondary },
  matchCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md },
  matchTitle: { ...typography.h2, color: colors.primary, marginBottom: spacing.md },
  matchRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  matchLabel: { ...typography.body, color: colors.textSecondary },
  matchValue: { ...typography.h3, color: colors.textPrimary },
});
