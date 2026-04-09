import { db } from "../db";
import { exchangeRates } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

interface RateCache {
  [pair: string]: { rate: number; fetchedAt: number };
}

const MEMORY_CACHE: RateCache = {};
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function getExchangeRate(
  from: "USD" | "ZAR" | "JPY",
  to: "USD" | "ZAR" | "JPY"
): Promise<number> {
  if (from === to) return 1;

  const pair = `${from}_${to}`;
  const cached = MEMORY_CACHE[pair];

  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.rate;
  }

  try {
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=${from}&to=${to}`
    );
    const data = await res.json();
    const rate = data.rates[to];

    if (!rate) throw new Error("Rate not found");

    MEMORY_CACHE[pair] = { rate, fetchedAt: Date.now() };

    // Persist to DB for audit trail
    // Note: In Drizzle with PG, we use onConflictDoUpdate
    await db.insert(exchangeRates).values({
      fromCurrency: from,
      toCurrency: to,
      rate: rate.toString(),
      source: "frankfurter",
    }).onConflictDoUpdate({
      target: [exchangeRates.fromCurrency, exchangeRates.toCurrency],
      set: { rate: rate.toString(), fetchedAt: new Date() },
    });

    return rate;
  } catch (error) {
    console.error(`Failed to fetch exchange rate for ${pair}:`, error);
    // Fallback to last known DB rate
    const dbRate = await db.query.exchangeRates.findFirst({
      where: and(
        eq(exchangeRates.fromCurrency, from),
        eq(exchangeRates.toCurrency, to)
      ),
      orderBy: [desc(exchangeRates.fetchedAt)],
    });
    return dbRate ? parseFloat(dbRate.rate) : 1;
  }
}

export async function convertToUSD(
  amount: number,
  from: "USD" | "ZAR" | "JPY"
): Promise<number> {
  if (from === "USD") return amount;
  const rate = await getExchangeRate(from, "USD");
  return parseFloat((amount * rate).toFixed(2));
}
