import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Linking,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useAgriStore } from '../../store/useAgriStore';
import { subscribeDriverRequests, respondToRequest } from '../../services/transportApi';

export function DriverRequestsScreen() {
  const navigation = useNavigation();
  const user = useAgriStore((s) => s.user);
  const [list, setList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user?.id) return () => {};
    return subscribeDriverRequests(user.id, setList);
  }, [user?.id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 450);
  }, []);

  const pending = list.filter((r) => r.status === 'matched');

  async function handleAccept(id) {
    await respondToRequest(id, 'accepted');
    navigation.navigate('NavigationMap', { requestId: id });
  }

  function callFarmer(phone) {
    if (!phone) return;
    const n = String(phone).replace(/[^\d+]/g, '');
    if (n) Linking.openURL(`tel:${n}`);
  }

  return (
    <Screen scroll={false} contentStyle={{ flex: 1, padding: 0 }}>
      <LinearGradient
        colors={[colors.primary, colors.primaryMuted]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.heroTitle}>Incoming</Text>
        <Text style={styles.heroSub}>
          {pending.length} open {pending.length === 1 ? 'job' : 'jobs'}
        </Text>
        <Text style={styles.heroHint}>Accept or reject matched loads below</Text>

        <View style={styles.heroSpacer} />

        <Button
          title="Refresh list"
          variant="inverse"
          onPress={onRefresh}
          loading={refreshing}
          style={styles.heroButton}
        />

        <View style={styles.heroBottomPad} />
      </LinearGradient>

      <View style={styles.listWrap}>
        <FlatList
          data={pending}
          keyExtractor={(item) => item.id}
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
              No pending assignments. Stay online and you will be matched to nearby farmers.
            </Text>
          }
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Text style={[typography.subtitle, { color: colors.text }]}>{item.cropType}</Text>
              <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 4 }]}>
                {item.quantity} kg · {item.pickup?.label} → {item.destination?.label}
              </Text>
              {item.farmerName || item.farmerPhone ? (
                <View style={styles.farmerRow}>
                  <Ionicons name="person-circle-outline" size={20} color={colors.primary} />
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <Text style={[typography.caption, { color: colors.text }]}>
                      {item.farmerName || 'Farmer'}
                    </Text>
                    {item.farmerPhone ? (
                      <Text style={[typography.caption, { color: colors.textSecondary }]}>
                        {item.farmerPhone}
                      </Text>
                    ) : null}
                  </View>
                  {item.farmerPhone ? (
                    <Pressable
                      onPress={() => callFarmer(item.farmerPhone)}
                      style={styles.callBtn}
                      accessibilityLabel="Call farmer"
                    >
                      <Ionicons name="call" size={20} color={colors.surface} />
                    </Pressable>
                  ) : null}
                </View>
              ) : null}
              <Text style={[typography.caption, { color: colors.primaryMuted, marginTop: 8 }]}>
                Offer · ₹{item.estimatedCost ?? '—'}
              </Text>
              <View style={styles.actions}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                  <Button title="Accept" onPress={() => handleAccept(item.id)} />
                </View>
                <View style={{ flex: 1, marginLeft: spacing.sm }}>
                  <Button title="Reject" variant="ghost" onPress={() => respondToRequest(item.id, 'rejected')} />
                </View>
              </View>
              <Button
                title="Open navigation"
                variant="ghost"
                onPress={() => navigation.navigate('NavigationMap', { requestId: item.id })}
              />
            </Card>
          )}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
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
  heroHint: {
    ...typography.caption,
    color: colors.surfaceMuted,
    marginTop: spacing.xs,
    opacity: 0.95,
  },
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
  listWrap: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.lg },
  empty: { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.lg, padding: spacing.md },
  card: { marginBottom: 0 },
  actions: { flexDirection: 'row', marginTop: spacing.md },
  farmerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  callBtn: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
