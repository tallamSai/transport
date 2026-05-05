import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';

/**
 * @param {object} props
 * @param {string} props.title
 * @param {() => void} props.onPress
 * @param {'primary' | 'ghost' | 'inverse'} [props.variant] — inverse = light surface on dark backgrounds
 * @param {boolean} [props.loading]
 * @param {boolean} [props.disabled]
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} [props.style]
 */
export function Button({ title, onPress, variant = 'primary', loading, disabled, style }) {
  const isGhost = variant === 'ghost';
  const isInverse = variant === 'inverse';
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        isInverse ? styles.inverse : isGhost ? styles.ghost : styles.primary,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={isGhost || isInverse ? colors.primary : colors.surface} />
      ) : (
        <Text
          style={[
            typography.subtitle,
            isInverse ? styles.textInverse : isGhost ? styles.textGhost : styles.textPrimary,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  inverse: {
    backgroundColor: colors.surface,
    borderWidth: 0,
  },
  textPrimary: { color: colors.surface },
  textGhost: { color: colors.primary },
  textInverse: { color: colors.primary },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.85 },
});
