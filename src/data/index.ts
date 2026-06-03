import vehiclesData from './vehicles.json';
import farmersData from './farmers.json';
import deliveriesData from './deliveries.json';
import notificationsData from './notifications.json';
import routesData from './routes.json';
import type {
  ActivityItem,
  DashboardStats,
  Delivery,
  Farmer,
  AppNotification,
  MatchResult,
  RouteInfo,
  Vehicle,
} from '../types';

export const vehicles = vehiclesData as Vehicle[];
export const farmers = farmersData as Farmer[];
export const deliveries = deliveriesData as Delivery[];
export const notifications = notificationsData as AppNotification[];
export const routes = routesData as RouteInfo[];

export const dashboardStats: DashboardStats = {
  activeVehicles: 12,
  pendingDeliveries: 5,
  completedDeliveries: 24,
  transportRequests: 8,
};

export const recentActivity: ActivityItem[] = [
  {
    id: 'a1',
    title: 'Tomato delivery assigned',
    subtitle: 'Tractor A · Rampur → City Mandi',
    time: '10 min ago',
    icon: 'leaf',
  },
  {
    id: 'a2',
    title: 'Wheat transport requested',
    subtitle: '80 Quintal · Bijapur',
    time: '1 hr ago',
    icon: 'cube',
  },
  {
    id: 'a3',
    title: 'Potato delivery completed',
    subtitle: 'Mini Truck D · Regional Mandi',
    time: 'Yesterday',
    icon: 'checkmark-circle',
  },
];

export const todaySummary = {
  scheduled: 6,
  inTransit: 3,
  completed: 4,
  onTimeRate: '92%',
};

export const matchInput = {
  cropQuantity: '50 Quintal',
  pickupLocation: 'Rampur Village',
  destinationMandi: 'City Mandi',
  urgency: 'High — Perishable',
  cropType: 'Tomato',
};

export const bestMatch: MatchResult = {
  vehicleName: 'Tractor A',
  distance: '2 km',
  capacity: '60 Quintal',
  eta: '25 mins',
  score: 96,
  priority: 'high',
  cropType: 'Tomato',
};

export const matchingSteps = [
  'Analyzing Capacity',
  'Checking Distance',
  'Evaluating Priority',
  'Generating Match',
];

export const monitoringStats = {
  deliveriesToday: 24,
  onTimeRate: 92,
  costSaved: 3240,
  vehicleUtilization: [40, 55, 48, 72, 65, 80, 68],
  deliveryStatus: { completed: 18, inTransit: 4, pending: 2 },
};
