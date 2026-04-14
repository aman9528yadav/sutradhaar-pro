// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
};

// Validate configuration and initialize conditionally
let app: any = null;
let auth: any = null;
let db: any = null;
let rtdb: any = null;

if (typeof window !== 'undefined' && !firebaseConfig.apiKey) {
  console.warn("⚠️ Firebase environment variables are missing. The app will run in a limited mode without authentication or database features.");
} else if (firebaseConfig.apiKey) {
  // Initialize Firebase
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  rtdb = getDatabase(app);

  // Enable offline persistence for Firestore.
  // This should be done only once, so we check if the app is initialized.
  if (typeof window !== 'undefined') {
    try {
      enableIndexedDbPersistence(db, {
        cacheSizeBytes: CACHE_SIZE_UNLIMITED
      }).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Firestore persistence failed: Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
          console.warn('Firestore persistence failed: The current browser does not support all of the features required to enable persistence.');
        }
      });
    } catch (error) {
      console.error("Error enabling Firestore offline persistence:", error);
    }
  }
}

export { app, auth, db, rtdb };
