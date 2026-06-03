import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Assets } from '../constants/assets';
import { colors, radius, spacing, shadow } from '../constants/theme';

const steps = ['Analyzing Capacity', 'Checking Distance', 'Evaluating Priority', 'Generating Match'];

export function AIMatchingScreen() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      if (i >= steps.length) {
        clearInterval(t);
        setActive(steps.length);
        return;
      }
      setActive(i);
    }, 900);
    return () => clearInterval(t);
  }, []);

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#0A1628', '#0D2137', '#122A44']} style={StyleSheet.absoluteFill} />
      <View style={styles.circuit}>
        <Ionicons name="hardware-chip" size={80} color="rgba(100,181,246,0.35)" />
      </View>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.engineTitle}>AI Matching Engine</Text>

          <View style={styles.stepsBox}>
            {steps.map((label, i) => {
              const done = i < active;
              const current = i === active && active < steps.length;
              return (
                <View key={label} style={styles.stepRow}>
                  <Ionicons
                    name={done ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                    color={done ? colors.secondary : '#fff'}
                  />
                  <Text style={styles.stepText}>{label}</Text>
                  <Ionicons
                    name={done ? 'checkmark-circle' : current ? 'sync' : 'ellipse-outline'}
                    size={22}
                    color={done ? colors.secondary : current ? '#64B5F6' : 'rgba(255,255,255,0.4)'}
                  />
                </View>
              );
            })}
          </View>

          {active >= steps.length ? (
            <>
              <View style={styles.bestWrap}>
                <View style={styles.bestBadge}>
                  <Text style={styles.bestBadgeText}>Best Match Found!</Text>
                </View>
                <View style={[styles.bestCard, shadow.card]}>
                  <Image source={Assets.tractor1} style={styles.tractorImg} resizeMode="contain" />
                  <View style={styles.bestInfo}>
                    <Text style={styles.bestName}>Tractor 1</Text>
                    <Text style={styles.bestLine}>Capacity: 60 Quintal</Text>
                    <Text style={styles.bestLine}>Distance: 2.1 km</Text>
                    <Text style={styles.bestLine}>ETA: 25 mins</Text>
                  </View>
                  <Ionicons name="checkmark-circle" size={36} color={colors.secondary} />
                </View>
              </View>

              <View style={styles.priorityCard}>
                <Image source={Assets.tomato} style={styles.tomatoImg} resizeMode="contain" />
                <View style={styles.priorityInfo}>
                  <Text style={styles.priorityHigh}>Priority: HIGH</Text>
                  <Text style={styles.prioritySub}>Perishable Crop - Tomato</Text>
                  <Text style={styles.prioritySub}>Delivery Before 6:00 PM</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
              </View>
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  circuit: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', opacity: 0.5 },
  safe: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  engineTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  stepsBox: { marginBottom: spacing.lg },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  stepText: { flex: 1, color: '#fff', fontSize: 15, textAlign: 'center', fontWeight: '500' },
  bestWrap: { marginTop: spacing.md },
  bestBadge: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: radius.pill,
    marginBottom: -14,
    zIndex: 2,
  },
  bestBadgeText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  bestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.secondary,
    padding: spacing.md,
    gap: spacing.sm,
  },
  tractorImg: { width: 90, height: 70 },
  bestInfo: { flex: 1 },
  bestName: { fontSize: 18, fontWeight: '700', color: colors.text },
  bestLine: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  priorityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.priorityBg,
    borderWidth: 1,
    borderColor: colors.priorityBorder,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  tomatoImg: { width: 64, height: 64 },
  priorityInfo: { flex: 1, paddingHorizontal: spacing.sm },
  priorityHigh: { fontSize: 15, fontWeight: '700', color: colors.danger },
  prioritySub: { fontSize: 13, color: colors.text, marginTop: 2 },
});
