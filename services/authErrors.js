/**
 * Map Firebase Auth codes to actionable messages (especially Console/setup issues).
 * @param {unknown} err
 * @returns {string}
 */
export function formatAuthError(err) {
  const code = err && typeof err === 'object' && 'code' in err ? err.code : '';
  const msg = err && typeof err === 'object' && 'message' in err ? String(err.message) : String(err);

  if (code === 'auth/configuration-not-found') {
    return [
      'Firebase Authentication is not active for this project, or the Auth API is disabled.',
      'In Firebase Console: open Authentication → Get started, then enable Email/Password.',
      'In Google Cloud (same project): APIs & Services → enable "Identity Toolkit API".',
    ].join(' ');
  }

  if (code === 'auth/operation-not-allowed') {
    return 'Email/Password sign-in is disabled. Firebase Console → Authentication → Sign-in method → enable Email/Password.';
  }

  if (code === 'auth/api-key-not-valid' || code === 'auth/invalid-api-key') {
    return 'Invalid Firebase API key. Check EXPO_PUBLIC_FIREBASE_* in .env and restart Expo with npx expo start -c';
  }

  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
    return 'Sign-in was cancelled.';
  }

  if (code === 'auth/unauthorized-domain') {
    return 'This domain is not allowed for sign-in. Firebase Console → Authentication → Settings → Authorized domains → add localhost or your host (e.g. 127.0.0.1).';
  }

  return msg || 'Request failed';
}
