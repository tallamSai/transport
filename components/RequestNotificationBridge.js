import { useRequestNotifications } from '../hooks/useRequestNotifications';

export function RequestNotificationBridge() {
  useRequestNotifications();
  return null;
}
