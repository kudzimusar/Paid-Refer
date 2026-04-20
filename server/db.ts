import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl || dbUrl.includes("user:password@host")) {
  console.warn(
    "⚠️  DATABASE_URL is not configured — API routes will fail but the UI will load.",
  );
}

// Create pool even with a dummy URL — routes will error gracefully at query time
export const pool = new Pool({ connectionString: dbUrl || "postgres://localhost:5432/paid_refer_dev" });
export const db = drizzle({ client: pool, schema });