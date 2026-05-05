import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { FarmerDashboardScreen } from '../screens/farmer/FarmerDashboardScreen';
import { FarmerMapScreen } from '../screens/farmer/FarmerMapScreen';
import { FarmerProfileScreen } from '../screens/farmer/FarmerProfileScreen';
import { CreateRequestScreen } from '../screens/farmer/CreateRequestScreen';
import { TrackingScreen } from '../screens/farmer/TrackingScreen';
import { AdminDeliveryMonitorScreen } from '../screens/admin/AdminDeliveryMonitorScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function FarmerTabs() {
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
        name="FarmerHome"
        component={FarmerDashboardScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="leaf-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="FarmerMap"
        component={FarmerMapScreen}
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="FarmerProfile"
        component={FarmerProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function FarmerNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FarmerTabs" component={FarmerTabs} options={{ headerShown: false }} />
      <Stack.Screen name="CreateRequest" component={CreateRequestScreen} options={{ title: 'New transport' }} />
      <Stack.Screen name="Tracking" component={TrackingScreen} options={{ title: 'Live tracking' }} />
      <Stack.Screen
        name="AdminMonitor"
        component={AdminDeliveryMonitorScreen}
        options={{ title: 'Delivery monitor' }}
      />
    </Stack.Navigator>
  );
}
