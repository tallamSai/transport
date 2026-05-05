import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

/**
 * @param {object} props
 * @param {import('@react-navigation/native').NavigationProp<any>} props.navigation
 */
export function RoleSelectScreen({ navigation }) {
  return (
    <Screen scroll>
      <Text style={[typography.subtitle, styles.head]}>Choose how you use AgriMove</Text>
      <Text style={[typography.caption, styles.sub]}>
        You can change this later only by signing out in profile.
      </Text>

      <Pressable onPress={() => navigation.navigate('ProfileSetup', { role: 'farmer' })}>
        <Card style={styles.card}>
          <Text style={[typography.subtitle, styles.cardTitle]}>Farmer</Text>
          <Text style={[typography.body, styles.cardBody]}>
            Post crop loads, see nearby vehicles, and track delivery to the mandi.
          </Text>
        </Card>
      </Pressable>

      <View style={{ height: spacing.md }} />

      <Pressable onPress={() => navigation.navigate('ProfileSetup', { role: 'driver' })}>
        <Card style={styles.card}>
          <Text style={[typography.subtitle, styles.cardTitle]}>Transport provider</Text>
          <Text style={[typography.body, styles.cardBody]}>
            Register your tractor or truck, go online, accept trips, and navigate optimized routes.
          </Text>
        </Card>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { color: colors.text, marginBottom: spacing.sm },
  sub: { color: colors.textSecondary, marginBottom: spacing.lg },
  card: { marginBottom: 0 },
  cardTitle: { color: colors.primary, marginBottom: spacing.sm },
  cardBody: { color: colors.textSecondary },
});
