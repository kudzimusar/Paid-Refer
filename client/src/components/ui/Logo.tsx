/**
 * Refer Brand Logo Components
 * Single source of truth for all logo usage across the app.
 * Always import from here — never use ad-hoc Building2 icons as logo substitutes.
 */

import { cn } from "@/lib/utils";

// ── Logo image paths (relative to /public) ──────────────────
export const LOGO_PATHS = {
  /** Full app icon with white card background — for splash, marketing, light backgrounds */
  main:      "/brand/logo-main.png",
  /** Icon only on dark background — for splash gradient, dark UIs */
  dark:      "/brand/logo-dark.png",
  /** Horizontal wordmark (icon + "Refer" text) — for headers, emails */
  wordmark:  "/brand/logo-wordmark.png",
  /** OG banner — for social sharing, PWA screenshots */
  ogBanner:  "/brand/og-banner.png",
} as const;

// ── Size presets ─────────────────────────────────────────────
const SIZE_MAP = {
  xs:   "w-8 h-8",      // 32px — tiny inline use
  sm:   "w-12 h-12",    // 48px — nav headers
  md:   "w-16 h-16",    // 64px — card headers
  lg:   "w-24 h-24",    // 96px — splash, big hero
  xl:   "w-32 h-32",    // 128px — onboarding, marketing
} as const;

// ── App Icon (square, rounded) ───────────────────────────────
interface AppIconProps {
  size?: keyof typeof SIZE_MAP;
  className?: string;
  /** Use the dark (no card) variant — for dark/gradient backgrounds */
  dark?: boolean;
}

export function AppIcon({ size = "lg", dark = false, className }: AppIconProps) {
  return (
    <img
      src={dark ? LOGO_PATHS.dark : LOGO_PATHS.main}
      alt="Refer"
      className={cn(SIZE_MAP[size], "object-contain", className)}
      draggable={false}
    />
  );
}

// ── Wordmark (icon + text, horizontal) ──────────────────────
interface WordmarkProps {
  height?: number; // px
  className?: string;
}

export function Wordmark({ height = 32, className }: WordmarkProps) {
  return (
    <img
      src={LOGO_PATHS.wordmark}
      alt="Refer"
      style={{ height: `${height}px`, width: "auto" }}
      className={cn("object-contain", className)}
      draggable={false}
    />
  );
}

// ── Page Header Logo (compact, nav-ready) ────────────────────
export function NavLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <AppIcon size="xs" />
      <span
        className="font-extrabold text-neutral-900 tracking-tight"
        style={{ fontSize: "1.1rem", letterSpacing: "-0.02em" }}
      >
        Refer
      </span>
    </div>
  );
}

// ── Splash Hero Logo (large, animated wrapper) ───────────────
export function SplashLogo({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <AppIcon size="xl" />
    </div>
  );
}

// ── Favicon-size inline (32×32) ──────────────────────────────
export function FaviconLogo() {
  return (
    <img
      src={LOGO_PATHS.main}
      alt="Refer"
      width={32}
      height={32}
      className="object-contain rounded-lg"
      draggable={false}
    />
  );
}
