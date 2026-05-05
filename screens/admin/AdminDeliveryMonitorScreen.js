import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useAgriStore } from '../../store/useAgriStore';

export function AdminDeliveryMonitorScreen() {
  const requests = useAgriStore((s) => s.requests);
  const sorted = [...requests].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  return (
    <Screen scroll={false} contentStyle={{ flex: 1 }}>
      <Text style={[typography.caption, styles.hint]}>
        Mock-mode analytics — all transport requests in session.
      </Text>
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No deliveries yet.</Text>}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text style={[typography.subtitle, { color: colors.text }]}>{item.cropType}</Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              {item.status} · Farmer {item.farmerId} · Vehicle {item.assignedVehicleId || '—'}
            </Text>
            <Text style={[typography.caption, { color: colors.primaryMuted, marginTop: 4 }]}>
              ₹{item.estimatedCost ?? '—'} · {item.urgency}
            </Text>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hint: { color: colors.textSecondary, marginBottom: spacing.md },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: spacing.lg },
  card: { marginBottom: 0 },
});
