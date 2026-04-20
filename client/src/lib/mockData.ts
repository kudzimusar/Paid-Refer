// Mock data generators for investor demo

export interface MockProperty {
  id: string;
  market: "ZW" | "ZA" | "JP";
  propertyType: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  aiQualityScore: number;
  description: string;
  agentId: string;
  status: "available" | "pending" | "rented";
  createdAt: Date;
  images: string[];
}

export interface MockReferrer {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  market: "ZW" | "ZA" | "JP";
  level: number;
  xp: number;
  tier: string;
  totalEarnings: number;
  weeklyEarnings: number;
  conversions: number;
  activeLinks: number;
  totalClicks: number;
  conversionRate: number;
  joinedAt: Date;
  lastActive: Date;
}

export interface MockAgent {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  market: "ZW" | "ZA" | "JP";
  license: string;
  trustScore: number;
  isVerified: boolean;
  specializations: string[];
  languages: string[];
  coverageAreas: string[];
  avgResponseTime: number;
  successRate: number;
  rating: number;
  reviewCount: number;
  closedDeals: number;
  acceptedLeads: number;
  activeDeals: number;
  joinedAt: Date;
  lastActive: Date;
}

export interface MockTransaction {
  id: string;
  type: "commission" | "payout" | "bonus";
  amount: number;
  currency: string;
  status: "completed" | "processing" | "pending";
  referrerId: string;
  agentId: string;
  customerId: string;
  propertyId: string;
  createdAt: Date;
  completedAt: Date;
}

const FIRST_NAMES = [
  "Tendai",
  "Chipo",
  "Rudo",
  "Tapiwa",
  "Linda",
  "John",
  "Sarah",
  "Michael",
  "Yuki",
  "Haruto",
  "Emma",
  "David",
  "Lisa",
  "James",
  "Grace",
  "Robert",
  "Sophie",
  "Daniel",
  "Victoria",
  "Christopher",
];

const LAST_NAMES = [
  "Moyo",
  "Ndlovu",
  "Chikwamba",
  "Matsumoto",
  "Tanaka",
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
];

const ZW_LOCATIONS = [
  "Borrowdale",
  "Mount Pleasant",
  "Avondale",
  "Highlands",
  "Marlborough",
  "Westgate",
  "Graniteside",
  "Sunridge",
];

const ZA_LOCATIONS = [
  "Sandton",
  "Rosebank",
  "Waterfront",
  "Camps Bay",
  "Umhlanga",
  "Bryanston",
  "Fourways",
  "Midrand",
];

const JP_LOCATIONS = [
  "Shibuya",
  "Shinjuku",
  "Roppongi",
  "Ginza",
  "Akihabara",
  "Meguro",
  "Minato",
  "Chiyoda",
];

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysAgo: number): Date {
  return new Date(Date.now() - Math.random() * daysAgo * 24 * 60 * 60 * 1000);
}

function generateInitials(): string {
  const first = randomChoice(FIRST_NAMES)[0];
  const last = randomChoice(LAST_NAMES)[0];
  return (first + last).toUpperCase();
}

function generateName(): string {
  return `${randomChoice(FIRST_NAMES)} ${randomChoice(LAST_NAMES)}`;
}

function generateEmail(name: string): string {
  return name.toLowerCase().replace(" ", ".") + "@example.com";
}

function generatePhone(): string {
  return "+1" + randomBetween(2000000000, 9999999999);
}

function generateLicense(): string {
  return `ZREB-${randomBetween(10000, 99999)}`;
}

export function generateMockProperties(count: number = 50): MockProperty[] {
  const properties: MockProperty[] = [];
  const markets: Array<"ZW" | "ZA" | "JP"> = ["ZW", "ZA", "JP"];

  for (let i = 0; i < count; i++) {
    const market = markets[i % 3];
    let propertyTypes: string[] = [];
    let locations: string[] = [];

    if (market === "ZW") {
      propertyTypes = ["Stand", "Cluster Home", "Flat", "Townhouse", "Commercial"];
      locations = ZW_LOCATIONS;
    } else if (market === "ZA") {
      propertyTypes = [
        "Sectional Title",
        "Full Title",
        "Townhouse",
        "Apartment",
        "Penthouse",
      ];
      locations = ZA_LOCATIONS;
    } else {
      propertyTypes = ["1K", "1DK", "1LDK", "2K", "2DK", "2LDK", "3LDK", "4LDK"];
      locations = JP_LOCATIONS;
    }

    const price =
      market === "ZW"
        ? randomBetween(300, 1500)
        : market === "ZA"
        ? randomBetween(5000, 25000)
        : randomBetween(80000, 300000);

    properties.push({
      id: `prop_${i + 1}`,
      market,
      propertyType: randomChoice(propertyTypes),
      location: randomChoice(locations),
      price,
      bedrooms: randomBetween(1, 4),
      bathrooms: randomBetween(1, 3),
      sqft: randomBetween(500, 2500),
      aiQualityScore: randomBetween(70, 98),
      description: `Beautiful ${randomChoice(propertyTypes)} in ${randomChoice(locations)}`,
      agentId: `agent_${(i % 10) + 1}`,
      status: randomChoice(["available", "pending", "rented"]),
      createdAt: randomDate(180),
      images: [`/api/property/${i + 1}/image1.jpg`],
    });
  }

  return properties;
}

