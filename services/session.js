import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { isMockMode, getFirebaseOptions } from './config';
import { getFirebaseAuth } from './firebase';
import { useAgriStore } from '../store/useAgriStore';
import { initMockSession } from './mock/mockApi';
import { upsertUserDoc, fetchUserProfileFs, fetchUserVehicleFs } from './firestoreApi';

const KEY_MOCK = 'agrimove_use_mock';
const KEY_PROFILE = 'agrimove_profile';

/**
 * @param {import('firebase/auth').User} fbUser
 */
export async function applyFirebaseUserToStore(fbUser) {
  if (!fbUser) return;

  const displayName =
    fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'User');

  try {
    let profile = await fetchUserProfileFs(fbUser.uid);

    if (!profile) {
      profile = {
        id: fbUser.uid,
        name: displayName,
        phone: fbUser.phoneNumber || '',
        role: null,
        onboardingComplete: false,
      };
      try {
        await upsertUserDoc(fbUser.uid, profile);
      } catch (e) {
        console.warn('[AgriMove] upsertUserDoc', e);
      }
    }

    const r = profile.role;
    const oc = profile.onboardingComplete;
    const hasRole = r === 'farmer' || r === 'driver';
    /** New accounts use onboardingComplete:false until ProfileSetup; legacy docs omit this field. */
    const mustFinishSignup = oc === false || (!hasRole && oc !== true);

    const roleForStore = mustFinishSignup ? null : r === 'driver' ? 'driver' : 'farmer';

    useAgriStore.getState().setUser({
      id: profile.id || fbUser.uid,
      name: profile.name || displayName,
      phone: profile.phone || '',
      role: roleForStore,
    });

    if (roleForStore === 'driver') {
      try {
        const v = await fetchUserVehicleFs(fbUser.uid);
        useAgriStore.getState().setDriverVehicle(v);
      } catch {
        useAgriStore.getState().setDriverVehicle(null);
      }
    } else {
      useAgriStore.getState().setDriverVehicle(null);
    }
  } catch (e) {
    console.warn('[AgriMove] applyFirebaseUserToStore', e);
    useAgriStore.getState().setUser({
      id: fbUser.uid,
      name: displayName,
      phone: '',
      role: null,
    });
    useAgriStore.getState().setDriverVehicle(null);
  }

  useAgriStore.getState().setHydrated(true);
}

/**
 * @param {import('../types/entities').AppUser} user
 * @param {object | null} [vehicle]
 */
export async function persistLocalProfile(user, vehicle) {
  await AsyncStorage.setItem(KEY_PROFILE, JSON.stringify({ user, vehicle: vehicle || null }));
}

/**
 * @returns {Promise<{ user: import('../types/entities').AppUser, vehicle: object | null } | null>}
 */
export async function loadLocalProfile() {
  const raw = await AsyncStorage.getItem(KEY_PROFILE);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function clearLocalProfile() {
  await AsyncStorage.removeItem(KEY_PROFILE);
}

/**
 * @param {boolean} mock
 */
export async function persistMockFlag(mock) {
  await AsyncStorage.setItem(KEY_MOCK, mock ? '1' : '0');
}

export async function loadMockFlag() {
  const v = await AsyncStorage.getItem(KEY_MOCK);
  return v === '1';
}

/**
 * Restore auth + profile on app launch
 */
export async function hydrateSession() {
  try {
    const mockFromConfig = isMockMode();

    if (!mockFromConfig) {
      await persistMockFlag(false);
      useAgriStore.getState().setUseMock(false);

      const auth = getFirebaseAuth();
      const opts = getFirebaseOptions();
      if (!auth || !opts) {
        useAgriStore.getState().setHydrated(true);
        return;
      }

      onAuthStateChanged(auth, async (fbUser) => {
        if (!fbUser) {
          useAgriStore.setState({ user: null, driverVehicle: null });
          useAgriStore.getState().setHydrated(true);
          return;
        }
        await applyFirebaseUserToStore(fbUser);
      });
      return;
    }

    useAgriStore.getState().setUseMock(true);
    const local = await loadLocalProfile();
    if (local?.user) {
      useAgriStore.getState().setUser(local.user);
      if (local.vehicle) useAgriStore.getState().setDriverVehicle(local.vehicle);
      initMockSession(local.user, local.vehicle || null);
    }
    useAgriStore.getState().setHydrated(true);
  } catch (e) {
    console.warn('hydrateSession', e);
    useAgriStore.getState().setHydrated(true);
  }
}

/**
 * @param {string} email
 * @param {string} password
 */
export async function signUpEmail(email, password) {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase not configured');
  await createUserWithEmailAndPassword(auth, email, password);
  await applyFirebaseUserToStore(auth.currentUser);
}

/**
 * @param {string} email
 * @param {string} password
 */
export async function signInEmail(email, password) {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase not configured');
  await signInWithEmailAndPassword(auth, email, password);
  await applyFirebaseUserToStore(auth.currentUser);
}

export async function signOutAll() {
  await clearLocalProfile();
  await persistMockFlag(false);
  useAgriStore.setState({
    user: null,
    driverVehicle: null,
    vehicles: [],
    requests: [],
  });
  const auth = getFirebaseAuth();
  if (auth) await signOut(auth);
}

/**
 * Start offline demo — mock role setup happens on Role screen
 */
export async function enterDemoMode() {
  await persistMockFlag(true);
  useAgriStore.getState().setUseMock(true);
}
