import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging, isSupported } from "firebase/messaging";
import { isDemoMode } from './demoMode';
import { createMockAuth, createMockApp } from './firebaseMock';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | ReturnType<typeof createMockApp>;
let auth: Auth | ReturnType<typeof createMockAuth>;

if (isDemoMode()) {
  console.log('🎭 Demo Mode: Using mock Firebase');
  app = createMockApp() as any;
  auth = createMockAuth() as any;
} else {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app as FirebaseApp);
}

const storage = isDemoMode() ? null : getStorage(app as FirebaseApp);

let messaging: any = null;
if (!isDemoMode()) {
  isSupported().then(supported => {
    if (supported) messaging = getMessaging(app as FirebaseApp);
  }).catch(() => {});
}

export const requestNotificationPermission = async () => {
  if (isDemoMode()) return null;
  try {
    const { getToken, getMessaging: gm } = await import("firebase/messaging");
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      return await getToken(gm(app as FirebaseApp), {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
    }
  } catch (err) {
    console.error("FCM Permission failed:", err);
  }
  return null;
};

export { app, auth, storage, messaging };
export default app;
