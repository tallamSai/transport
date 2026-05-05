import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

let channelReady = false;

/** Call once at startup so Android 8+ delivers heads-up notifications. */
export async function ensureNotificationChannel() {
  if (Platform.OS === 'web') return;
  if (Platform.OS === 'android' && !channelReady) {
    try {
      await Notifications.setNotificationChannelAsync('agrimove-alerts', {
        name: 'AgriMove alerts',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#1B4332',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
      channelReady = true;
    } catch (e) {
      console.warn('[notify] channel', e);
    }
  }
}

async function ensureWebNotificationPermission() {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

/** Request browser / native notification permission once at startup. */
export async function requestAllNotificationPermissions() {
  if (Platform.OS === 'web') {
    await ensureWebNotificationPermission();
    return;
  }
  await ensureNotificationChannel();
  await Notifications.requestPermissionsAsync().catch(() => {});
}

/**
 * @param {string} title
 * @param {string} body
 */
export async function scheduleLocalNotification(title, body) {
  try {
    if (Platform.OS === 'web') {
      const ok = await ensureWebNotificationPermission();
      if (ok && typeof window !== 'undefined' && 'Notification' in window) {
        void new Notification(title, {
          body,
          icon: '/favicon.png',
          tag: 'agrimove',
        });
      } else {
        const { useAgriStore } = await import('../store/useAgriStore.js');
        useAgriStore.getState().pushToast(title, body);
      }
      return;
    }

    await ensureNotificationChannel();
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: Platform.OS === 'ios' ? 'default' : true,
        ...(Platform.OS === 'android' ? { channelId: 'agrimove-alerts' } : {}),
      },
      trigger: null,
    });
  } catch (e) {
    console.warn('[notify]', e);
    try {
      const { useAgriStore } = await import('../store/useAgriStore.js');
      useAgriStore.getState().pushToast(title, body);
    } catch {
      /* ignore */
    }
  }
}
