import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { hydrateSession } from '../../services/session';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export function SplashScreen() {
  useEffect(() => {
    hydrateSession();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[typography.title, styles.logo]}>AgriMove</Text>
      <Text style={[typography.caption, styles.tag]}>Smart farm transport</Text>
      <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { color: colors.primary, marginBottom: 8 },
  tag: { color: colors.textSecondary, marginBottom: 32 },
  spinner: { marginTop: 8 },
});
