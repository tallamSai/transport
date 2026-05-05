import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useAgriStore } from '../../store/useAgriStore';
import { signOutAll } from '../../services/session';
import { isMockMode } from '../../services/config';

export function DriverProfileScreen() {
  const user = useAgriStore((s) => s.user);
  const vehicle = useAgriStore((s) => s.driverVehicle);
  const mock = isMockMode();

  return (
    <Screen scroll>
      <Card>
        <Text style={[typography.subtitle, { color: colors.primary }]}>{user?.name}</Text>
        <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4 }]}>{user?.phone}</Text>
        <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 8 }]}>
          Driver · {vehicle?.type || '—'} · {mock ? 'mock' : 'live'}
        </Text>
      </Card>
      <View style={{ height: spacing.lg }} />
      <Button title="Sign out" onPress={signOutAll} variant="ghost" />
    </Screen>
  );
}
