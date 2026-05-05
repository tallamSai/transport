import { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { DriverDashboardScreen } from '../screens/driver/DriverDashboardScreen';
import { DriverRequestsScreen } from '../screens/driver/DriverRequestsScreen';
import { DriverProfileScreen } from '../screens/driver/DriverProfileScreen';
import { VehicleFormScreen } from '../screens/driver/VehicleFormScreen';
import { NavigationMapScreen } from '../screens/driver/NavigationMapScreen';
import { colors } from '../theme/colors';
import { useAgriStore } from '../store/useAgriStore';
import { subscribeDriverRequests } from '../services/transportApi';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DriverTabs() {
  const user = useAgriStore((s) => s.user);
  const [incomingCount, setIncomingCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return () => {};
    return subscribeDriverRequests(user.id, (list) => {
      setIncomingCount(list.filter((r) => r.status === 'matched').length);
    });
  }, [user?.id]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: { borderTopColor: colors.border },
      }}
    >
      <Tab.Screen
        name="DriverHome"
        component={DriverDashboardScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="speedometer-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="DriverRequests"
        component={DriverRequestsScreen}
        options={{
          title: 'Requests',
          tabBarBadge: incomingCount > 0 ? incomingCount : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.urgent, color: colors.surface, fontSize: 11 },
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="DriverProfile"
        component={DriverProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function DriverNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DriverTabs" component={DriverTabs} options={{ headerShown: false }} />
      <Stack.Screen name="VehicleForm" component={VehicleFormScreen} options={{ title: 'Vehicle' }} />
      <Stack.Screen name="NavigationMap" component={NavigationMapScreen} options={{ title: 'Navigation' }} />
    </Stack.Navigator>
  );
}
