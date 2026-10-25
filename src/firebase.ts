import {getApp, getApps, initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const readSetting = (value: unknown) => {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  const unquoted = trimmed.replace(/^(["'])(.*)\1$/, '$2').trim();
  return unquoted;
};

const config = {
  apiKey: readSetting(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: readSetting(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: readSetting(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: readSetting(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: readSetting(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: readSetting(import.meta.env.VITE_FIREBASE_APP_ID),
};

const isPlaceholder = (value: string) =>
  /^(?:your(?:[-_ ]|$)|replace(?:[-_ ]|$)|<.*>|changeme|xxxx)/i.test(value);

export const firebaseConfigured = Object.values(config).every(value => value.length > 0 && !isPlaceholder(value));
const app = firebaseConfigured ? (getApps().length ? getApp() : initializeApp(config)) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export function requireFirebase() {
  if (!auth || !db) throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* values from your Firebase project to .env.local, then restart the dev server.');
  return {auth, db};
}
