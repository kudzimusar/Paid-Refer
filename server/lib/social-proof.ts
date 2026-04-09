import { db } from "../db";
import * as schema from "@shared/schema";
import { eq, and, sql, desc } from "drizzle-orm";

export type SocialProofEvent = {
  type: "deal_closed" | "agent_verified" | "new_referrer" | "search_active";
  message: string;
  timeAgo: string;
  country: string;
  isAnonymised: boolean;
};

export async function getRecentSocialProofEvents(
  country: string,
  limit = 10
): Promise<SocialProofEvent[]> {
  const events = await db.execute(sql`
    (
      SELECT 
        'deal_closed' as type,
        preferred_city || ', ' || country as location,
        updated_at as created_at,
        country
      FROM customer_requests
      WHERE status = 'closed'
        AND updated_at > NOW() - INTERVAL '7 days'
      ORDER BY updated_at DESC
      LIMIT 4
    )
    UNION ALL
    (
      SELECT
        'agent_verified' as type,
        country as location,
        verified_at as created_at,
        country
      FROM agent_verifications
      WHERE verification_status = 'approved'
        AND verified_at > NOW() - INTERVAL '3 days'
      LIMIT 3
    )
    UNION ALL
    (
      SELECT
        'search_active' as type,
        preferred_city || ', ' || country as location,
        created_at,
        country
      FROM customer_requests
      WHERE created_at > NOW() - INTERVAL '24 hours'
      LIMIT 3
    )
    ORDER BY created_at DESC
    LIMIT ${limit}
  `);

  return (events.rows as any[]).map((e) => ({
    type: e.type,
    message: formatMessage(e.type, e.location),
    timeAgo: formatTimeAgo(e.created_at),
    country: e.country,
    isAnonymised: true,
  }));
}

function formatMessage(type: string, location: string): string {
  switch (type) {
    case "deal_closed": return `A property deal closed in ${location}`;
    case "agent_verified": return `A new verified agent joined in ${location}`;
    case "search_active": return `Someone is searching for property in ${location}`;
    default: return `Activity in ${location}`;
  }
}

function formatTimeAgo(date: Date | string): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}
