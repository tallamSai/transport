export default {
  expo: {
    name: 'FarmLift',
    slug: 'farmlift',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    newArchEnabled: false,
    scheme: 'farmlift',
    splash: {
      resizeMode: 'contain',
      backgroundColor: '#F5F9F5',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.farmlift.app',
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || '',
      },
    },
    android: {
      adaptiveIcon: { backgroundColor: '#2E7D32' },
      package: 'com.farmlift.app',
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || '',
        },
      },
    },
    web: { bundler: 'metro' },
    plugins: ['expo-font'],
  },
};
