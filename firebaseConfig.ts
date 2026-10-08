import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  initializeAuth,
  getAuth,
  Auth,
  // @ts-ignore: Known Firebase TS definition bug
  getReactNativePersistence
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAGcxRo1o9neqaYmLDRY_oaIOmIPMFBaIk",
  authDomain: "ppe-detection-6b4b5.firebaseapp.com",
  projectId: "ppe-detection-6b4b5",
  storageBucket: "ppe-detection-6b4b5.firebasestorage.app",
  messagingSenderId: "492847927453",
  appId: "1:492847927453:web:486b9a30da7f5271170474",
  measurementId: "G-R3QBMQJEHQ"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth: Auth;
try {
  auth = initializeAuth(app, {
    // @ts-ignore: Known Firebase TS definition bug
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };