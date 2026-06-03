import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';

interface BarChartProps {
  data: number[];
  labels?: string[];
  title: string;
}

export function SimpleBarChart({ data, title }: BarChartProps) {
  const max = Math.max(...data, 1);
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.bars}>
        {data.map((v, i) => (
          <View key={i} style={styles.barCol}>
            <View style={[styles.bar, { height: Math.max(4, (v / max) * 80) }]} />
          </View>
        ))}
      </View>
    </View>
  );
}

interface DonutProps {
  completed: number;
  inTransit: number;
  pending: number;
  title: string;
}

export function SimpleDonutChart({ completed, inTransit, pending, title }: DonutProps) {
  const total = completed + inTransit + pending || 1;
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.donutRow}>
        <View style={styles.donut}>
          <View style={[styles.slice, { flex: completed, backgroundColor: colors.success }]} />
          <View style={[styles.slice, { flex: inTransit, backgroundColor: colors.accent }]} />
          <View style={[styles.slice, { flex: pending, backgroundColor: colors.border }]} />
        </View>
        <View style={styles.legend}>
          <Legend color={colors.success} label={`Completed ${Math.round((completed / total) * 100)}%`} />
          <Legend color={colors.accent} label={`In Transit ${Math.round((inTransit / total) * 100)}%`} />
          <Legend color={colors.border} label={`Pending ${Math.round((pending / total) * 100)}%`} />
        </View>
      </View>
    </View>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendRow}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  title: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.md },
  bars: { flexDirection: 'row', height: 100, alignItems: 'flex-end', gap: 6 },
  barCol: { flex: 1, height: '100%', justifyContent: 'flex-end' },
  bar: { backgroundColor: colors.primary, borderRadius: 4, width: '100%' },
  donutRow: { flexDirection: 'row', alignItems: 'center' },
  donut: {
    width: 80,
    height: 80,
    borderRadius: 40,
    flexDirection: 'row',
    overflow: 'hidden',
    marginRight: spacing.lg,
  },
  slice: { height: '100%' },
  legend: { flex: 1 },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendText: { ...typography.caption, color: colors.textSecondary },
});
