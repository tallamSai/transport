import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useAgriStore } from '../../store/useAgriStore';
import { subscribeFarmerRequests } from '../../services/transportApi';

function statusLabel(status) {
  const map = {
    pending: 'Searching',
    matched: 'Matched',
    accepted: 'Accepted',
    cancelled: 'Cancelled',
    completed: 'Completed',
    en_route: 'En route',
  };
  return map[status] || status;
}

export function FarmerDashboardScreen() {
  const navigation = useNavigation();
  const user = useAgriStore((s) => s.user);
  const [list, setList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user?.id) return () => {};
    return subscribeFarmerRequests(user.id, setList);
  }, [user?.id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 450);
  }, []);

  const sorted = [...list].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const activeCount = list.filter((r) =>
    ['matched', 'accepted', 'en_route'].includes(r.status),
  ).length;
  const searchingCount = list.filter((r) => r.status === 'pending').length;

  const listVersion = list.map((r) => `${r.id}:${r.status}`).join('|');

  return (
    <Screen scroll={false} contentStyle={{ flex: 1, padding: 0 }}>
      <LinearGradient
        colors={[colors.primary, colors.primaryMuted]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.heroTitle}>Hello, {user?.name || 'Farmer'}</Text>
        <Text style={styles.heroSub}>Your transports & history</Text>

        <View style={styles.heroSpacer} />

        <Button
          title="New transport request"
          variant="inverse"
          onPress={() => navigation.navigate('CreateRequest')}
          style={styles.heroButton}
        />

        <View style={styles.heroBottomPad} />
      </LinearGradient>

      <View style={styles.body}>
        <FlatList
          data={sorted}
          extraData={listVersion}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            list.length ? (
              <View style={styles.summary}>
                <Text style={styles.summaryText}>
                  {activeCount > 0
                    ? `${activeCount} active · `
                    : ''}
                  {searchingCount > 0 ? `${searchingCount} searching · ` : ''}
                  {list.length} total
                </Text>
                <Text style={styles.summaryHint}>Tap any row for live status & map</Text>
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <Text style={[typography.body, styles.empty]}>
              No requests yet. Create one to find a vehicle.
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.navigate('Tracking', { requestId: item.id })}
            >
              <Card style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={[typography.subtitle, styles.crop]}>{item.cropType}</Text>
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>{statusLabel(item.status)}</Text>
                  </View>
                </View>
                <Text style={[typography.caption, styles.meta]}>
                  {item.quantity} kg · {item.urgency} · {item.pickup?.label} →{' '}
                  {item.destination?.label}
                </Text>
                {item.assignedDriverName ? (
                  <Text style={[typography.caption, styles.driver]}>
                    Driver: {item.assignedDriverName}
                    {item.assignedDriverPhone ? ` · ${item.assignedDriverPhone}` : ''}
                  </Text>
                ) : null}
                {item.estimatedCost ? (
                  <Text style={[typography.caption, styles.cost]}>Est. ₹{item.estimatedCost}</Text>
                ) : null}
              </Card>
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  heroTitle: { ...typography.title, color: colors.surface },
  heroSub: {
    ...typography.caption,
    color: colors.surfaceMuted,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  /** Space between subtitle and primary action */
  heroSpacer: {
    height: spacing.xl,
  },
  heroButton: {
    alignSelf: 'stretch',
    width: '100%',
  },
  heroBottomPad: {
    height: spacing.lg,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  summary: {
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  summaryText: { ...typography.caption, color: colors.text, fontWeight: '600' },
  summaryHint: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  empty: { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.lg },
  card: { marginBottom: 0 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  crop: { color: colors.text, flex: 1 },
  meta: { color: colors.textSecondary, marginTop: 6 },
  driver: { color: colors.primaryMuted, marginTop: 6 },
  cost: { color: colors.accent, marginTop: 6, fontWeight: '600' },
  pill: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  pillText: { ...typography.caption, color: colors.primary, fontWeight: '600' },
});
