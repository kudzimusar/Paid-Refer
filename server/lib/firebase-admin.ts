import admin from "firebase-admin";

let app: admin.app.App | null = null;

try {
  if (admin.apps?.length) {
    app = admin.app();
  } else if (process.env.FIREBASE_PROJECT_ID) {
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  } else {
    console.warn("⚠️  Firebase credentials not configured — Firebase features disabled.");
  }
} catch (err) {
  console.warn("⚠️  Firebase init failed:", (err as Error).message);
}

// Create real or stub exports
const noopFirestore = { settings: () => {}, collection: () => ({} as any), doc: () => ({} as any) } as any;

export const firestore = app ? admin.firestore() : noopFirestore;
export const storage = app ? admin.storage() : ({} as any);
export const messaging = app ? admin.messaging() : ({} as any);
export const auth = app ? admin.auth() : ({} as any);

// Firestore settings — important for performance
if (app) {
  firestore.settings({ ignoreUndefinedProperties: true });
}

export { admin };
export default app;

