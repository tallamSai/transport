import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Assets } from '../constants/assets';
import { colors, radius, spacing, shadow } from '../constants/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { VehiclesStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<VehiclesStackParamList, 'VehicleList'>;

const filters = ['All', 'Tractor', 'Truck', 'Mini Truck'];

const fleet = [
  { name: 'Tractor 1', cap: '60 Quintal', dist: '2.1 km away', status: 'Available', img: Assets.tractor1, busy: false },
  { name: 'Truck 2', cap: '120 Quintal', dist: '3.4 km away', status: 'Busy', img: Assets.truck2, busy: true },
  { name: 'Tractor 3', cap: '50 Quintal', dist: '4.7 km away', status: 'Available', img: Assets.tractor2, busy: false },
  { name: 'Truck 4', cap: '100 Quintal', dist: '5.2 km away', status: 'Available', img: Assets.truck2, busy: false },
];

export function VehicleListScreen({ navigation }: Props) {
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');

  const list = fleet.filter((v) => {
    const matchF = filter === 'All' || v.name.startsWith(filter.split(' ')[0]);
    const matchQ = !q || v.name.toLowerCase().includes(q.toLowerCase());
    return matchF && matchQ;
  });

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.headSafe}>
        <View style={styles.greenHead}>
          <Text style={styles.headTitle}>All Vehicles</Text>
          <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
        </View>
      </SafeAreaView>

      <View style={[styles.body, shadow.card]}>
        <View style={styles.search}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search vehicles..."
            placeholderTextColor={colors.textMuted}
            value={q}
            onChangeText={setQ}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, filter === f && styles.chipOn]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.chipText, filter === f && styles.chipTextOn]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.mapLink} onPress={() => navigation.navigate('VehicleDetection')}>
          <Ionicons name="map" size={18} color={colors.primary} />
          <Text style={styles.mapLinkText}>Open Live Detection Map</Text>
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>
          {list.map((v) => (
            <View key={v.name} style={styles.row}>
              <Image source={v.img} style={styles.thumb} resizeMode="contain" />
              <View style={styles.rowInfo}>
                <Text style={styles.rowName}>{v.name}</Text>
                <Text style={styles.rowMeta}>Capacity: {v.cap}</Text>
                <Text style={styles.rowMeta}>{v.dist}</Text>
                <Text style={[styles.status, v.busy ? styles.busy : styles.avail]}>{v.status}</Text>
              </View>
              <View style={styles.check}>
                <Ionicons name="checkmark" size={18} color="#fff" />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  headSafe: { backgroundColor: colors.primary },
  greenHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  headTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  body: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -8,
    padding: spacing.md,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: spacing.md,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.text },
  chips: { marginBottom: spacing.md, maxHeight: 44 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    backgroundColor: colors.surface,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.text },
  chipTextOn: { color: '#fff', fontWeight: '600' },
  mapLink: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md },
  mapLinkText: { color: colors.primary, fontWeight: '600' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
  },
  thumb: { width: 72, height: 56 },
  rowInfo: { flex: 1, paddingHorizontal: spacing.sm },
  rowName: { fontSize: 16, fontWeight: '700', color: colors.textNavy },
  rowMeta: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  status: { fontSize: 13, fontWeight: '700', marginTop: 4 },
  avail: { color: colors.secondary },
  busy: { color: colors.busy },
  check: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
