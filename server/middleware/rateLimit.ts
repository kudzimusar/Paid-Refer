import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });
redis.connect().catch(console.error);

// General API — 100 req/15min per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  store: new RedisStore({ sendCommand: (...args: string[]) => redis.sendCommand(args) }),
  message: { error: "Too many requests, slow down" },
});

// Auth endpoints — 10 attempts/15min (prevent OTP brute force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  store: new RedisStore({ sendCommand: (...args: string[]) => redis.sendCommand(args) }),
  message: { error: "Too many login attempts" },
});

// WhatsApp webhook — no limit (Brevo needs unrestricted access)
// AI endpoints — 20/min per user (prevent cost explosion)
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator: (req: any) => req.user?.id?.toString() || req.ip || "unknown",
  store: new RedisStore({ sendCommand: (...args: string[]) => redis.sendCommand(args) }),
  message: { error: "AI request limit reached, wait a moment" },
});

// File uploads — 5/hour per user
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  keyGenerator: (req: any) => req.user?.id?.toString() || req.ip || "unknown",
  store: new RedisStore({ sendCommand: (...args: string[]) => redis.sendCommand(args) }),
  message: { error: "Upload limit reached for this hour" },
});
