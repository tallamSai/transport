import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useAgriStore } from '../../store/useAgriStore';
import { signOutAll } from '../../services/session';
import { isMockMode } from '../../services/config';

export function FarmerProfileScreen() {
  const navigation = useNavigation();
  const user = useAgriStore((s) => s.user);
  const mock = isMockMode();

  return (
    <Screen scroll>
      <Card>
        <Text style={[typography.subtitle, { color: colors.primary }]}>{user?.name}</Text>
        <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4 }]}>{user?.phone || '—'}</Text>
        <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 8 }]}>
          Role: Farmer {mock ? '(mock)' : ''}
        </Text>
      </Card>

      {mock ? (
        <>
          <View style={{ height: spacing.md }} />
          <Pressable onPress={() => navigation.navigate('AdminMonitor')}>
            <Card>
              <Text style={[typography.subtitle, { color: colors.text }]}>Delivery monitor</Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>
                View all mock requests (hackathon demo)
              </Text>
            </Card>
          </Pressable>
        </>
      ) : null}

      <View style={{ height: spacing.lg }} />
      <Button title="Sign out" onPress={signOutAll} variant="ghost" />
    </Screen>
  );
}
