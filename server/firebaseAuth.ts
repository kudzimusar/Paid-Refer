import { Express, Request, Response, NextFunction } from "express";
import { auth } from "./lib/firebase-admin.ts";
import { storage } from "./storage.ts";

export interface FirebaseRequest extends Request {
  user?: any;
}

export async function setupFirebaseAuth(app: Express) {
  // Middleware to verify Firebase ID Token
  app.use(async (req: FirebaseRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    // Skip auth for public and internal webhook routes
    if (req.path.startsWith('/api/public') || req.path.startsWith('/internal')) {
      return next();
    }

    if (!authHeader?.startsWith("Bearer ")) {
      return next();
    }

    const idToken = authHeader.split("Bearer ")[1];
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      
      // Get or Create user in our DB using firebaseUid
      let dbUser = await storage.getUserByFirebaseUid(decodedToken.uid);
      
      if (!dbUser) {
        // First time login — create sparse record
        dbUser = await storage.createUser({
          firebaseUid: decodedToken.uid,
          email: decodedToken.email || null,
          phone: decodedToken.phone_number || null,
          onboardingStatus: 'splash',
        });
      }

      req.user = { 
        ...decodedToken, 
        id: dbUser.id,
        role: dbUser.role,
        country: dbUser.country,
        dbUser 
      };
      
      next();
    } catch (error) {
      console.error("Firebase auth error:", error);
      res.status(401).json({ message: "Invalid or expired session" });
    }
  });

  // Role-based access control helper and other helpers remain here
}

export function isFirebaseAuthenticated(req: FirebaseRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

// Role-based access control helper
export function hasRole(roles: string[]) {
  return (req: FirebaseRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
}

/**
 * Sets custom claims on a Firebase user token.
 * These claims are read by Firestore Security Rules.
 */
export async function setUserClaims(
  firebaseUid: string,
  claims: { userId: string; role: string; country: string }
): Promise<void> {
  await auth.setCustomUserClaims(firebaseUid, {
    userId: claims.userId, 
    role: claims.role,     
    country: claims.country,
  });
}
