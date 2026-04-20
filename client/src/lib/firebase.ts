import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const isDemo = typeof window !== 'undefined' && (window.location.hostname.includes("github.io") || window.location.search.includes("demo=true"));

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:12345:web:abcde",
};

const app = (!firebaseConfig.apiKey || firebaseConfig.apiKey === "demo-key") && isDemo 
  ? { name: "[DEFAULT]", options: firebaseConfig } as any
  : initializeApp(firebaseConfig);

export const auth = isDemo ? { currentUser: null } as any : getAuth(app);
export const db = isDemo ? {} as any : getFirestore(app);
export const storage = isDemo ? {} as any : getStorage(app);

// FCM Setup
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(getMessaging(app), {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      return token;
    }
  } catch (err) {
    console.error("FCM Permission failed:", err);
  }
  return null;
};

export default app;
