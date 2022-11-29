import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import environment from "./environment";

// Initialize Firebase
export const app = initializeApp(environment.firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const firestore = getFirestore(app);
export const storage = getStorage(app);