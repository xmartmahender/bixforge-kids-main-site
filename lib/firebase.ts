//lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZVV35MNDjEJTrKMsHvDdCm0CNW63XUZ4",
  authDomain: "new-project-f8d5e.firebaseapp.com",
  projectId: "new-project-f8d5e",
  storageBucket: "new-project-f8d5e.appspot.com",
  messagingSenderId: "284483723352",
  appId: "1:284483723352:web:1db28c1ed16afd4ebf2a2d",
  measurementId: "G-TX0N65L84C"
};

// ✅ Prevent multiple initializations
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const storage = getStorage(app);
