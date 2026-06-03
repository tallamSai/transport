import type { Priority, VehicleStatus } from '../types';

export function formatPriority(p: Priority): string {
  const map: Record<Priority, string> = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority',
  };
  return map[p];
}

export function formatStatus(status: VehicleStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function getVehicleIcon(type: string): keyof typeof import('@expo/vector-icons').Ionicons.glyphMap {
  if (type === 'Tractor') return 'construct';
  if (type === 'Truck') return 'bus';
  return 'car';
}