export function generateMockReferrers(count: number = 20): MockReferrer[] {
  const referrers: MockReferrer[] = [];

  for (let i = 0; i < count; i++) {
    const name = generateName();
    const xp = randomBetween(0, 15000);
    const tier =
      xp >= 5000 ? "Gold" : xp >= 1000 ? "Silver" : xp >= 500 ? "Bronze" : "Standard";

    referrers.push({
      id: `ref_${i + 1}`,
      name,
      initials: generateInitials(),
      email: generateEmail(name),
      phone: generatePhone(),
      market: randomChoice(["ZW", "ZA", "JP"]),
      level: Math.floor(xp / 1000) + 1,
      xp,
      tier,
      totalEarnings: randomBetween(0, 5000),
      weeklyEarnings: randomBetween(0, 500),
      conversions: randomBetween(0, 50),
      activeLinks: randomBetween(0, 15),
      totalClicks: randomBetween(0, 500),
      conversionRate: randomBetween(5, 35),
      joinedAt: randomDate(365),
      lastActive: randomDate(7),
    });
  }

  return referrers;
}

export function generateMockAgents(count: number = 10): MockAgent[] {
  const agents: MockAgent[] = [];

  for (let i = 0; i < count; i++) {
    const name = generateName();

    agents.push({
      id: `agent_${i + 1}`,
      name,
      initials: generateInitials(),
      email: generateEmail(name),
      phone: generatePhone(),
      market: randomChoice(["ZW", "ZA", "JP"]),
      license: generateLicense(),
      trustScore: randomBetween(700, 950),
      isVerified: Math.random() > 0.2,
      specializations: [
        randomChoice(["Residential", "Commercial", "Luxury", "Budget"]),
      ],
      languages: [randomChoice(["English", "Shona", "Zulu", "Japanese"])],
      coverageAreas: [
        randomChoice(ZW_LOCATIONS),
        randomChoice(ZW_LOCATIONS),
      ],
      avgResponseTime: randomBetween(5, 120),
      successRate: randomBetween(70, 95),
      rating: parseFloat((randomBetween(35, 50) / 10).toFixed(1)),
      reviewCount: randomBetween(5, 50),
      closedDeals: randomBetween(10, 100),
      acceptedLeads: randomBetween(20, 150),
      activeDeals: randomBetween(0, 15),
      joinedAt: randomDate(730),
      lastActive: randomDate(1),
    });
  }

  return agents;
}

export function generateMockTransactions(count: number = 100): MockTransaction[] {
  const transactions: MockTransaction[] = [];

  for (let i = 0; i < count; i++) {
    transactions.push({
      id: `txn_${i + 1}`,
      type: randomChoice(["commission", "payout", "bonus"]),
      amount: randomBetween(50, 500),
      currency: randomChoice(["USD", "ZAR", "JPY"]),
      status: randomChoice(["completed", "processing", "pending"]),
      referrerId: `ref_${randomBetween(1, 20)}`,
      agentId: `agent_${randomBetween(1, 10)}`,
      customerId: `cust_${randomBetween(1, 100)}`,
      propertyId: `prop_${randomBetween(1, 50)}`,
      createdAt: randomDate(180),
      completedAt: randomDate(180),
    });
  }

  return transactions;
}

// ── Referrer Dashboard Mock Data ────────────────────────────

export interface MockReferralLink {
  id: string;
  shortCode: string;
  isActive: boolean;
  totalClicks: number;
  totalConversions: number;
  totalEarningsUsd: string;
  createdAt: string;
  requestType: string;
  targetArea: string;
  targetCountry: string;
  generatedCopyEn: string;
}

