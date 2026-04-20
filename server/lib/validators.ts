import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

// ── AUTH ──────────────────────────────────────────────────────────

export const firebaseVerifySchema = z.object({
  idToken: z.string().min(1),
  role: z.enum(["agent", "customer", "referrer"]),
  country: z.enum(["ZW", "ZA", "JP"]),
  referralCode: z.string().optional(),
});

// ── CUSTOMER REQUEST ──────────────────────────────────────────────

export const customerRequestSchema = z.object({
  propertyType: z.enum([
    "1R","1K","1DK","1LDK","2K","2DK","2LDK","3K","3DK","3LDK","4LDK",
    "house_rent","house_buy","flat_rent","flat_buy",
    "sectional_title","full_title","cluster","estate","townhouse","apartment",
    "stand","cluster_home","commercial","other"
  ]),
  preferredLocation: z.string().min(2).max(128),
  city: z.string().min(2).max(64),
  country: z.enum(["ZW", "ZA", "JP"]),
  budgetMin: z.number().positive(),
  budgetMax: z.number().positive(),
  currency: z.enum(["USD", "ZAR", "JPY"]),
  bedrooms: z.string().optional().nullable(),
  moveInDate: z.string().datetime().optional().nullable(),
  visaType: z.string().max(64).optional().nullable(),
  mustHaveFeatures: z.array(z.string()).max(10).optional(),
  notes: z.string().max(500).optional(),
  referralCode: z.string().optional(),
}).refine((d) => d.budgetMax >= d.budgetMin, {
  message: "budgetMax must be >= budgetMin",
  path: ["budgetMax"],
});

// ── AGENT ONBOARDING ──────────────────────────────────────────────

export const agentProfileSchema = z.object({
  name: z.string().min(2).max(128),
  email: z.string().email(),
  phone: z.string().min(9).max(20),
  country: z.enum(["ZW", "ZA", "JP"]),
  serviceAreas: z.array(z.string()).min(1).max(10),
  propertySpecializations: z.array(z.string()).min(1).max(8),
  yearsExperience: z.number().int().min(0).max(50),
  bio: z.string().max(500).optional(),
  languages: z.array(z.string()).min(1),
  whatsappNumber: z.string().optional(),
});

// ── PROPERTY LISTING ──────────────────────────────────────────────

export const propertyListingSchema = z.object({
  title: z.string().min(5).max(128),
  description: z.string().min(10).max(2000),
  propertyType: z.string(),
  country: z.enum(["ZW", "ZA", "JP"]),
  city: z.string().min(2).max(64),
  district: z.string().max(128).optional(),
  address: z.string().max(256).optional(),
  price: z.number().positive(),
  currency: z.enum(["USD", "ZAR", "JPY"]),
  priceType: z.enum(["monthly", "once_off", "per_sqm"]),
  bedrooms: z.number().int().min(0).max(20).optional(),
  bathrooms: z.number().min(0).max(20).optional(),
  sizeSqm: z.number().positive().optional(),
  floor: z.number().int().optional(),
  totalFloors: z.number().int().optional(),
  availableFrom: z.string().datetime().optional(),
  amenities: z.array(z.string()).max(30).optional(),
  // Japan-specific
  keyMoney: z.number().optional(),
  securityDeposit: z.number().optional(),
  managementFee: z.number().optional(),
  petPolicy: z.enum(["allowed", "not_allowed", "negotiable"]).optional(),
  isActive: z.boolean().default(true),
});

// ── REFERRAL LINK ─────────────────────────────────────────────────

export const createReferralLinkSchema = z.object({
  targetCountry: z.enum(["ZW", "ZA", "JP"]),
  customSlug: z.string()
    .min(3).max(32)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(),
  campaignName: z.string().max(64).optional(),
});

// ── DEAL CLOSE ────────────────────────────────────────────────────

export const closeDealSchema = z.object({
  dealValueUsd: z.number().positive().min(100),
  dealType: z.enum(["rental", "sale", "commercial"]),
  notes: z.string().max(500).optional(),
});

// ── MIDDLEWARE WRAPPER ────────────────────────────────────────────

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data;
    next();
  };
}
