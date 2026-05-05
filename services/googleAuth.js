import { Platform } from 'react-native';
import { GoogleAuthProvider, signInWithPopup, signInWithCredential } from 'firebase/auth';
import { getFirebaseAuth } from './firebase';

/**
 * Web: Firebase opens Google's popup — uses OAuth clients from your Firebase project (no extra env).
 * @returns {Promise<import('firebase/auth').User>}
 */
export async function signInWithGooglePopup() {
  if (Platform.OS !== 'web') {
    throw new Error('signInWithGooglePopup is web-only');
  }
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase not configured');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  provider.addScope('profile');
  provider.addScope('email');
  const { user } = await signInWithPopup(auth, provider);
  return user;
}

/**
 * Native / universal: exchange Google ID token for Firebase user.
 * @param {string} idToken
 */
export async function signInWithGoogleIdToken(idToken) {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase not configured');
  const credential = GoogleAuthProvider.credential(idToken);
  const { user } = await signInWithCredential(auth, credential);
  return user;
}
