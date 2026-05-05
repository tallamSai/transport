import { useAgriStore } from '../../store/useAgriStore';
import { distanceKm } from '../../utils/haversine';

let timer = null;

function upsertRequest(req) {
  useAgriStore.getState().upsertRequest(req);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Nudge vehicle along segment toward target; mutates store vehicles
 * @param {string} vehicleId
 * @param {{ lat: number, lng: number }} target
 */
function stepVehicleToward(vehicleId, target) {
  const v = useAgriStore.getState().vehicles.find((x) => x.id === vehicleId);
  if (!v) return;
  const speed = 0.00025;
  const lat = v.currentLocation.lat;
  const lng = v.currentLocation.lng;
  const d = distanceKm(lat, lng, target.lat, target.lng);
  if (d < 0.05) {
    useAgriStore.setState((s) => ({
      vehicles: s.vehicles.map((x) =>
        x.id === vehicleId
          ? { ...x, currentLocation: { ...target }, updatedAt: Date.now() }
          : x,
      ),
    }));
    return;
  }
  const t = Math.min(1, speed / Math.max(d, 0.001));
  const nlat = lerp(lat, target.lat, t);
  const nlng = lerp(lng, target.lng, t);
  useAgriStore.setState((s) => ({
    vehicles: s.vehicles.map((x) =>
      x.id === vehicleId
        ? { ...x, currentLocation: { lat: nlat, lng: nlng }, updatedAt: Date.now() }
        : x,
    ),
  }));
}

/**
 * @param {import('../../types/entities').TransportRequest} request
 */
export function startTripSimulation(request) {
  stopSimulation();
  if (!request.assignedVehicleId) return;
  const vehicleId = request.assignedVehicleId;
  const pickup = request.pickup.coords;
  const dest = request.destination.coords;

  let phase = 'to_pickup';

  timer = setInterval(() => {
    const st = useAgriStore.getState();
    const req = st.requests.find((r) => r.id === request.id);
    if (!req || req.status === 'completed' || req.status === 'cancelled') {
      stopSimulation();
      return;
    }
    const target = phase === 'to_pickup' ? pickup : dest;
    stepVehicleToward(vehicleId, target);
    const v = useAgriStore.getState().vehicles.find((x) => x.id === vehicleId);
    if (!v) return;
    const d = distanceKm(v.currentLocation.lat, v.currentLocation.lng, target.lat, target.lng);
    if (d < 0.06 && phase === 'to_pickup') {
      phase = 'to_dest';
      upsertRequest({
        ...req,
        status: 'en_route',
      });
      useAgriStore.getState().pushToast('AgriMove', 'Loaded — heading to mandi');
    } else if (d < 0.06 && phase === 'to_dest') {
      upsertRequest({
        ...req,
        status: 'completed',
      });
      useAgriStore.getState().pushToast('AgriMove', 'Delivery completed');
      stopSimulation();
    }
  }, 1200);
}

export function stopSimulation() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
