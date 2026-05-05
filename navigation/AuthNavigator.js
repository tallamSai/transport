import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RoleSelectScreen } from '../screens/auth/RoleSelectScreen';
import { ProfileSetupScreen } from '../screens/auth/ProfileSetupScreen';

const Stack = createNativeStackNavigator();

/**
 * @param {object} [props]
 * @param {'Login' | 'RoleSelect'} [props.initialRouteName]
 * @param {string} [props.stackKey] remount when switching guest → signed-in (onboarding)
 */
export function AuthNavigator({ initialRouteName = 'Login', stackKey = 'auth' }) {
  return (
    <Stack.Navigator
      key={stackKey}
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: true,
        headerTitleStyle: { fontWeight: '600' },
        headerTintColor: '#2D5A3D',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RoleSelect" component={RoleSelectScreen} options={{ title: 'Your role' }} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} options={{ title: 'Profile' }} />
    </Stack.Navigator>
  );
}
