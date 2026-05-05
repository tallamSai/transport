import {
  collection,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  getDocs,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { getDb } from './firebase';
import { findBestVehicle, estimateCost, estimateEtaMinutes } from './matching';
import { fetchRoute } from './directions';
import {
  normalizeVehicle,
  normalizeRequestPlace,
  normalizeTransportRequest,
  getVehiclePointFromVehicle,
} from '../utils/firestoreNormalize';

/**
 * @param {string} uid
 * @param {object} data
 */
export async function upsertUserDoc(uid, data) {
  const db = getDb();
  if (!db) throw new Error('Firestore unavailable');
  const ref = doc(db, 'users', uid);
  await setDoc(
    ref,
    { id: uid, ...data, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

/**
 * @param {string} uid
 * @param {object} vehicle
 */
export async function saveVehicleDoc(uid, vehicle) {
  const db = getDb();
  if (!db) throw new Error('Firestore unavailable');
  const ref = doc(db, 'vehicles', vehicle.id || uid);
  await setDoc(
    ref,
    {
      ...vehicle,
      driverId: String(uid),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

/**
 * @param {object} reqPayload
 * @param {string} farmerId
 */
export async function createTransportRequestFs(reqPayload, farmerId) {
  const db = getDb();
  if (!db) throw new Error('Firestore unavailable');
  const fid = String(farmerId);
  let farmerName = '';
  let farmerPhone = '';
  try {
    const fu = await getDoc(doc(db, 'users', fid));
    if (fu.exists()) {
      const fd = fu.data();
      farmerName = String(fd.name || '').trim();
      farmerPhone = String(fd.phone || '').trim();
    }
  } catch {
    /* ignore */
  }

  const vehiclesSnap = await getDocs(collection(db, 'vehicles'));
  /** @type {import('../types/entities').Vehicle[]} */
  const vehicles = [];
  vehiclesSnap.forEach((d) => vehicles.push(normalizeVehicle({ id: d.id, ...d.data() })));

  const payload = {
    ...reqPayload,
    pickup: normalizeRequestPlace(reqPayload.pickup),
    destination: normalizeRequestPlace(reqPayload.destination),
  };

  const newRef = doc(collection(db, 'requests'));
  const createdAtMs = Date.now();

  const req = {
    id: newRef.id,
    ...payload,
    farmerId: fid,
    farmerName,
    farmerPhone,
    status: 'pending',
    createdAt: createdAtMs,
  };

  const { best, distanceKm: d } = findBestVehicle(req, vehicles, getVehiclePointFromVehicle);

  if (!best) {
    await setDoc(newRef, {
      ...payload,
      farmerId: fid,
      farmerName,
      farmerPhone,
      status: 'cancelled',
      createdAt: serverTimestamp(),
    });
    return { ...req, status: 'cancelled' };
  }

  const assignedDriverId = String(best.driverId);
  let assignedDriverName = '';
  let assignedDriverPhone = '';
  try {
    const driverProf = await getDoc(doc(db, 'users', assignedDriverId));
    if (driverProf.exists()) {
      const data = driverProf.data();
      assignedDriverName = String(data.name || '').trim();
      assignedDriverPhone = String(data.phone || '').trim();
    }
  } catch {
    /* ignore */
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

  await setDoc(newRef, {
    ...payload,
    farmerId: fid,
    farmerName,
    farmerPhone,
    status: 'matched',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    assignedVehicleId: best.id,
    assignedDriverId,
    assignedDriverName,
    assignedDriverPhone,
    estimatedCost: cost,
    etaMinutes: eta,
    routePolyline,
  });

  return {
    ...req,
    status: 'matched',
    assignedVehicleId: best.id,
    assignedDriverId,
    assignedDriverName,
    assignedDriverPhone,
    estimatedCost: cost,
    etaMinutes: eta,
    routePolyline,
  };
}

/**
 * @param {function(import('../types/entities').Vehicle[]): void} cb
 */
function snapshotErr(label) {
  return (err) => console.warn(`[Firestore ${label}]`, err?.code || '', err?.message || err);
}

export function subscribeVehiclesFs(cb) {
  const db = getDb();
  if (!db) return () => {};
  return onSnapshot(
    collection(db, 'vehicles'),
    (snap) => {
      /** @type {import('../types/entities').Vehicle[]} */
      const list = [];
      snap.forEach((d) => list.push(normalizeVehicle({ id: d.id, ...d.data() })));
      cb(list);
    },
    snapshotErr('vehicles'),
  );
}

/**
 * @param {string} farmerId
 * @param {function(import('../types/entities').TransportRequest[]): void} cb
 */
export function subscribeFarmerRequestsFs(farmerId, cb) {
  const db = getDb();
  if (!db) return () => {};
  const q = query(collection(db, 'requests'), where('farmerId', '==', String(farmerId)));
  return onSnapshot(
    q,
    (snap) => {
      /** @type {import('../types/entities').TransportRequest[]} */
      const list = [];
      snap.forEach((d) => list.push(normalizeTransportRequest({ id: d.id, ...d.data() })));
      cb(list);
    },
    snapshotErr('farmerRequests'),
  );
}

/**
 * @param {string} driverId
 * @param {function(import('../types/entities').TransportRequest[]): void} cb
 */
export function subscribeDriverRequestsFs(driverId, cb) {
  const db = getDb();
  if (!db) return () => {};
  const q = query(
    collection(db, 'requests'),
    where('assignedDriverId', '==', String(driverId)),
  );
  return onSnapshot(
    q,
    (snap) => {
      /** @type {import('../types/entities').TransportRequest[]} */
      const list = [];
      snap.forEach((d) => list.push(normalizeTransportRequest({ id: d.id, ...d.data() })));
      cb(list);
    },
    snapshotErr('driverRequests'),
  );
}

/**
 * @param {string} requestId
 * @param {'accepted' | 'rejected'} decision
 */
export async function respondToRequestFs(requestId, decision) {
  const db = getDb();
  if (!db) throw new Error('Firestore unavailable');
  if (decision === 'rejected') {
    await updateDoc(doc(db, 'requests', requestId), { status: 'cancelled' });
    return;
  }
  await updateDoc(doc(db, 'requests', requestId), { status: 'accepted' });
}

/**
 * @param {string} uid
 */
export async function fetchUserVehicleFs(uid) {
  const db = getDb();
  if (!db) return null;
  const q = query(collection(db, 'vehicles'), where('driverId', '==', String(uid)));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return normalizeVehicle({ id: d.id, ...d.data() });
}

/**
 * @param {string} uid
 */
export async function fetchUserProfileFs(uid) {
  const db = getDb();
  if (!db) return null;
  const d = await getDoc(doc(db, 'users', uid));
  if (!d.exists) return null;
  return { id: d.id, ...d.data() };
}

/**
 * @param {string} uid
 * @param {boolean} online
 */
export async function setVehicleAvailabilityFs(uid, online) {
  const db = getDb();
  if (!db) throw new Error('Firestore unavailable');
  const veh = await fetchUserVehicleFs(uid);
  if (!veh?.id) return;
  await updateDoc(doc(db, 'vehicles', veh.id), {
    availability: online,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Push latest GPS to the driver's vehicle so matching and farmer map stay accurate.
 * @param {string} uid
 * @param {{ latitude: number, longitude: number } | { lat: number, lng: number }} loc
 */
export async function updateVehicleLocationFs(uid, loc) {
  const db = getDb();
  if (!db) return;
  const lat = 'latitude' in loc ? loc.latitude : loc.lat;
  const lng = 'longitude' in loc ? loc.longitude : loc.lng;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
  const veh = await fetchUserVehicleFs(uid);
  if (!veh?.id) return;
  await updateDoc(doc(db, 'vehicles', veh.id), {
    currentLocation: { lat, lng },
    updatedAt: serverTimestamp(),
  });
}
