import Constants from 'expo-constants';

/**
 * Firebase config from app manifest (native) or EXPO_PUBLIC_* inlined by Metro (web often needs this).
 */
function resolveFirebaseConfig() {
  const ext = Constants.expoConfig?.extra?.firebase;
  if (ext?.apiKey) return ext;

  const apiKey = (process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '').trim();

  if (!apiKey) return ext || {};

  return {
    apiKey,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
  };
}

/** Same rule as app.config.js */
function resolveUseMockFlag() {
  const extraUm = Constants.expoConfig?.extra?.useMock;
  if (extraUm === false) return false;
  if (extraUm === true) return true;

  const mockEnv = process.env.EXPO_PUBLIC_USE_MOCK;
  const fb = resolveFirebaseConfig();
  const hasKey = !!(fb?.apiKey && String(fb.apiKey).trim());
  return mockEnv === 'true' || (!hasKey && mockEnv !== 'false');
}

/** @returns {boolean} */
export function isMockMode() {
  return resolveUseMockFlag();
}

/** @returns {import('firebase/app').FirebaseOptions | null} */
export function getFirebaseOptions() {
  const fb = resolveFirebaseConfig();
  if (!fb?.apiKey) return null;
  return {
    apiKey: fb.apiKey,
    authDomain: fb.authDomain,
    projectId: fb.projectId,
    storageBucket: fb.storageBucket,
    messagingSenderId: fb.messagingSenderId,
    appId: fb.appId,
  };
}

/** @returns {string} */
export function getGoogleMapsKey() {
  return Constants.expoConfig?.extra?.googleMapsKey || process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || '';
}

/** @returns {boolean} — email/password UI available */
export function isFirebaseConfigured() {
  return !!getFirebaseOptions()?.apiKey;
}
