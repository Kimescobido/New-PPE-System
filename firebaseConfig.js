
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAGcxRo1o9neqaYmLDRY_oaIOmIPMFBaIk",
  authDomain: "ppe-detection-6b4b5.firebaseapp.com",
  projectId: "ppe-detection-6b4b5",
  storageBucket: "ppe-detection-6b4b5.firebasestorage.app",
  messagingSenderId: "492847927453",
  appId: "1:492847927453:web:486b9a30da7f5271170474",
  measurementId: "G-R3QBMQJEHQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// At the bottom of firebaseConfig.js
export const auth = getAuth(app);
export const db = getFirestore(app);