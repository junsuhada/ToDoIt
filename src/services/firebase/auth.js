import {
  getAuth, onAuthStateChanged, signInAnonymously,
} from '@react-native-firebase/auth';

const auth = getAuth();

export const subscribeAuth = (callback) => onAuthStateChanged(auth, callback);

// Reuse the persisted anonymous session. Do not sign out an existing session:
// doing so would orphan its private Firestore documents.
export const ensureAnonymousUser = async () => {
  if (auth.currentUser) return auth.currentUser;
  const credential = await signInAnonymously(auth);
  return credential.user;
};
