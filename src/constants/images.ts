/** Curated Unsplash URLs — agriculture / India logistics theme */
export const images = {
  farmerHero:
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
  farmerProfile:
    'https://images.unsplash.com/photo-1592982536030-79336f8a0d30?auto=format&fit=crop&w=400&q=80',
  farmField:
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80',
  greenField:
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1400&q=80',
  tractor:
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80',
  truck:
    'https://images.unsplash.com/photo-1601584115207-6cda9de7c314?auto=format&fit=crop&w=800&q=80',
  miniTruck:
    'https://images.unsplash.com/photo-1519003723664-08ae2b8a6962?auto=format&fit=crop&w=800&q=80',
  cropsTransport:
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80',
  mandi:
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
  driver:
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
  villageRoad:
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80',
  smartFarm:
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5bea8?auto=format&fit=crop&w=1200&q=80',
  harvest:
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80',
  profileCover:
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80',
  aiBackground:
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5bea8?auto=format&fit=crop&w=1200&q=80',
};

export function vehicleImage(type: string): string {
  if (type === 'Truck') return images.truck;
  if (type === 'Mini Truck') return images.miniTruck;
  return images.tractor;
}

/** Default map region — Delhi NCR farmland belt (demo) */
export const MAP_REGION = {
  latitude: 28.62,
  longitude: 77.25,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export const ROUTE_COORDS = [
  { latitude: 28.58, longitude: 77.18 },
  { latitude: 28.6, longitude: 77.21 },
  { latitude: 28.63, longitude: 77.24 },
  { latitude: 28.66, longitude: 77.28 },
  { latitude: 28.7, longitude: 77.32 },
];

export const VEHICLE_MARKERS = [
  { id: 'v1', title: 'Tractor A', latitude: 28.61, longitude: 77.22, type: 'Tractor' },
  { id: 'v2', title: 'Truck B', latitude: 28.64, longitude: 77.27, type: 'Truck' },
  { id: 'v3', title: 'Tractor C', latitude: 28.59, longitude: 77.26, type: 'Tractor' },
  { id: 'farm', title: 'Your Farm', latitude: 28.62, longitude: 77.25, type: 'Farm' },
];
