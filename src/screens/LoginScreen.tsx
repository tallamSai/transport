import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Assets } from '../constants/assets';
import { colors, radius, spacing } from '../constants/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [hidePw, setHidePw] = useState(true);

  return (
    <ImageBackground source={Assets.loginBg} style={styles.bg} resizeMode="cover">
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.15)', 'rgba(255,255,255,0.97)']}
        locations={[0.35, 0.55, 0.78]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safe}>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            enabled
          >
            <ScrollView
              contentContainerStyle={styles.scroll}
              keyboardShouldPersistTaps="handled"
              bounces={false}
              scrollEnabled
            >
              <View style={styles.brandBlock}>
                <Text style={styles.leaf}>🌱</Text>
                <Text style={styles.brand}>FarmLift</Text>
                <Text style={styles.tagline}>
                  Smart Farm Transport Matching{'\n'}& Optimization
                </Text>
              </View>

              <View style={styles.form}>
                <View style={styles.field}>
                  <Ionicons name="call-outline" size={20} color="#888" />
                  <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    placeholderTextColor="#aaa"
                    keyboardType="phone-pad"
                    value={mobile}
                    onChangeText={setMobile}
                  />
                </View>
                <View style={styles.field}>
                  <Ionicons name="lock-closed-outline" size={20} color="#888" />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry={hidePw}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setHidePw(!hidePw)}>
                    <Ionicons name={hidePw ? 'eye-off-outline' : 'eye-outline'} size={18} color="#888" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.forgot}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={() => navigation.replace('Main')}
                  activeOpacity={0.9}
                >
                  <Text style={styles.loginText}>LOGIN</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                  <Text style={styles.footerMuted}>Don&apos;t have an account? </Text>
                  <Text style={styles.footerLink}>Register</Text>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  gradient: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'flex-end', paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  brandBlock: { alignItems: 'center', marginBottom: spacing.lg, marginTop: '28%' },
  leaf: { fontSize: 40, marginBottom: 4 },
  brand: { fontSize: 32, fontWeight: '700', color: colors.primaryDark },
  tagline: { fontSize: 15, textAlign: 'center', color: '#2D6A4F', marginTop: 8, lineHeight: 22, fontWeight: '500' },
  form: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: radius.sheet,
    padding: spacing.lg,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 6 },
    }),
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    height: 54,
    marginBottom: spacing.md,
    gap: 10,
  },
  input: { flex: 1, fontSize: 16, color: colors.text },
  forgot: { alignSelf: 'flex-end', marginBottom: spacing.lg },
  forgotText: { color: '#666', fontSize: 13, fontWeight: '500' },
  loginBtn: {
    backgroundColor: colors.primaryDark,
    height: 50,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  loginText: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 1 },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerMuted: { color: '#666', fontSize: 14 },
  footerLink: { color: '#2D6A4F', fontSize: 14, fontWeight: '700' },
});
