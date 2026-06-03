import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout, SectionTitle, CustomButton } from '../components';
import { farmers, deliveries } from '../data';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

const farmer = farmers[0];
const completedCount = deliveries.filter((d) => d.status === 'delivered').length;

export function ProfileScreen({ navigation }: Props) {
  return (
    <ScreenLayout>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        <Text style={styles.name}>{farmer.name}</Text>
        <Text style={styles.role}>Farmer · {farmer.village}</Text>
      </View>

      <SectionTitle title="Personal Details" />
      <InfoCard icon="call" label="Phone" value={farmer.phone} />
      <InfoCard icon="leaf" label="Primary Crop" value={farmer.cropType} />
      <InfoCard icon="location" label="Pickup" value={farmer.pickupLocation} />

      <SectionTitle title="Transport History" />
      {deliveries.map((d) => (
        <View key={d.id} style={[styles.history, shadows.card]}>
          <Text style={styles.historyTitle}>{d.cropType} → {d.destination}</Text>
          <Text style={styles.historySub}>{d.vehicleName} · {d.status.replace('_', ' ')}</Text>
        </View>
      ))}

      <SectionTitle title="Completed Deliveries" />
      <View style={[styles.completed, shadows.card]}>
        <Text style={styles.completedNum}>{completedCount}</Text>
        <Text style={styles.completedLabel}>Total completed trips</Text>
      </View>

      <SectionTitle title="Settings" />
      <SettingsRow icon="notifications-outline" label="Notifications" />
      <SettingsRow icon="language-outline" label="Language" />
      <SettingsRow icon="help-circle-outline" label="Help & Support" />

      <CustomButton
        title="Logout"
        variant="outline"
        onPress={() =>
          navigation.getParent()?.reset({
            index: 0,
            routes: [{ name: 'Splash' }],
          })
        }
        style={{ marginTop: spacing.lg }}
      />
    </ScreenLayout>
  );
}

function InfoCard({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={[styles.info, shadows.card]}>
      <Ionicons name={icon} size={22} color={colors.primary} />
      <View style={styles.infoBody}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function SettingsRow({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <Pressable style={[styles.settings, shadows.card]}>
      <Ionicons name={icon} size={22} color={colors.primary} />
      <Text style={styles.settingsLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  profileHeader: { alignItems: 'center', marginBottom: spacing.xl },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  name: { ...typography.h1, color: colors.textPrimary, fontSize: 24 },
  role: { ...typography.caption, color: colors.textSecondary },
  info: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
    gap: spacing.md,
  },
  infoBody: { flex: 1 },
  infoLabel: { ...typography.caption, color: colors.textSecondary },
  infoValue: { ...typography.body, color: colors.textPrimary, fontWeight: '600' },
  history: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  historyTitle: { ...typography.h3, fontSize: 14, color: colors.textPrimary },
  historySub: { ...typography.caption, color: colors.textSecondary, marginTop: 2, textTransform: 'capitalize' },
  completed: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  completedNum: { ...typography.h1, color: colors.primary, fontSize: 40 },
  completedLabel: { ...typography.caption, color: colors.textSecondary },
  settings: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  settingsLabel: { ...typography.body, flex: 1, color: colors.textPrimary },
});
