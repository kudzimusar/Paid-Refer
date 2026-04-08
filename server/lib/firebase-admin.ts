import * as admin from "firebase-admin";

const app = admin.apps.length 
  ? admin.app() 
  : admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });

export const firestore = admin.firestore();
export const storage = admin.storage();
export const messaging = admin.messaging();
export const auth = admin.auth();

// Firestore settings — important for performance
firestore.settings({ ignoreUndefinedProperties: true });

export default app;
