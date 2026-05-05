import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useAgriStore } from '../store/useAgriStore';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { AuthNavigator } from './AuthNavigator';
import { FarmerNavigator } from './FarmerNavigator';
import { DriverNavigator } from './DriverNavigator';
import { colors } from '../theme/colors';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
    text: colors.text,
    card: colors.surface,
    border: colors.border,
  },
};

function isOnboardingComplete(user) {
  return user && (user.role === 'farmer' || user.role === 'driver');
}

export function RootNavigator() {
  const hydrated = useAgriStore((s) => s.hydrated);
  const user = useAgriStore((s) => s.user);

  if (!hydrated) {
    return <SplashScreen />;
  }

  if (!isOnboardingComplete(user)) {
    const initialRoute = user ? 'RoleSelect' : 'Login';
    return (
      <NavigationContainer theme={theme}>
        <AuthNavigator initialRouteName={initialRoute} stackKey={user?.id || 'guest'} />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer theme={theme}>
      {user.role === 'farmer' ? <FarmerNavigator /> : <DriverNavigator />}
    </NavigationContainer>
  );
}
