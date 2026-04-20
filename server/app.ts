import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { apiLimiter, authLimiter } from "./middleware/rateLimit";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Sentry handlers — loaded dynamically only when configured
let Sentry: any = null;
if (process.env.SENTRY_DSN) {
  (async () => {
    try {
      Sentry = await import("@sentry/node");
      app.use(Sentry.Handlers.requestHandler());
      app.use(Sentry.Handlers.tracingHandler());
    } catch {
      // @sentry/node not installed — skip
    }
  })();
}

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
if (Sentry) {
  app.use(Sentry.Handlers.errorHandler());
}
app.use(errorHandler);

export default app;

