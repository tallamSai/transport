import { GeoPoint } from 'firebase/firestore';

/**
 * Firestore may store locations as { lat, lng }, GeoPoint-like { latitude, longitude }, or GeoPoint.
 * @param {object | undefined | null} raw
 * @returns {{ lat: number, lng: number } | null}
 */
export function normalizeCoords(raw) {
  if (raw == null || typeof raw !== 'object') return null;
  if (raw instanceof GeoPoint) {
    return { lat: raw.latitude, lng: raw.longitude };
  }
  const lat = typeof raw.lat === 'number' ? raw.lat : Number(raw.lat);
  const lng = typeof raw.lng === 'number' ? raw.lng : Number(raw.lng);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return { lat, lng };
  }
  const la = typeof raw.latitude === 'number' ? raw.latitude : Number(raw.latitude);
  const lo = typeof raw.longitude === 'number' ? raw.longitude : Number(raw.longitude);
  if (Number.isFinite(la) && Number.isFinite(lo)) {
    return { lat: la, lng: lo };
  }
  return null;
}

/**
 * @param {import('../types/entities').Vehicle | object | null | undefined} v
 * @returns {{ lat: number, lng: number } | null}
 */
export function getVehiclePointFromVehicle(v) {
  return normalizeCoords(v?.currentLocation);
}

/**
 * @param {object} v vehicle doc data + id
 * @returns {object} vehicle with normalized currentLocation
 */
export function normalizeVehicle(v) {
  if (!v) return v;
  const loc = normalizeCoords(v.currentLocation);
  return {
    ...v,
    currentLocation: loc || v.currentLocation,
    driverId: v.driverId != null ? String(v.driverId) : v.driverId,
    capacityKg: typeof v.capacityKg === 'number' ? v.capacityKg : Number(v.capacityKg) || 0,
    availability: v.availability !== false,
  };
}

/**
 * @param {object} r request fields from Firestore
 */
export function normalizeRequestPlace(place) {
  if (!place?.coords) return place;
  const c = normalizeCoords(place.coords);
  if (!c) return place;
  return { ...place, coords: c };
}

/**
 * @param {object} r — request doc or merged snapshot
 */
export function normalizeTransportRequest(r) {
  if (!r) return r;
  const x = { ...r };
  if (x.farmerId != null) x.farmerId = String(x.farmerId);
  if (x.assignedDriverId != null) x.assignedDriverId = String(x.assignedDriverId);
  if (x.pickup) x.pickup = normalizeRequestPlace(x.pickup);
  if (x.destination) x.destination = normalizeRequestPlace(x.destination);
  const ca = x.createdAt;
  if (ca && typeof ca.toMillis === 'function') {
    x.createdAt = ca.toMillis();
  } else if (ca && typeof ca.seconds === 'number') {
    x.createdAt = ca.seconds * 1000;
  }
  return x;
}
