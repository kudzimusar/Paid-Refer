import { db } from "../db";
import * as schema from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
// Assume sendPushNotification exists or implement a stub
import { sendPushNotification } from "./fcm"; 

export const ACHIEVEMENTS = {
  // Agent achievements
  FIRST_LEAD: { id: "first_lead", label: "First Steps", emoji: "👣", points: 50 },
  SPEED_DEMON: { id: "speed_demon", label: "Speed Demon", emoji: "⚡", points: 100,
    description: "Responded to a lead within 5 minutes" },
  DEAL_MAKER: { id: "deal_maker", label: "Deal Maker", emoji: "🤝", points: 200 },
  FIVE_STAR: { id: "five_star", label: "Five Star Agent", emoji: "⭐", points: 150,
    description: "Received 10 five-star reviews" },
  CENTURY: { id: "century", label: "Century Club", emoji: "💯", points: 500,
    description: "Closed 100 deals on the platform" },
  MARKET_MASTER: { id: "market_master", label: "Market Master", emoji: "📈", points: 300,
    description: "Active in 3+ cities" },

  // Referrer achievements
  FIRST_REFERRAL: { id: "first_referral", label: "Network Starter", emoji: "🌱", points: 50 },
  VIRAL: { id: "viral", label: "Going Viral", emoji: "🚀", points: 200,
    description: "100 clicks on a single link in one week" },
  MONEY_MAKER: { id: "money_maker", label: "Money Maker", emoji: "💰", points: 300,
    description: "Earned $500 in referral commissions" },
  SUPER_CONNECTOR: { id: "super_connector", label: "Super Connector", emoji: "🕸️", points: 500,
    description: "25 successful conversions" },
} as const;

export type AchievementId = keyof typeof ACHIEVEMENTS;

// XP levels
export const LEVELS = [
  { level: 1, name: "Newcomer", xpRequired: 0 },
  { level: 2, name: "Rising Star", xpRequired: 200 },
  { level: 3, name: "Professional", xpRequired: 500 },
  { level: 4, name: "Expert", xpRequired: 1000 },
  { level: 5, name: "Master", xpRequired: 2000 },
  { level: 6, name: "Legend", xpRequired: 5000 },
];

export async function awardAchievement(
  userId: string,
  achievementId: AchievementId
): Promise<void> {
  const achievement = ACHIEVEMENTS[achievementId];

  const existing = await db.query.userAchievements.findFirst({
    where: and(
      eq(schema.userAchievements.userId, userId),
      eq(schema.userAchievements.achievementId, achievementId)
    ),
  });
  if (existing) return; // Already awarded

  await db.insert(schema.userAchievements).values({
    userId,
    achievementId,
    points: achievement.points,
  });

  // Award XP and potentially level up
  await db.update(schema.userProfiles)
    .set({ 
      xp: sql`${schema.userProfiles.xp} + ${achievement.points}` 
    })
    .where(eq(schema.userProfiles.userId, userId));

  // Push notification for achievement
  const profile = await db.query.userProfiles.findFirst({
    where: eq(schema.userProfiles.userId, userId),
  });

  if (profile?.fcmToken) {
    try {
      await sendPushNotification(profile.fcmToken, {
        title: `${achievement.emoji} Achievement Unlocked!`,
        body: `${achievement.label} — You earned ${achievement.points} XP`,
        data: { type: "achievement", achievementId },
      });
    } catch (err) {
      console.error("Failed to send achievement push:", err);
    }
  }
}

export function getCurrentLevel(xp: number) {
  return [...LEVELS].reverse().find(l => xp >= l.xpRequired) || LEVELS[0];
}
