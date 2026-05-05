/**
 * @returns {import('../../types/entities').Vehicle[]}
 */
export function seedVehicles() {
  const now = Date.now();
  /** All online demo vehicles use driver_demo so one mock transport login receives matches. */
  return [
    {
      id: 'veh_1',
      driverId: 'driver_demo',
      type: 'tractor',
      capacityKg: 1200,
      availability: true,
      currentLocation: { lat: 28.65, lng: 77.22 },
      heading: 90,
      updatedAt: now,
    },
    {
      id: 'veh_2',
      driverId: 'driver_demo',
      type: 'truck',
      capacityKg: 3500,
      availability: true,
      currentLocation: { lat: 28.58, lng: 77.28 },
      heading: 0,
      updatedAt: now,
    },
    {
      id: 'veh_3',
      driverId: 'driver_demo',
      type: 'truck',
      capacityKg: 5000,
      availability: false,
      currentLocation: { lat: 28.7, lng: 77.15 },
      heading: 180,
      updatedAt: now,
    },
  ];
}
