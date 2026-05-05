import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { RootNavigator } from './navigation/RootNavigator';
import { ToastListener } from './components/ToastListener';
import { RequestNotificationBridge } from './components/RequestNotificationBridge';
import { requestAllNotificationPermissions } from './services/localNotifications';
import { colors } from './theme/colors';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    requestAllNotificationPermissions();
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.root}>
        <StatusBar style="dark" />
        <RequestNotificationBridge />
        <RootNavigator />
        <ToastListener />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
});
