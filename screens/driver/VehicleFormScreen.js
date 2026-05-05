import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { updateVehicleProfile, refreshDriverVehicleFromServer } from '../../services/transportApi';
import { useAgriStore } from '../../store/useAgriStore';
import { initMockSession } from '../../services/mock/mockApi';
import { isMockMode } from '../../services/config';

export function VehicleFormScreen() {
  const user = useAgriStore((s) => s.user);
  const vehicle = useAgriStore((s) => s.driverVehicle);
  const [type, setType] = useState(vehicle?.type || 'truck');
  const [capacity, setCapacity] = useState(String(vehicle?.capacityKg || 2000));
  const [loading, setLoading] = useState(false);

  async function onSave() {
    setLoading(true);
    try {
      const patch = {
        type: type === 'tractor' ? 'tractor' : 'truck',
        capacityKg: Math.max(100, parseInt(capacity, 10) || 1000),
      };
      await updateVehicleProfile(patch);
      if (isMockMode() && user) {
        initMockSession(user, { ...vehicle, ...patch });
      } else {
        await refreshDriverVehicleFromServer();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen scroll>
      <Text style={[typography.subtitle, styles.head]}>Vehicle registration</Text>

      <Text style={styles.label}>Type</Text>
      <View style={styles.row}>
        {['truck', 'tractor'].map((t) => (
          <Pressable
            key={t}
            onPress={() => setType(t)}
            style={[styles.chip, type === t && styles.chipOn]}
          >
            <Text style={[typography.body, type === t && { color: colors.surface }]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.label, { marginTop: spacing.md }]}>Capacity (kg)</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={capacity}
        onChangeText={setCapacity}
      />

      <Button title="Save" onPress={onSave} loading={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { color: colors.text, marginBottom: spacing.md },
  label: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  row: { flexDirection: 'row', gap: spacing.sm },
  chip: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
});
