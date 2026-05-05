import { create } from 'zustand';

/**
 * @typedef {import('../types/entities').AppUser} AppUser
 * @typedef {import('../types/entities').Vehicle} Vehicle
 * @typedef {import('../types/entities').TransportRequest} TransportRequest
 */

export const useAgriStore = create((set, get) => ({
  hydrated: false,
  /** @type {boolean} */
  useMock: true,
  /** @type {AppUser | null} */
  user: null,
  /** @type {Vehicle | null} */
  driverVehicle: null,
  /** @type {Vehicle[]} */
  vehicles: [],
  /** @type {TransportRequest[]} */
  requests: [],
  /** @type {string | null} */
  activeTrackingRequestId: null,
  /** @type {{ title: string, body: string }[]} */
  toastQueue: [],

  setHydrated: (v) => set({ hydrated: !!v }),
  setUseMock: (v) => set({ useMock: !!v }),
  setUser: (user) => set({ user }),
  setDriverVehicle: (driverVehicle) => set({ driverVehicle }),
  setVehicles: (vehicles) => set({ vehicles }),
  setRequests: (requests) => set({ requests }),
  upsertRequest: (req) =>
    set((s) => {
      const i = s.requests.findIndex((r) => r.id === req.id);
      if (i < 0) return { requests: [...s.requests, req] };
      const next = [...s.requests];
      next[i] = { ...next[i], ...req };
      return { requests: next };
    }),
  setActiveTrackingRequestId: (id) => set({ activeTrackingRequestId: id }),
  pushToast: (title, body) =>
    set((s) => ({
      toastQueue: [...s.toastQueue, { title, body }],
    })),
  shiftToast: () =>
    set((s) => ({
      toastQueue: s.toastQueue.slice(1),
    })),
}));
