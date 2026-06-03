import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Priority } from '../types';
import { colors, radius, spacing, typography } from '../constants/theme';
import { formatPriority } from '../utils/format';

interface Props {
  priority: Priority;
  note?: string;
}

const priorityColors: Record<Priority, { bg: string; text: string; border: string }> = {
  high: { bg: '#FFEBEE', text: colors.danger, border: colors.danger },
  medium: { bg: '#FFF8E1', text: '#F57C00', border: colors.accent },
  low: { bg: colors.primaryLight, text: colors.primary, border: colors.secondary },
};

export function PriorityBadge({ priority, note }: Props) {
  const c = priorityColors[priority];
  return (
    <View style={[styles.card, { backgroundColor: c.bg, borderColor: c.border }]}>
      <View style={styles.row}>
        <Ionicons name="alert-circle" size={22} color={c.text} />
        <Text style={[styles.title, { color: c.text }]}>{formatPriority(priority)}</Text>
      </View>
      {note ? <Text style={styles.note}>{note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    marginVertical: spacing.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { ...typography.h3, fontSize: 16 },
  note: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm },
});
