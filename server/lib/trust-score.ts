import { db } from "../db";
import * as schema from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";

/*
TRUST SCORE COMPONENTS:

AGENT TRUST SCORE (0-1000)
├── Verification depth        (0-200)
│   ├── License verified by AI          +100
│   ├── License verified by human       +150
│   ├── ID document verified            +50
│   └── Physical office address verified +50 (manual)
├── Performance history       (0-400)
│   ├── Response rate (per hour bucket) +0-100
│   ├── Conversion rate                 +0-100
│   ├── Customer ratings avg            +0-100
│   └── Deal completion rate            +0-100
├── Platform behaviour        (0-200)
│   ├── No disputes raised against      +100
│   ├── No content moderation flags     +50
│   ├── No declined-then-ignored leads  +50
├── Tenure                    (0-100)
│   └── +10 per month active, max 100
└── Community                 (0-100)
    ├── Referrer endorsements            +50
    └── Peer agent endorsements          +50
*/

export interface TrustScore {
  total: number;
  band: "unverified" | "basic" | "trusted" | "verified" | "elite";
  components: Record<string, number>;
  badge: string;
  lastCalculatedAt: Date;
}

export function getTrustBand(score: number): TrustScore["band"] {
  if (score < 100) return "unverified";
  if (score < 300) return "basic";
  if (score < 500) return "trusted";
  if (score < 750) return "verified";
  return "elite";
}

export const TRUST_BADGES = {
  unverified: { label: "Unverified", emoji: "⬜", color: "#9ca3af" },
  basic: { label: "Basic", emoji: "🔵", color: "#3b82f6" },
  trusted: { label: "Trusted", emoji: "✅", color: "#10b981" },
  verified: { label: "Verified Pro", emoji: "🏅", color: "#f59e0b" },
  elite: { label: "Elite Agent", emoji: "💎", color: "#6366f1" },
};

// Weekly CRON recalculates all trust scores
export async function recalculateAgentTrustScore(agentId: string): Promise<TrustScore> {
  const [scores, disputesCount, reviewsAvg, leadsCount] = await Promise.all([
    db.query.agentScores.findFirst({ where: eq(schema.agentScores.agentId, agentId) }),
    db.select({ count: sql<number>`count(*)` }).from(schema.disputes)
      .where(and(eq(schema.disputes.againstUserId, agentId), eq(schema.disputes.status, "resolved_customer_favour"))),
    db.select({ avg: sql<number>`avg(rating)` }).from(schema.reviews)
      .where(eq(schema.reviews.agentId, agentId)),
    db.select({ count: sql<number>`count(*)` }).from(schema.customerRequests)
      .where(eq(schema.customerRequests.assignedAgentId, agentId)),
  ]);

  const verification = await db.query.agentVerifications.findFirst({
    where: eq(schema.agentVerifications.agentId, agentId),
  });

  const components: Record<string, number> = {
    verification_ai: verification?.verificationMethod === "auto_ai" ? 100 : 0,
    verification_human: verification?.verificationMethod === "manual_review" ? 150 : 0,
    response_rate: Math.min(100, Number(scores?.responseRateScore ?? 0)),
    conversion_rate: Math.min(100, Number(scores?.conversionRate ?? 0) * 100),
    customer_rating: Math.min(100, Number(reviewsAvg[0]?.avg ?? 0) * 20),
    no_disputes: disputesCount[0].count === 0 ? 100 : Math.max(0, 100 - Number(disputesCount[0].count) * 25),
    tenure: Math.min(100, Number(leadsCount[0].count) * 2),
  };

  const total = Object.values(components).reduce((a, b) => a + b, 0);

  // Update original agentScores
  if (scores) {
    await db.update(schema.agentScores)
      .set({ 
        reliabilityIndex: total.toString(), 
        reliabilityLastCalculatedAt: new Date(),
        scoreBand: getTrustBand(total) as any // Cast to enum
      })
      .where(eq(schema.agentScores.agentId, agentId));
  } else {
    await db.insert(schema.agentScores).values({
      agentId,
      reliabilityIndex: total.toString(),
      reliabilityLastCalculatedAt: new Date(),
      scoreBand: getTrustBand(total) as any
    });
  }

  const band = getTrustBand(total);
  return {
    total,
    band,
    components,
    badge: TRUST_BADGES[band].emoji,
    lastCalculatedAt: new Date(),
  };
}
