import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Assets } from '../constants/assets';
import { colors, radius, spacing, shadow } from '../constants/theme';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

const menu = [
  { icon: 'person-outline' as const, label: 'Personal Details' },
  { icon: 'bus-outline' as const, label: 'Transport History' },
  { icon: 'cube-outline' as const, label: 'Completed Deliveries' },
  { icon: 'settings-outline' as const, label: 'Settings' },
  { icon: 'help-circle-outline' as const, label: 'Help & Support' },
];

export function ProfileScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.headBg}>
        <View style={styles.head}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.headTitle}>My Profile</Text>
          <Ionicons name="ellipse-outline" size={24} color="#fff" />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.card} contentContainerStyle={styles.scroll}>
        <View style={styles.profileRow}>
          <Image source={Assets.loginBg} style={styles.avatar} resizeMode="cover" />
          <View>
            <Text style={styles.name}>Ramesh Kumar</Text>
            <Text style={styles.meta}>Farmer</Text>
            <Text style={styles.meta}>Rampur Village, UP, India</Text>
          </View>
        </View>

        {menu.map((m) => (
          <TouchableOpacity key={m.label} style={styles.menuRow}>
            <Ionicons name={m.icon} size={22} color={colors.primary} />
            <Text style={styles.menuLabel}>{m.label}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.logout}
          onPress={() => navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Login' }] })}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  headBg: { backgroundColor: colors.primary },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  headTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -4,
  },
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg, gap: spacing.md },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: colors.lightGreen },
  name: { fontSize: 20, fontWeight: '700', color: colors.text },
  meta: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  menuLabel: { flex: 1, fontSize: 16, color: colors.text },
  logout: {
    backgroundColor: colors.danger,
    borderRadius: radius.pill,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  logoutText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
