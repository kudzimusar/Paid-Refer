import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { FirebaseRequest } from "../firebaseAuth";

/**
 * Features available per subscription status
 * Gates agent actions based on their current status.
 */
const FEATURE_ACCESS: Record<string, string[]> = {
  active: [
    "accept_leads", "send_messages", "view_leads",
    "manage_listings", "view_analytics", "update_profile",
  ],
  payment_grace: [
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

export function requireFeature(featureName: string) {
  return async (req: FirebaseRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (req.user.role !== "agent") {
      return next(); // Only agents have subscription restrictions
    }

    const user = await storage.getUser(req.user.id);
    const status = user?.subscriptionStatus || "inactive";
    const allowedFeatures = FEATURE_ACCESS[status] || [];

    if (!allowedFeatures.includes(featureName)) {
      return res.status(403).json({
        error: "subscription_required",
        message: getBlockedMessage(status, featureName),
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
  if (status === "payment_grace") {
    return "Your payment is overdue. Some features are restricted until your subscription is renewed.";
  }
  return "This feature requires an active subscription.";
}
