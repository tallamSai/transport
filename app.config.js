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
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#2E7D32',
      },
      package: 'com.farmlift.app',
    },
    web: {
      bundler: 'metro',
    },
    plugins: ['expo-font'],
  },
};
