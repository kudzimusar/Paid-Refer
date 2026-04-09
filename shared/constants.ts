export const PLAN_FEATURES = {
  starter: {
    maxActiveLeads: 5,
    maxListings: 10,
    aiGhostwriter: false,
    marketReports: false,
    priorityMatching: false,
    customReferralSlug: false,
    price: { ZW: 15, ZA: 299, JP: 3000 },
  },
  professional: {
    maxActiveLeads: 20,
    maxListings: 50,
    aiGhostwriter: true,
    marketReports: true,
    priorityMatching: false,
    customReferralSlug: true,
    price: { ZW: 35, ZA: 699, JP: 7000 },
  },
  enterprise: {
    maxActiveLeads: -1,       // unlimited
    maxListings: -1,
    aiGhostwriter: true,
    marketReports: true,
    priorityMatching: true,   // leads shown to this agent first
    customReferralSlug: true,
    price: { ZW: 75, ZA: 1499, JP: 15000 },
  },
} as const;

export const REFERRER_TIERS = {
  bronze: {
    minConversions: 0,
    commissionRate: 0.10,    // 10% of deal service fee
    label: "Bronze Referrer",
    perks: [],
  },
  silver: {
    minConversions: 5,
    commissionRate: 0.15,
    label: "Silver Referrer",
    perks: ["Priority customer matching", "Custom referral slug"],
  },
  gold: {
    minConversions: 15,
    commissionRate: 0.20,
    label: "Gold Referrer",
    perks: ["Priority matching", "Custom slug", "Monthly bonus if top 10"],
  },
  platinum: {
    minConversions: 50,
    commissionRate: 0.25,
    label: "Platinum Referrer",
    perks: ["Highest commission", "Dedicated account manager", "Early access to new markets"],
  },
} as const;

export const PAID_FEATURES = {
  tenancy_agreement_generation: {
    priceUsd: 5,
    description: "AI-generated legally structured tenancy agreement PDF",
  },
  property_valuation_report: {
    priceUsd: 10,
    description: "Detailed AI market analysis report for a specific property",
  },
  premium_listing_boost: {
    priceUsd: 8,
    description: "Feature listing at top of search results for 7 days",
    duration: 7,
  },
  background_check: {
    priceUsd: 15,
    description: "Tenant background + credit check (ZA only, via TransUnion API)",
    availableCountries: ["ZA"],
  },
} as const;
