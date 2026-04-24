import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

export interface AuthUser {
  id: string;
  uid: string; // Firebase UID
  role: "agent" | "customer" | "referrer" | "admin" | "house_owner" | "super_admin";
  country: "ZW" | "ZA" | "JP";
  subscriptionStatus?: string;
  email?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

export function requireRole(...roles: AuthUser["role"][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "forbidden",
        message: "Insufficient permissions",
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
      return res.status(403).json({ 
        error: "region_restricted",
        message: "Service not available in your region" 
      });
    }
    next();
  };
}

const FEATURE_ACCESS: Record<string, string[]> = {
  active: [
    "accept_leads", "send_messages", "view_leads",
    "manage_listings", "view_analytics", "update_profile",
  ],
  grace_period: [
    // Soft lock — can still communicate with existing leads, not accept new ones
    "send_messages", "view_leads", "update_profile",
  ],
  suspended: [
    // Read-only access to their data only
    "view_leads",
  ],
  inactive: [
    "update_profile",
  ],
};

export function requireFeature(feature: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    // Only agents have subscription restrictions for now
    if (req.user.role !== "agent") {
      return next();
    }

    const user = await storage.getUser(req.user.id);
    const status = user?.subscriptionStatus || "inactive";
    const allowedFeatures = FEATURE_ACCESS[status] || [];

    if (!allowedFeatures.includes(feature)) {
      return res.status(403).json({
        error: "subscription_required",
        message: getBlockedMessage(status, feature),
        subscriptionStatus: status,
        upgradeUrl: `/dashboard/settings/payments`,
      });
    }

    next();
  };
}

function getBlockedMessage(status: string, feature: string): string {
  if (status === "suspended") {
    return "Your account is suspended due to an unpaid subscription. Reactivate to continue.";
  }
  if (status === "grace_period") {
    return "Your payment is overdue. Some features are restricted until your subscription is renewed.";
  }
  return "This feature requires an active subscription.";
}
