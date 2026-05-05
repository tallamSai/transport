import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {boolean} [props.scroll]
 * @param {object} [props.contentStyle]
 */
export function Screen({ children, scroll, contentStyle }) {
  const inner = scroll ? (
    <ScrollView contentContainerStyle={[styles.scroll, contentStyle]} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fill, contentStyle]}>{children}</View>
  );
  return <SafeAreaView style={styles.safe}>{inner}</SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fill: {
    flex: 1,
    padding: spacing.md,
  },
  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
});
