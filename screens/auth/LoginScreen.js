import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/Button';
import { GoogleAuthButtons } from '../../components/GoogleAuthButtons';
import { colors } from '../../theme/colors';
import { spacing, radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { isFirebaseConfigured } from '../../services/config';
import { formatAuthError } from '../../services/authErrors';
import { enterDemoMode, signInEmail, signUpEmail } from '../../services/session';

/**
 * @param {object} props
 * @param {import('@react-navigation/native').NavigationProp<any>} props.navigation
 */
export function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const hasFirebase = isFirebaseConfigured();

  async function onDemo() {
    setError('');
    await enterDemoMode();
    navigation.navigate('RoleSelect');
  }

  async function onSignIn() {
    setError('');
    setLoading(true);
    try {
      await signInEmail(email.trim(), password);
    } catch (e) {
      setError(formatAuthError(e));
    } finally {
      setLoading(false);
    }
  }

  async function onRegister() {
    setError('');
    setLoading(true);
    try {
      await signUpEmail(email.trim(), password);
      /* RootNavigator switches to RoleSelect when user exists without role */
    } catch (e) {
      setError(formatAuthError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={['#EEF6EE', colors.background, '#F0EDE5']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.hero}>
              <View style={styles.logoCircle}>
                <Ionicons name="leaf" size={36} color={colors.surface} />
              </View>
              <Text style={[typography.title, styles.title]}>AgriMove</Text>
              <Text style={[typography.caption, styles.tagline]}>
                Match crops with the right vehicle — fast, transparent, tracked.
              </Text>
            </View>

            <View style={styles.card}>
              {hasFirebase ? (
                <>
                  <Text style={styles.cardTitle}>Welcome back</Text>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="you@example.com"
                    placeholderTextColor={colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                  />
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    secureTextEntry
                    placeholder="••••••••"
                    placeholderTextColor={colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                  />
                  {error ? <Text style={styles.err}>{error}</Text> : null}

                  <Button title="Sign in" onPress={onSignIn} loading={loading} />
                  <View style={{ height: spacing.sm }} />
                  <Button
                    title="Create account"
                    onPress={onRegister}
                    loading={loading}
                    variant="ghost"
                  />

                  <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.or}>or</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <GoogleAuthButtons
                    disabled={loading}
                    onError={(e) => setError(formatAuthError(e))}
                  />
                </>
              ) : (
                <Text style={[typography.caption, styles.hint]}>
                  Firebase env vars not set — use offline demo for the full mock experience.
                </Text>
              )}

              <View style={styles.dividerWide} />
              <Button title="Offline demo (mock data)" onPress={onDemo} variant="ghost" />
            </View>

            <Text style={styles.footer}>Hackathon-ready · Maps & live mode on device</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  hero: { alignItems: 'center', marginBottom: spacing.xl },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  title: { color: colors.primary, fontSize: 28, marginBottom: spacing.xs },
  tagline: {
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  cardTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  label: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
    color: colors.text,
    fontSize: 16,
  },
  err: { color: colors.error, marginBottom: spacing.sm, ...typography.caption },
  hint: { color: colors.textSecondary, marginBottom: spacing.sm, textAlign: 'center' },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  or: {
    ...typography.caption,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
  },
  dividerWide: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  footer: {
    ...typography.caption,
    color: colors.tabInactive,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
