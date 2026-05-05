import { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { getFirebaseAuth } from '../services/firebase';
import { applyFirebaseUserToStore } from '../services/session';
import { signInWithGooglePopup } from '../services/googleAuth';
import { colors } from '../theme/colors';
import { radius } from '../theme/spacing';
import { typography } from '../theme/typography';

WebBrowser.maybeCompleteAuthSession();

function webClientId() {
  return (
    Constants.expoConfig?.extra?.googleWebClientId ||
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
    ''
  ).trim();
}

/** Web: Firebase popup — uses OAuth clients from your Firebase project. */
function GoogleButtonWeb({ onError, disabled }) {
  const [busy, setBusy] = useState(false);

  async function onPress() {
    try {
      setBusy(true);
      const user = await signInWithGooglePopup();
      await applyFirebaseUserToStore(user);
    } catch (e) {
      onError?.(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Pressable
      style={[styles.googleBtn, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || busy}
    >
      {busy ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <>
          <Ionicons name="logo-google" size={22} color="#4285F4" />
          <Text style={styles.googleText}>Continue with Google</Text>
        </>
      )}
    </Pressable>
  );
}

/** Only mounted when web client ID exists — keeps hooks valid. */
function GoogleButtonNativeImpl({ onError, disabled }) {
  const [busy, setBusy] = useState(false);
  const cid = webClientId();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: cid,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken =
        response.params?.id_token ||
        response.authentication?.idToken ||
        response.authentication?.accessToken;
      if (!idToken) return;
      setBusy(true);
      const auth = getFirebaseAuth();
      if (!auth) {
        setBusy(false);
        return;
      }
      const credential = GoogleAuthProvider.credential(idToken);
      signInWithCredential(auth, credential)
        .then(() => applyFirebaseUserToStore(auth.currentUser))
        .catch(onError)
        .finally(() => setBusy(false));
    } else if (response?.type === 'error') {
      onError?.(new Error(response.error?.message || 'Google sign-in failed'));
    }
  }, [response]);

  return (
    <Pressable
      style={[styles.googleBtn, disabled && styles.disabled]}
      onPress={() => promptAsync()}
      disabled={disabled || busy || !request}
    >
      {busy ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <>
          <Ionicons name="logo-google" size={22} color="#4285F4" />
          <Text style={styles.googleText}>Continue with Google</Text>
        </>
      )}
    </Pressable>
  );
}

function NativeEnvHint() {
  return (
    <View style={styles.noteBox}>
      <Text style={styles.noteText}>
        For Google on iOS/Android, set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID (OAuth 2.0 Web client ID from
        Firebase Console → Authentication → Google → Web client ID).
      </Text>
    </View>
  );
}

/**
 * @param {object} props
 * @param {(e: unknown) => void} [props.onError]
 * @param {boolean} [props.disabled]
 */
export function GoogleAuthButtons({ onError, disabled }) {
  if (Platform.OS === 'web') {
    return <GoogleButtonWeb onError={onError} disabled={disabled} />;
  }
  if (!webClientId()) {
    return <NativeEnvHint />;
  }
  return <GoogleButtonNativeImpl onError={onError} disabled={disabled} />;
}

const styles = StyleSheet.create({
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    minHeight: 52,
  },
  googleText: {
    ...typography.subtitle,
    color: colors.text,
    fontWeight: '600',
  },
  disabled: { opacity: 0.5 },
  noteBox: {
    padding: 12,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.sm,
  },
  noteText: { ...typography.caption, color: colors.textSecondary },
});
