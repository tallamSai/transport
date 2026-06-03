import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeStack } from './HomeStack';
import { VehiclesStack } from './VehiclesStack';
import { AIMatchingScreen, RouteOptimizationScreen, ProfileScreen } from '../screens';
import type { MainTabParamList } from './types';
import { colors } from '../constants/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 6,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
            Home: 'home',
            Vehicles: 'car',
            Matching: 'hardware-chip',
            Routes: 'map',
            Profile: 'person',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="Vehicles" component={VehiclesStack} options={{ title: 'Vehicles' }} />
      <Tab.Screen name="Matching" component={AIMatchingScreen} options={{ title: 'Matching' }} />
      <Tab.Screen name="Routes" component={RouteOptimizationScreen} options={{ title: 'Routes' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
