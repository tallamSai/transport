import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VehicleListScreen, VehicleDetectionScreen } from '../screens';
import type { VehiclesStackParamList } from './types';
import { colors } from '../constants/theme';

const Stack = createNativeStackNavigator<VehiclesStackParamList>();

export function VehiclesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="VehicleList" component={VehicleListScreen} />
      <Stack.Screen name="VehicleDetection" component={VehicleDetectionScreen} />
    </Stack.Navigator>
  );
}
