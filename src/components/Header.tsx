import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../constants/theme';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
}

export function Header({ title, subtitle, onBack, rightIcon, onRightPress }: Props) {
  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable onPress={onBack} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
      ) : (
        <View style={styles.backPlaceholder} />
      )}
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightIcon ? (
        <Pressable onPress={onRightPress} style={styles.back}>
          <Ionicons name={rightIcon} size={24} color={colors.primary} />
        </Pressable>
      ) : (
        <View style={styles.backPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  back: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backPlaceholder: { width: 40 },
  center: { flex: 1, alignItems: 'center' },
  title: { ...typography.h2, color: colors.primary, textAlign: 'center' },
  subtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
