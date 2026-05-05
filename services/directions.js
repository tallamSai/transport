import { getGoogleMapsKey } from './config';
import { decodePolyline } from '../utils/polyline';
import { distanceKm } from '../utils/haversine';

/**
 * @param {{ lat: number, lng: number }} origin
 * @param {{ lat: number, lng: number }} dest
 * @returns {Promise<{ polyline: { latitude: number, longitude: number }[], distanceKm: number, durationMin: number } | null}>}
 */
export async function fetchRoute(origin, dest) {
  const key = getGoogleMapsKey();
  if (!key) {
    return straightLineFallback(origin, dest);
  }
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${dest.lat},${dest.lng}&mode=driving&key=${key}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status !== 'OK' || !data.routes?.[0]) {
      return straightLineFallback(origin, dest);
    }
    const leg = data.routes[0].legs[0];
    const enc = data.routes[0].overview_polyline?.points;
    const coords = enc ? decodePolyline(enc) : straightLineCoords(origin, dest);
    return {
      polyline: coords,
      distanceKm: (leg.distance?.value || 0) / 1000,
      durationMin: Math.round((leg.duration?.value || 0) / 60),
    };
  } catch {
    return straightLineFallback(origin, dest);
  }
}

/**
 * @param {{ lat: number, lng: number }} a
 * @param {{ lat: number, lng: number }} b
 */
function straightLineCoords(a, b) {
  return [
    { latitude: a.lat, longitude: a.lng },
    { latitude: b.lat, longitude: b.lng },
  ];
}

/**
 * @param {{ lat: number, lng: number }} origin
 * @param {{ lat: number, lng: number }} dest
 */
function straightLineFallback(origin, dest) {
  const d = distanceKm(origin.lat, origin.lng, dest.lat, dest.lng);
  return {
    polyline: straightLineCoords(origin, dest),
    distanceKm: d,
    durationMin: Math.max(5, Math.round((d / 30) * 60)),
  };
}
