import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { getDb } from './firebase';

/** Editable via Firebase Console → Firestore → collection `mandis` (docs: label, lat, lng). */
export const DEFAULT_MANDIS = [
  { id: 'azadpur', label: 'Azadpur Mandi', lat: 28.7184, lng: 77.1829 },
  { id: 'ghazipur', label: 'Ghazipur Mandi', lat: 28.6547, lng: 77.3145 },
  { id: 'okhla', label: 'Okhla Mandi', lat: 28.5456, lng: 77.2737 },
];

function mapDefaults() {
  return DEFAULT_MANDIS.map((m) => ({
    id: m.id,
    label: m.label,
    coords: { lat: m.lat, lng: m.lng },
  }));
}

/** Sync fallback if UI ever receives an empty list (offline edge cases). */
export function getBundledMandis() {
  return mapDefaults();
}

/**
 * @returns {Promise<{ id: string, label: string, coords: { lat: number, lng: number } }[]>}
 */
function docToMandi(d) {
  const x = d.data();
  const lat = typeof x.lat === 'number' ? x.lat : Number(x.lat);
  const lng = typeof x.lng === 'number' ? x.lng : Number(x.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return {
    id: d.id,
    label: String(x.label || d.id),
    coords: { lat, lng },
  };
}

export async function fetchMandisFromFirestore() {
  const db = getDb();
  if (!db) return mapDefaults();

  try {
    const snap = await getDocs(collection(db, 'mandis'));
    const list = [];
    snap.forEach((d) => {
      const m = docToMandi(d);
      if (m) list.push(m);
    });
    list.sort((a, b) => a.label.localeCompare(b.label));
    if (list.length === 0) return mapDefaults();
    return list;
  } catch (e) {
    console.warn('[mandis] Firestore read failed, using bundled defaults', e);
    return mapDefaults();
  }
}

/**
 * Live updates when `mandis` documents change in Firebase Console or admin tools.
 * @param {function({ id: string, label: string, coords: { lat: number, lng: number } }[]): void} callback
 * @returns {() => void}
 */
export function subscribeMandis(callback) {
  const db = getDb();
  if (!db) {
    callback(getBundledMandis());
    return () => {};
  }

  return onSnapshot(
    collection(db, 'mandis'),
    (snap) => {
      const list = [];
      snap.forEach((d) => {
        const m = docToMandi(d);
        if (m) list.push(m);
      });
      list.sort((a, b) => a.label.localeCompare(b.label));
      callback(list.length > 0 ? list : getBundledMandis());
    },
    (err) => {
      console.warn('[mandis] subscription error, using bundled defaults', err);
      callback(getBundledMandis());
    },
  );
}
