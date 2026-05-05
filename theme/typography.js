import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const typography = {
  title: { fontSize: 22, fontWeight: '700', fontFamily },
  subtitle: { fontSize: 17, fontWeight: '600', fontFamily },
  body: { fontSize: 16, fontWeight: '400', fontFamily },
  caption: { fontSize: 13, fontWeight: '400', fontFamily },
  label: { fontSize: 12, fontWeight: '600', fontFamily },
};
