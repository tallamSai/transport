import { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAgriStore } from '../store/useAgriStore';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';

/**
 * In-app toast banner (no RN Alert).
 * Avoids web accessibility issues: Alert + navigation stacks often trigger aria-hidden/focus warnings.
 */
export function ToastListener() {
  const queue = useAgriStore((s) => s.toastQueue);
  const item = queue[0];
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!item) return undefined;
    const id = setTimeout(() => useAgriStore.getState().shiftToast(), 5200);
    return () => clearTimeout(id);
  }, [item?.title, item?.body, queue.length]);

  if (!item) return null;

  const bottomPad = Math.max(insets.bottom, spacing.md);

  return (
    <View
      style={[styles.overlay, { paddingBottom: bottomPad }]}
      pointerEvents="box-none"
      accessibilityLiveRegion="polite"
    >
      <View style={styles.banner} accessibilityRole="alert">
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.body}</Text>
        </View>
        <Pressable
          onPress={() => useAgriStore.getState().shiftToast()}
          style={styles.dismiss}
          accessibilityLabel="Dismiss notification"
          hitSlop={12}
        >
          <Text style={styles.dismissText}>OK</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    zIndex: 99999,
    elevation: 99999,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
      web: { boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
    }),
  },
  title: { ...typography.subtitle, color: colors.text },
  body: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  dismiss: { paddingLeft: spacing.sm, paddingVertical: 4 },
  dismissText: { ...typography.subtitle, color: colors.primary },
});
