import { distanceKm } from '../utils/haversine';

/**
 * Urgency multipliers for time sensitivity (higher = stricter on distance)
 * @param {import('../types/entities').Urgency} urgency
 */
function urgencyWeight(urgency) {
  if (urgency === 'perishable') return 1.35;
  if (urgency === 'urgent') return 1.2;
  return 1;
}

/**
 * @param {import('../types/entities').TransportRequest} request
 * @param {import('../types/entities').Vehicle} vehicle
 * @param {number} distanceKmVal
 * @returns {number}
 */
export function scoreVehicle(request, vehicle, distanceKmVal) {
  if (!vehicle.availability) return -Infinity;
  if (vehicle.capacityKg < request.quantity) return -Infinity;

  const w1 = 100;
  const w2 = 15;
  const u = urgencyWeight(request.urgency);

  const distScore = w1 * (1 / (1 + distanceKmVal * u));
  const spare = vehicle.capacityKg - request.quantity;
  const loadScore = w2 * (1 / (1 + Math.max(0, spare) / 500));

  return distScore + loadScore;
}

/**
 * @param {import('../types/entities').TransportRequest} request
 * @param {import('../types/entities').Vehicle[]} vehicles
 * @param {function(import('../types/entities').Vehicle): { lat: number, lng: number }} getVehiclePoint
 * @returns {{ best: import('../types/entities').Vehicle | null, bestScore: number, distanceKm: number }}
 */
export function findBestVehicle(request, vehicles, getVehiclePoint) {
  const pickupRaw = request.pickup?.coords;
  const plat = pickupRaw != null ? Number(pickupRaw.lat) : NaN;
  const plng = pickupRaw != null ? Number(pickupRaw.lng) : NaN;
  if (!Number.isFinite(plat) || !Number.isFinite(plng)) {
    return { best: null, bestScore: -Infinity, distanceKm: 0 };
  }

  let best = null;
  let bestScore = -Infinity;
  let bestDist = Infinity;

  for (const v of vehicles) {
    const p = getVehiclePoint(v);
    if (!p || !Number.isFinite(p.lat) || !Number.isFinite(p.lng)) continue;
    const d = distanceKm(plat, plng, p.lat, p.lng);
    const s = scoreVehicle(request, v, d);
    if (s > bestScore) {
      bestScore = s;
      best = v;
      bestDist = d;
    } else if (s === bestScore && s > -Infinity && best) {
      const p2 = getVehiclePoint(v);
      if (!p2) continue;
      const d2 = distanceKm(plat, plng, p2.lat, p2.lng);
      if (d2 < bestDist) {
        best = v;
        bestDist = d2;
      }
    }
  }

  if (!best) return { best: null, bestScore: -Infinity, distanceKm: 0 };
  const finalP = getVehiclePoint(best);
  if (!finalP) return { best: null, bestScore: -Infinity, distanceKm: 0 };
  return {
    best,
    bestScore,
    distanceKm: distanceKm(plat, plng, finalP.lat, finalP.lng),
  };
}

/**
 * Simple cost model: base + per km, scaled by urgency
 * @param {number} distanceKmVal
 * @param {import('../types/entities').Urgency} urgency
 */
export function estimateCost(distanceKmVal, urgency) {
  const base = 120;
  const perKm = 18;
  let mult = 1;
  if (urgency === 'urgent') mult = 1.15;
  if (urgency === 'perishable') mult = 1.3;
  return Math.round((base + perKm * distanceKmVal) * mult);
}

/**
 * Rough ETA from distance (assumes ~35 km/h effective farm roads)
 * @param {number} distanceKmVal
 * @param {import('../types/entities').Urgency} urgency
 */
export function estimateEtaMinutes(distanceKmVal, urgency) {
  const speedKmh = urgency === 'perishable' ? 40 : 35;
  return Math.max(5, Math.round((distanceKmVal / speedKmh) * 60));
}
