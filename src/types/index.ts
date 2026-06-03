export type VehicleType = 'Tractor' | 'Truck' | 'Mini Truck';
export type VehicleStatus = 'available' | 'busy' | 'offline';
export type Priority = 'high' | 'medium' | 'low';
export type DeliveryStatus =
  | 'request_created'
  | 'vehicle_assigned'
  | 'pickup_completed'
  | 'on_route'
  | 'delivered';

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  number: string;
  capacity: string;
  location: string;
  distance: string;
  status: VehicleStatus;
  driverName: string;
  image: string;
}

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  village: string;
  cropType: string;
  cropQuantity: string;
  pickupLocation: string;
}

export interface Delivery {
  id: string;
  cropType: string;
  quantity: string;
  pickup: string;
  destination: string;
  status: DeliveryStatus;
  driverName: string;
  vehicleName: string;
  vehicleType: VehicleType;
  eta: string;
  phone: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'assigned' | 'arrived' | 'started' | 'completed' | 'info';
}

export interface RouteInfo {
  id: string;
  name: string;
  farmerLocation: string;
  destinationMandi: string;
  distance: string;
  estimatedTime: string;
  fuelCost: string;
  transportCost: string;
  isBest: boolean;
  pickupTime: string;
  deliveryTime: string;
  arrivalTime: string;
}

export interface DashboardStats {
  activeVehicles: number;
  pendingDeliveries: number;
  completedDeliveries: number;
  transportRequests: number;
}

export interface MatchResult {
  vehicleName: string;
  distance: string;
  capacity: string;
  eta: string;
  score: number;
  priority: Priority;
  cropType: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  icon: string;
}