export interface MockActivity {
  id: string;
  type: "conversion" | "click" | "payout" | "bonus";
  message: string;
  amount?: number;
  timestamp: Date;
}

export const MOCK_REFERRAL_LINKS: MockReferralLink[] = [
  {
    id: "link_1",
    shortCode: "H7K2M9",
    isActive: true,
    totalClicks: 45,
    totalConversions: 3,
    totalEarningsUsd: "360.00",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    requestType: "2-Bedroom Apartment",
    targetArea: "Borrowdale",
    targetCountry: "ZW",
    generatedCopyEn:
      "🏠 Looking for a 2-bedroom in Borrowdale? I found this amazing platform that matches you with verified agents in 24hrs. Tap to get started — it's free!",
  },
  {
    id: "link_2",
    shortCode: "B3N8P1",
    isActive: true,
    totalClicks: 67,
    totalConversions: 5,
    totalEarningsUsd: "600.00",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    requestType: "3-Bedroom House",
    targetArea: "Mount Pleasant",
    targetCountry: "ZW",
    generatedCopyEn:
      "🌿 Know anyone searching for a 3-bed home in Mount Pleasant? Share this link — they get matched with top agents instantly and you earn every time they sign!",
  },
  {
    id: "link_3",
    shortCode: "K9M4T7",
    isActive: true,
    totalClicks: 32,
    totalConversions: 2,
    totalEarningsUsd: "240.00",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    requestType: "1-Bedroom Flat",
    targetArea: "Avondale",
    targetCountry: "ZW",
    generatedCopyEn:
      "🔑 Affordable 1-bed flats in Avondale — my link connects you with licensed agents who respond in minutes. No middleman fees!",
  },
  {
    id: "link_4",
    shortCode: "R2X6W3",
    isActive: false,
    totalClicks: 90,
    totalConversions: 2,
    totalEarningsUsd: "240.00",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    requestType: "Townhouse",
    targetArea: "Highlands",
    targetCountry: "ZW",
    generatedCopyEn:
      "🏡 Townhouses in Highlands are moving fast. Tap this link to get matched today before they're gone!",
  },
  {
    id: "link_5",
    shortCode: "P5L1Q8",
    isActive: true,
    totalClicks: 28,
    totalConversions: 1,
    totalEarningsUsd: "120.00",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    requestType: "Commercial Space",
    targetArea: "Graniteside",
    targetCountry: "ZW",
    generatedCopyEn:
      "📦 Need commercial space in Graniteside? Skip the estate agency queue — verified agents, fast matching, zero stress.",
  },
];

export const MOCK_ACTIVITY: MockActivity[] = [
  {
    id: "act_1",
    type: "conversion",
    message: "Customer signed lease via link H7K2M9",
    amount: 120.00,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "act_2",
    type: "click",
    message: "3 new clicks on your Borrowdale link",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "act_3",
    type: "payout",
    message: "Payout processed to your account",
    amount: 600.00,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "act_4",
    type: "conversion",
    message: "New sign-up via link B3N8P1 — Mount Pleasant",
    amount: 120.00,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
  {
    id: "act_5",
    type: "bonus",
    message: "🥈 Silver tier bonus unlocked! +$50",
    amount: 50.00,
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
  },
];

export function getMockReferralLinks(): MockReferralLink[] {
  return MOCK_REFERRAL_LINKS;
}

export function getMockActivity(): MockActivity[] {
  return MOCK_ACTIVITY;
}

// Lazy-loaded singleton instances
let cachedProperties: MockProperty[] | null = null;
let cachedReferrers: MockReferrer[] | null = null;
let cachedAgents: MockAgent[] | null = null;
let cachedTransactions: MockTransaction[] | null = null;

export function getMockProperties(): MockProperty[] {
  if (!cachedProperties) {
    cachedProperties = generateMockProperties(50);
  }
  return cachedProperties;
}

export function getMockReferrers(): MockReferrer[] {
  if (!cachedReferrers) {
    cachedReferrers = generateMockReferrers(20);
  }
  return cachedReferrers;
}

export function getMockAgents(): MockAgent[] {
  if (!cachedAgents) {
    cachedAgents = generateMockAgents(10);
  }
  return cachedAgents;
}

export function getMockTransactions(): MockTransaction[] {
  if (!cachedTransactions) {
    cachedTransactions = generateMockTransactions(100);
  }
  return cachedTransactions;
}
