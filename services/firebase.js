import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFirebaseOptions } from './config';

let _app;
let _auth;
let _db;

/**
 * @returns {import('firebase/app').FirebaseApp | null}
 */
export function getFirebaseApp() {
  const opts = getFirebaseOptions();
  if (!opts) return null;
  if (!opts.authDomain || !opts.projectId || !opts.appId) {
    console.warn(
      '[AgriMove] Firebase config may be incomplete. Verify EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN, PROJECT_ID, APP_ID in .env',
    );
  }
  if (_app) return _app;
  if (getApps().length) {
    _app = getApp();
  } else {
    _app = initializeApp(opts);
  }
  return _app;
}

/**
 * @returns {import('firebase/auth').Auth | null}
 */
export function getFirebaseAuth() {
  const app = getFirebaseApp();
  if (!app) return null;
  if (_auth) return _auth;
  _auth = getAuth(app);
  return _auth;
}

/**
 * @returns {import('firebase/firestore').Firestore | null}
 */
export function getDb() {
  const app = getFirebaseApp();
  if (!app) return null;
  if (_db) return _db;
  _db = getFirestore(app);
  return _db;
}
