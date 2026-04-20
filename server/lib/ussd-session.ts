import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL, // GCP Memorystore Redis URL
});

redis.connect().catch((err) => {
  console.warn("Redis connection failed. USSD sessions will be ephemeral.", err.message);
});

export interface USSDSession {
  phoneNumber: string;
  steps: Record<string, string>;
  startedAt: string;
}

const SESSION_TTL = 300; // 5 minutes — USSD sessions expire fast

export async function getUSSDSession(key: string): Promise<USSDSession | null> {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function saveUSSDSession(key: string, session: USSDSession): Promise<void> {
  try {
    await redis.setEx(key, SESSION_TTL, JSON.stringify(session));
  } catch (err) {
    console.warn("Could not save USSD session to Redis:", (err as Error).message);
  }
}

export async function deleteUSSDSession(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch {
    // ignore
  }
}
