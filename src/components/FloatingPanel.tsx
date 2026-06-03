import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing } from '../constants/theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function FloatingPanel({ children, style }: Props) {
  return <View style={[styles.panel, shadows.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
