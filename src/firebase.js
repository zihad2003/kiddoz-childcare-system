import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Fallback to the project's own Firebase config if env vars are not set
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBuqk1xwSehbTEuPsJ5rJdMOioRIc6LndI",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kiddoz-163cd.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kiddoz-163cd",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kiddoz-163cd.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "352290108946",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:352290108946:web:4a89579bfa3c6fa18d8acb",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
