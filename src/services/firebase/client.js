import AsyncStorage from 'expo-sqlite/kv-store';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let client = null;

export function getFirebaseClient() {
  if (client) return client;

  const config = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  };
  const spaceId = process.env.EXPO_PUBLIC_SYNC_SPACE_ID;
  const required = [config.apiKey, config.projectId, config.appId, spaceId];
  if (required.some((value) => !value || value === 'REPLACE_ME')) {
    throw new Error('.env에 Firebase Web 설정과 동기화 공간 ID를 입력해 주세요.');
  }
  if (!/^[a-zA-Z0-9_-]{8,64}$/.test(spaceId)) {
    throw new Error('동기화 공간 ID는 영문·숫자·_·- 8~64자로 설정해 주세요.');
  }

  const app = getApps().length ? getApps()[0] : initializeApp(config);
  let auth;
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    if (error?.code !== 'auth/already-initialized') throw error;
    auth = getAuth(app);
  }

  client = { auth, firestore: getFirestore(app), spaceId };
  return client;
}

export async function ensureAnonymousSignIn() {
  const { auth } = getFirebaseClient();
  await auth.authStateReady();
  if (!auth.currentUser) await signInAnonymously(auth);
  return auth.currentUser;
}
