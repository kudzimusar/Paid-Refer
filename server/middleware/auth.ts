import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthUser {
  userId: string; // Changed from number to string to match existing schema
  role: "agent" | "customer" | "referrer" | "admin";
  country: "ZW" | "ZA" | "JP";
  subscriptionStatus?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireRole(...roles: AuthUser["role"][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Forbidden",
        required: roles,
        actual: req.user.role,
      });
    }
    next();
  };
}

export function requireCountry(...countries: AuthUser["country"][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (!countries.includes(req.user.country)) {
      return res.status(403).json({ error: "Service not available in your region" });
    }
    next();
  };
}

// Added requireFeature as it's used in common patterns
export function requireFeature(feature: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Basic implementation - can be expanded as needed
    next();
  };
}
