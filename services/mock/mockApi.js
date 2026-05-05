import { useAgriStore } from '../../store/useAgriStore';
import { findBestVehicle, estimateCost, estimateEtaMinutes } from '../matching';
import { fetchRoute } from '../directions';
import { getVehiclePointFromVehicle } from '../../utils/firestoreNormalize';
import { seedVehicles } from './seed';
import { startTripSimulation } from './simulation';

/**
 * @param {import('../../types/entities').AppUser} user
 * @param {object | null} vehiclePatch
 */
export function initMockSession(user, vehiclePatch) {
  let vehicles = seedVehicles();
  if (user.role === 'driver') {
    const mine = vehicles.find((v) => String(v.driverId) === String(user.id));
    if (mine && vehiclePatch) {
      vehicles = vehicles.map((v) =>
        v.id === mine.id
          ? {
              ...v,
              ...vehiclePatch,
              driverId: user.id,
            }
          : v,
      );
    } else if (mine) {
      vehicles = vehicles.map((v) =>
        v.id === mine.id ? { ...v, driverId: user.id } : v,
      );
    } else {
      vehicles.push({
        id: `veh_${user.id}`,
        driverId: user.id,
        type: vehiclePatch?.type || 'truck',
        capacityKg: vehiclePatch?.capacityKg || 2000,
        availability: vehiclePatch?.availability !== false,
        currentLocation: { lat: 28.62, lng: 77.25 },
        updatedAt: Date.now(),
      });
    }
  }
  useAgriStore.setState({
    vehicles,
    requests: [],
    driverVehicle: user.role === 'driver'
      ? vehicles.find((v) => String(v.driverId) === String(user.id)) || null
      : null,
  });
}

/**
 * @param {object} payload
 */
export async function createTransportRequestMock(payload) {
  const id = payload.id || `req_${Date.now()}`;
  const createdAt = Date.now();
  const { user, vehicles, upsertRequest } = useAgriStore.getState();
  if (!user || user.role !== 'farmer') throw new Error('Farmer only');

  let req = {
    ...payload,
    id,
    farmerId: user.id,
    farmerName: user.name || '',
    farmerPhone: user.phone || '',
    status: 'pending',
    createdAt,
  };

  upsertRequest(req);

  const { best, distanceKm: d } = findBestVehicle(req, vehicles, getVehiclePointFromVehicle);

  if (!best) {
    req = { ...req, status: 'cancelled' };
    upsertRequest(req);
    return req;
  }

  const cost = estimateCost(d, req.urgency);
  const eta = estimateEtaMinutes(d, req.urgency);
  let routePolyline = '';
  try {
    const route = await fetchRoute(req.pickup.coords, req.destination.coords);
    if (route?.polyline?.length) {
      routePolyline = JSON.stringify(route.polyline);
    }
  } catch {
    /* ignore */
  }

  req = {
    ...req,
    status: 'matched',
    assignedVehicleId: best.id,
    assignedDriverId: String(best.driverId),
    assignedDriverName: 'Demo driver',
    assignedDriverPhone: '',
    estimatedCost: cost,
    etaMinutes: eta,
    routePolyline,
  };
  upsertRequest(req);
  useAgriStore.getState().pushToast('AgriMove', 'Vehicle assigned — waiting for driver');
  return req;
}

/**
 * @param {string} requestId
 * @param {'accepted' | 'rejected'} decision
 */
export function respondToRequestMock(requestId, decision) {
  const { requests, user, upsertRequest } = useAgriStore.getState();
  const req = requests.find((r) => r.id === requestId);
  if (!req || String(req.assignedDriverId) !== String(user?.id)) return;
  if (decision === 'rejected') {
    upsertRequest({ ...req, status: 'cancelled' });
    return;
  }
  upsertRequest({ ...req, status: 'accepted' });
  const next =
    useAgriStore.getState().requests.find((r) => r.id === requestId) ||
    { ...req, status: 'accepted' };
  startTripSimulation(next);
}

/**
 * @param {boolean} online
 */
export function setDriverOnlineMock(online) {
  const { user, vehicles, driverVehicle } = useAgriStore.getState();
  if (!user || user.role !== 'driver' || !driverVehicle) return;
  const next = vehicles.map((v) =>
    v.id === driverVehicle.id ? { ...v, availability: online, updatedAt: Date.now() } : v,
  );
  const nv = next.find((v) => v.id === driverVehicle.id) || null;
  useAgriStore.setState({ vehicles: next, driverVehicle: nv });
}

/**
 * @param {Partial<import('../../types/entities').Vehicle>} patch
 */
export function updateVehicleProfileMock(patch) {
  const { user, vehicles } = useAgriStore.getState();
  if (!user || user.role !== 'driver') return;
  const vid = vehicles.find((v) => String(v.driverId) === String(user.id))?.id;
  if (!vid) return;
  const next = vehicles.map((v) => (v.id === vid ? { ...v, ...patch } : v));
  const nv = next.find((v) => v.id === vid) || null;
  useAgriStore.setState({ vehicles: next, driverVehicle: nv });
}

/**
 * @param {{ latitude: number, longitude: number }} coords
 */
export function updateVehicleLocationMock(coords) {
  const { user, vehicles, driverVehicle } = useAgriStore.getState();
  if (!user || user.role !== 'driver' || !driverVehicle) return;
  const next = vehicles.map((v) =>
    v.id === driverVehicle.id
      ? {
          ...v,
          currentLocation: { lat: coords.latitude, lng: coords.longitude },
          updatedAt: Date.now(),
        }
      : v,
  );
  const nv = next.find((v) => v.id === driverVehicle.id) || null;
  useAgriStore.setState({ vehicles: next, driverVehicle: nv });
}
