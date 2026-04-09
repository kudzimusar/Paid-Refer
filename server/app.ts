import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { apiLimiter, authLimiter } from "./middleware/rateLimit";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// ── SECURITY ──────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // handled by Firebase Hosting
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: [
    process.env.APP_BASE_URL || "http://localhost:5173",
    "http://localhost:5173",  // Vite dev
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));

// ── BODY PARSING ──────────────────────────────────────────────────
// Stripe webhook MUST receive raw body — register before json parser
app.use("/webhooks/stripe", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// ── RATE LIMITING ─────────────────────────────────────────────────
app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);

// ── REQUEST ID ────────────────────────────────────────────────────
app.use((req, res, next) => {
  req.headers["x-request-id"] =
    (req.headers["x-request-id"] as string) || crypto.randomUUID();
  next();
});

// ── HEALTH CHECK (GCP Cloud Run requires this) ────────────────────
app.get("/health", (req, res) => res.json({ status: "ok", ts: Date.now() }));

// ── ERROR HANDLER (must be last) ─────────────────────────────────
// Note: This should be added AFTER routes in index.ts or here if we don't use registerRoutes pattern
// But since the user wants it here, I'll put it, but in Express error handlers must be last.

export default app;
