/* Loads .env before reading process.env (Expo evaluates this file before Metro injects env). */
require('dotenv').config();

const firebaseApiKey = (process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '').trim();
const mockEnv = process.env.EXPO_PUBLIC_USE_MOCK;

/** Mock only when explicitly requested, or when no Firebase API key is present (dev fallback). */
const useMock =
  mockEnv === 'true' || (!firebaseApiKey && mockEnv !== 'false');

export default {
  expo: {
    name: 'AgriMove',
    slug: 'AgriMove',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    scheme: 'agrimove',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#F4F7F4',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.agrimove.app',
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || '',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#F4F7F4',
      },
      edgeToEdgeEnabled: true,
      package: 'com.agrimove.app',
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || '',
        },
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-web-browser',
      'expo-font',
      [
        'expo-notifications',
        {
          icon: './assets/icon.png',
          color: '#2D5A3D',
        },
      ],
      [
        'expo-location',
        {
          locationWhenInUsePermission:
            'AgriMove uses your location for pickup coordinates and live tracking.',
        },
      ],
    ],
    extra: {
      useMock,
      firebase: {
        apiKey: firebaseApiKey,
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
      },
      googleMapsKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || '',
      /** OAuth 2.0 Web client ID (Google Cloud / Firebase → Google sign-in) for native Google button */
      googleWebClientId: (process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '').trim(),
    },
  },
};
