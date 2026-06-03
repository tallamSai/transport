import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  HomeDashboardScreen,
  FarmerRegistrationScreen,
  TransportProviderRegistrationScreen,
  DeliveryTrackingScreen,
  NotificationMonitoringScreen,
} from '../screens';
import type { HomeStackParamList } from './types';
import { colors } from '../constants/theme';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="HomeDashboard" component={HomeDashboardScreen} />
      <Stack.Screen name="FarmerRegistration" component={FarmerRegistrationScreen} />
      <Stack.Screen name="TransportProviderRegistration" component={TransportProviderRegistrationScreen} />
      <Stack.Screen name="DeliveryTracking" component={DeliveryTrackingScreen} />
      <Stack.Screen name="NotificationMonitoring" component={NotificationMonitoringScreen} />
    </Stack.Navigator>
  );
}
