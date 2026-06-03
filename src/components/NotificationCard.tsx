import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AppNotification } from '../types';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';

const iconMap: Record<AppNotification['type'], keyof typeof Ionicons.glyphMap> = {
  assigned: 'car',
  arrived: 'location',
  started: 'navigate',
  completed: 'checkmark-circle',
  info: 'notifications',
};

const colorMap: Record<AppNotification['type'], string> = {
  assigned: colors.primary,
  arrived: colors.secondary,
  started: colors.accent,
  completed: colors.success,
  info: colors.textSecondary,
};

interface Props {
  item: AppNotification;
}

export function NotificationCard({ item }: Props) {
  const c = colorMap[item.type];
  return (
    <View style={[styles.card, shadows.card]}>
      <View style={[styles.icon, { backgroundColor: `${c}18` }]}>
        <Ionicons name={iconMap[item.type]} size={22} color={c} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.msg}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  body: { flex: 1 },
  title: { ...typography.h3, fontSize: 15, color: colors.textPrimary },
  msg: { ...typography.caption, color: colors.textSecondary, marginTop: 4, lineHeight: 18 },
  time: { ...typography.label, color: colors.primary, marginTop: spacing.sm },
});
