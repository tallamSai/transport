import { isMockMode } from './config';
import * as mock from './mock/mockApi';
import * as fs from './firestoreApi';
import { subscribeMandis as subscribeMandisService, getBundledMandis } from './mandisService';
import { useAgriStore } from '../store/useAgriStore';

/**
 * @param {object} payload — cropType, quantity, pickup, destination, urgency
 */
export async function createTransportRequest(payload) {
  if (isMockMode()) return mock.createTransportRequestMock(payload);
  const user = useAgriStore.getState().user;
  if (!user) throw new Error('Not signed in');
  return fs.createTransportRequestFs(payload, user.id);
}

/**
 * @param {string} requestId
 * @param {'accepted' | 'rejected'} decision
 */
export async function respondToRequest(requestId, decision) {
  if (isMockMode()) {
    mock.respondToRequestMock(requestId, decision);
    return;
  }
  await fs.respondToRequestFs(requestId, decision);
}

/**
 * @param {boolean} online
 */
export async function setDriverOnline(online) {
  if (isMockMode()) {
    mock.setDriverOnlineMock(online);
    return;
  }
  const user = useAgriStore.getState().user;
  if (!user) return;
  await fs.setVehicleAvailabilityFs(user.id, online);
}

/**
 * @param {{ latitude: number, longitude: number }} coords
 */
export async function updateDriverLiveLocation(coords) {
  if (isMockMode()) {
    mock.updateVehicleLocationMock(coords);
    return;
  }
  const user = useAgriStore.getState().user;
  if (!user) return;
  await fs.updateVehicleLocationFs(user.id, coords);
}

/**
 * @param {object} patch
 */
export async function updateVehicleProfile(patch) {
  if (isMockMode()) {
    mock.updateVehicleProfileMock(patch);
    return;
  }
  const user = useAgriStore.getState().user;
  const existing = useAgriStore.getState().driverVehicle;
  if (!user) return;
  await fs.saveVehicleDoc(user.id, {
    ...existing,
    ...patch,
    id: existing?.id || user.id,
  });
}

/**
 * @param {function(import('../types/entities').Vehicle[]): void} cb
 * @returns {() => void}
 */
export function subscribeVehicles(cb) {
  if (isMockMode()) {
    const unsub = useAgriStore.subscribe((state) => cb(state.vehicles));
    cb(useAgriStore.getState().vehicles);
    return unsub;
  }
  return fs.subscribeVehiclesFs(cb);
}

/**
 * @param {string} farmerId
 * @param {function(import('../types/entities').TransportRequest[]): void} cb
 * @returns {() => void}
 */
export function subscribeFarmerRequests(farmerId, cb) {
  if (isMockMode()) {
    const fid = String(farmerId);
    const unsub = useAgriStore.subscribe((state) =>
      cb(state.requests.filter((r) => String(r.farmerId) === fid)),
    );
    cb(useAgriStore.getState().requests.filter((r) => String(r.farmerId) === fid));
    return unsub;
  }
  return fs.subscribeFarmerRequestsFs(farmerId, cb);
}

/**
 * @param {string} driverId
 * @param {function(import('../types/entities').TransportRequest[]): void} cb
 * @returns {() => void}
 */
export function subscribeDriverRequests(driverId, cb) {
  if (isMockMode()) {
    const did = String(driverId);
    const unsub = useAgriStore.subscribe((state) =>
      cb(state.requests.filter((r) => String(r.assignedDriverId) === did)),
    );
    cb(useAgriStore.getState().requests.filter((r) => String(r.assignedDriverId) === did));
    return unsub;
  }
  return fs.subscribeDriverRequestsFs(driverId, cb);
}

/**
 * Live mandi list from Firestore (falls back to bundled defaults).
 * @param {function(Array<{ id: string, label: string, coords: { lat: number, lng: number } }>): void} cb
 */
export function subscribeMandis(cb) {
  if (isMockMode()) {
    cb(getBundledMandis());
    return () => {};
  }
  return subscribeMandisService(cb);
}

/** Refresh driver vehicle from Firestore after edits (keeps store in sync with matching). */
export async function refreshDriverVehicleFromServer() {
  if (isMockMode()) return;
  const user = useAgriStore.getState().user;
  if (!user?.id || user.role !== 'driver') return;
  const v = await fs.fetchUserVehicleFs(user.id);
  useAgriStore.getState().setDriverVehicle(v);
}
