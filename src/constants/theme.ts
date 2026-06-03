export const colors = {
  primary: '#2E7D32',
  primaryDark: '#1B4332',
  secondary: '#4CAF50',
  lightGreen: '#E8F5E9',
  background: '#F5F9F5',
  surface: '#FFFFFF',
  accent: '#FFC107',
  danger: '#E53935',
  busy: '#D32F2F',
  text: '#212121',
  textMuted: '#757575',
  textNavy: '#1B2B48',
  border: '#EAEAEA',
  inputBg: '#FAFAFA',
  priorityBg: '#FFEBEE',
  priorityBorder: '#FFCDD2',
  navy: '#1B2B48',
  routeBlue: '#1976D2',
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 25,
  sheet: 24,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};
