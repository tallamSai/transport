import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout, VehicleCard, SectionTitle } from '../components';
import { vehicles } from '../data';
import { colors, radius, spacing } from '../constants/theme';
import type { VehicleType, VehicleStatus } from '../types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { VehiclesStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<VehiclesStackParamList, 'VehicleList'>;

const filters: { key: string; type?: VehicleType; status?: VehicleStatus }[] = [
  { key: 'All' },
  { key: 'Tractor', type: 'Tractor' },
  { key: 'Truck', type: 'Truck' },
  { key: 'Mini Truck', type: 'Mini Truck' },
  { key: 'Available', status: 'available' },
  { key: 'Busy', status: 'busy' },
];

export function VehicleListScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = useMemo(() => {
    const f = filters.find((x) => x.key === activeFilter);
    return vehicles.filter((v) => {
      const matchQuery =
        !query ||
        v.name.toLowerCase().includes(query.toLowerCase()) ||
        v.location.toLowerCase().includes(query.toLowerCase());
      const matchType = !f?.type || v.type === f.type;
      const matchStatus = !f?.status || v.status === f.status;
      return matchQuery && matchType && matchStatus;
    });
  }, [query, activeFilter]);

  return (
    <ScreenLayout>
      <SectionTitle title="Registered Vehicles" subtitle="Search and filter fleet" />
      <Pressable style={styles.detectBtn} onPress={() => navigation.navigate('VehicleDetection')}>
        <Ionicons name="radar" size={20} color="#fff" />
        <Text style={styles.detectText}>Live Vehicle Detection</Text>
      </Pressable>
      <TextInput
        style={styles.search}
        placeholder="Search vehicles..."
        placeholderTextColor={colors.textSecondary}
        value={query}
        onChangeText={setQuery}
      />
      <View style={styles.chips}>
        {filters.map((f) => (
          <Pressable
            key={f.key}
            style={[styles.chip, activeFilter === f.key && styles.chipActive]}
            onPress={() => setActiveFilter(f.key)}
          >
            <Text style={[styles.chipText, activeFilter === f.key && styles.chipTextActive]}>{f.key}</Text>
          </Pressable>
        ))}
      </View>
      {filtered.map((v, i) => (
        <VehicleCard key={v.id} vehicle={v} index={i} />
      ))}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  detectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  detectText: { color: '#fff', fontWeight: '600' },
  search: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, color: colors.textSecondary },
  chipTextActive: { color: '#fff', fontWeight: '600' },
});
