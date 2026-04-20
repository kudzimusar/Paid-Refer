# 🏗️ Refer — Full UI Implementation Prompt

> Hand this document to your developer or AI assistant.
> The full design specification lives in `design.md` at the project root.
> All decisions, flows, components, and visual direction are already resolved there.

---

## Your Mission

You are building the **complete premium UI** for **Refer** — a three-sided AI-powered real estate referral marketplace. The full specification is documented in `design.md`. Read it entirely before writing a single line of code.

This is not a minimum viable product. Every screen must be **premium, polished, and production-ready** from day one. Reference apps for the quality bar: **Robinhood**, **Stripe Dashboard**, **Wise**, **Suumo (Japan)**.

---

## Tech Stack (Do Not Change)

- **Framework:** React 18 + TypeScript (Vite)
- **Routing:** Wouter
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** TanStack Query (React Query)
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **Auth:** Firebase (already wired — do not change)
- **Font:** Add **Inter** from Google Fonts to `index.html`

---

## Implementation Order (Follow This Exactly)

Work through these phases in order. Do not skip ahead.

### Phase 1 — Design System Foundation

**Start here before touching any page.**

1. **`client/src/index.css`** — Update with the complete design token system from `design.md §11`:
   - CSS custom properties: `--primary`, `--accent`, `--background`, `--card`, `--border`, `--gradient-primary`, etc.
   - Utility classes: `.glass-card`, `.premium-card`, `.gradient-text`, `.gradient-bg`
   - Animation keyframes: `fadeIn`, `slideUp`, `countUp`
   - Safe area utilities: `.pt-safe-top`, `.pb-safe-bottom`

2. **`client/src/index.html`** — Add Inter font:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
   ```
   Update `<body>` to use `font-family: 'Inter', sans-serif`.

3. **Build these shared components first** (used everywhere):

   | Component | File | Spec |
   |---|---|---|
   | `BottomNav` | `components/layout/BottomNav.tsx` | Fixed bottom 4–5 tab bar; role-aware tabs — see `design.md §8` |
   | `PageHeader` | `components/layout/PageHeader.tsx` | Sticky top bar: back arrow + title + optional right action |
   | `SectionTitle` | `components/layout/SectionTitle.tsx` | `h3 font-semibold` + optional "See all" link on right |
   | `ChipSelector` | `components/ui/ChipSelector.tsx` | Reusable multi-select chip grid with toggle state |
   | `OTPInput` | `components/ui/OTPInput.tsx` | 6-box segmented OTP input |
   | `CountUpNumber` | `components/ui/CountUpNumber.tsx` | Animates 0 → N over 0.6s using Framer Motion |
   | `StatusBadge` | `components/ui/StatusBadge.tsx` | Semantic colored badge: active/pending/completed/failed/expired |
   | `EmptyState` | `components/ui/EmptyState.tsx` | Icon + headline + body + optional CTA — used on all empty screens |
   | `DashboardSkeleton` | `components/ui/DashboardSkeleton.tsx` | Pulse skeleton at exact card sizes for each dashboard type |
   | `AvatarInitials` | `components/ui/AvatarInitials.tsx` | Circle avatar: photo if available, else uppercase 2-char initials on colored bg |

---

### Phase 2 — Public / Auth Screens

#### 2A. Splash Screen (`/`) — **`pages/splash.tsx`** (rebuild)

Reference: `design.md §3.1`

- Full-screen blue→purple gradient background (`--gradient-primary`)
- Center-mounted animated logo: `Building2` icon in white rounded-3xl square + green `Handshake` dot badge (bottom-right)
- Logo animation: **Framer Motion spring** `stiffness: 200, damping: 15` — scale 0→1 + rotate -180→0
- App name `"Refer"` in `text-4xl font-bold text-white`
- Tagline: role-aware or generic `"Find Your Perfect Home"`
- 3 glassmorphism feature cards in a row (use `.glass-card`): "Verified Agents", "AI Matching", "Easy Refer" — stagger fade-in at 0.3s, 0.4s, 0.5s delays
- If on `github.io` hostname → show `PremiumBadge` "Demo Environment" at top
- Primary CTA: "Get Started" — white button, `text-blue-600`, `h-14 rounded-2xl`
- Secondary CTA: "Already have an account? Sign In" — ghost button, `text-white`
- Footer text: faded `text-white/60`

#### 2B. Login / Auth (`/login`) — **`pages/auth.tsx`** (rebuild)

- Clean white card centered on a soft gradient background
- Tabs: "Phone Number" (primary for ZW/ZA) | "Email" (primary for JP)
- Phone tab: Country code dropdown with flag emojis + phone number input + "Send OTP" button
- OTP step: `OTPInput` 6-box component + 60-second countdown resend link
- Email tab: email + password inputs + "Sign In" button
- "Or continue with Google" separator + Google sign-in pill button
- Below form: "Don't have an account? Register" link
- Error state: red inline banner (not just toast) so error is visible without dismissing

#### 2C. Role Selection (`/register`) — **`pages/role-selection.tsx`** (rebuild)

- Page heading: "How will you use Refer?" + sub "Select your role to get started"
- 4 role cards in a responsive grid (`grid-cols-1 sm:grid-cols-2`):
  - **Customer** (blue-500 icon bg): "Find a Home", features: Browse requests, AI match, Real-time chat
  - **Agent** (green-500): "Real Estate Agent", features: Manage leads, Kanban pipeline, Performance stats
  - **Referrer** (purple-500): "Earn Referrals", features: Generate links, Track conversions, Earn commissions
  - **Admin** (red-500): "Administrator", features: User management, Verification queue, Platform settings
- Each card: `hover:shadow-lg hover:border-primary transition-all` + check icon appears on select
- Selected card: `ring-2 ring-blue-500 bg-blue-50/50`
- "Already have an account? Sign in" below grid

#### 2D. Onboarding Flow (`/register/:role`) — **`pages/onboarding.tsx`** (rebuild heavily)

This is a 3-step wizard. Reference: `design.md §3.1`.

**Step bar:** Blue progress bar `h-2 rounded-full` — fills proportionally. Back button (ghost) + "Step N of M" right-aligned.

**Step 1 — Role selection** (if coming fresh): same as role selection page but in wizard context.

**Step 2 — Contact Details:**
- Grid: first name + last name in 2-col row
- Middle name (optional), full width
- Email with `Mail` icon prefix
- Phone: country code `<Select>` (flag + code) + number input with `Phone` icon
- Contact method: 2×2 grid of tiles — Email / Phone Call / WhatsApp / LINE — tap to select, selected tile gets `border-blue-500 bg-blue-50`
- Conditional: if LINE selected → `motion.div` animated-in LINE ID field; if WhatsApp → WhatsApp number field
- "Continue →" primary button, full width, `h-12`

**Step 3a — Agent Profile:**
- License number input
- Scrollable 2-col checkbox grid for areas (Shibuya, Shinjuku, etc.) in a `max-h-48 overflow-y-auto` container
- Property type pills (toggle chips, selected = `bg-blue-600 text-white`)
- Language pills (toggle chips, selected = `bg-green-600 text-white`)
- Specialization pills (toggle chips, selected = `bg-purple-600 text-white`)
- "Complete Profile" button, full width, `h-12`

**Step 3b — Referrer Payment Setup:**
- 3 option cards (Bank / E-wallet / Crypto) — tap to select style
- Conditional: Bank → bank name + account number inputs; E-wallet → provider + account ID; Crypto → wallet address
- "Finish Setup" button

**Completion screen (step 4):**
- White card centered on gradient background
- Animated ring: Framer Motion circle scale 0→1 + opacity + green fill
- "🎉 You're all set, {firstName}!"
- Role summary: "You joined as a {role} on Refer"
- "Go to My Dashboard" primary button

---

### Phase 3 — Customer Experience

#### 3A. Customer Dashboard (`/search`) — **`pages/customer-dashboard.tsx`** (rebuild)

Reference: `design.md §3.3, §6`

**Header:** "My Request" + "Track your apartment search" sub-label + settings gear (right).

**If no active request:**
- `EmptyState` component: `Search` icon + "You don't have an active search" + "Start a Search" CTA button → `/customer-form`

**If active request:**
- `"ACTIVE REQUEST"` badge with pulsing green dot (`animate-pulse`)
- Summary gradient card: property type + areas + budget range (`¥X – ¥X/mo`) + move-in date
- **Stats bar** (`grid grid-cols-3 gap-3`): `StatsCard` × 3 — "Agents notified", "Viewed request", "Interested agents" with `CountUpNumber` on values

**Interested Agents section:**
- Section title: "Interested Agents" (with count badge)
- Agent card per matched lead:
  - `AvatarInitials` circle (40×40 colored by `agentId` hash)
  - Agent name (masked: "Agent T***i") + "Verified" green shield badge
  - Match score: `{Math.round(matchScore * 100)}%` — colored by threshold (§6 data mapping)
  - AI summary: 1-2 lines italic gray text
  - Row of 2 buttons: "💬 Chat" (primary) + phone icon (outline)
- Each card has `hover:shadow-md transition-shadow`

**Quick Actions grid** (2-col): "Edit Request" card + "My Messages" card

#### 3B. Customer Request Form — **`pages/customer-form.tsx`** (rebuild as 3-step wizard)

Reference: `design.md §3.3`

- **Step progress bar** at top
- **Step 1 — Property Basics:**
  - Country selector (ZW / ZA / JP) with flags → drives property type list below
  - City freetext + Areas multi-select `ChipSelector`
  - Property type `ChipSelector` (options filtered by country)
  - Bedrooms counter (− / N / +)
- **Step 2 — Budget & Timing:**
  - Budget min/max inputs (side by side) with currency symbol auto-set from country
  - Move-in date picker (styled input type="date")
  - Occupants counter
- **Step 3 — Requirements:**
  - Must-have features `ChipSelector`: Parking, Pet-friendly, Furnished, Balcony, AC, Internet, Garden, Pool
  - Additional notes `Textarea`
- **Submission:** "Find My Agent" full-width primary button `h-14`
- **Success state:** Full-page success card: "You're in! Matching you with agents now." + estimated match time + CTA to dashboard

#### 3C. Chat Page (`/search/chat/:id`) — **`pages/chat.tsx`** + `ChatInterface` (rebuild)

- **Conversations list view** (when no `:id`):
  - Header: back arrow + "Messages" title
  - Each conversation row: avatar + name + last message preview + timestamp + unread dot
  - Empty: `EmptyState` with `MessageCircle` icon

- **Chat thread view** (when `:id` provided):
  - Sticky header: back arrow + agent/customer name + "Verified" badge + online dot
  - `WhatsAppWindowBadge` (if agent view): "WhatsApp open — 18h 23m left" amber chip
  - Message list: scrollable, messages grouped by date separator
  - **Sent bubble:** right-aligned, `bg-primary text-white`, rounded `rounded-2xl rounded-br-sm`
  - **Received bubble:** left-aligned, `bg-gray-100 text-neutral-900`, rounded `rounded-2xl rounded-bl-sm`
  - Timestamp below each bubble in `text-xs text-neutral-400`
  - Typing indicator: 3 animated dots when other party is typing
  - **Input bar** (fixed bottom, above bottom nav): text input + send button + file attach icon
  - AI response suggestion button (agent only): "✨ Suggest reply" → loads AI suggestion into input

---

### Phase 4 — Agent Experience

#### 4A. Agent Dashboard (`/dashboard`) — **`pages/agent-dashboard.tsx`** (rebuild)

Reference: `design.md §3.2`

**Header:**
- "Agent Portal" title + "Manage leads and clients" sub
- Right: green "Online" dot + status label + settings gear

**Stats bar** (`grid-cols-3 gap-3`): `StatsCard` × 3 — New Leads / Active Chats / Notifications — with `CountUpNumber`

**If `!user.isVerified`:** Amber verification banner (`bg-amber-50 border-amber-200`):
- Shield icon + "Get Verified — Unlock Premium Leads" + "Verify Now" button → `/agent/verify`
- Large faded shield watermark in background (opacity-10)

**Subscription warning** (if `subscriptionStatus = 'grace_period'`): Amber top banner with countdown days.

**Subscription lockout** (if `subscriptionStatus = 'suspended'`): Full-screen red lockout card with "Renew Now" CTA.

**New Leads alert card** (if `newLeads.length > 0`): Gradient border-l-4 card with bell icon + count + "Review" button.

**Priority Leads section:**
- First 3 pending leads as cards
- Each card: masked customer (see §15 decision #7 — use masked name), AI summary block (gray bg card), match score badge, urgency badge (`LeadScoreBadge`), timestamp, "Accept Lead" + eye icon buttons
- Empty: informational empty card

**Active Deals section** (if `activeLeads.length > 0`):
- Lead card with status badge, last contact date, "View Details" + "Chat" buttons

#### 4B. Agent Lead Kanban Dashboard (`/dashboard/leads`) — **`pages/AgentLeadDashboard.tsx`** (rebuild)

Reference: `design.md §3.2, §5`

This is the most complex agent screen. Build it as a proper Kanban board.

**Top bar:** "Lead Management" title + active lead count subtitle + "↺ Refresh" link (right).

**`LeadStatsBar`:** 5 tiles in a row (scrollable on mobile): New / In Progress / Closed / Lost / Total — all using `CountUpNumber`.

**`LeadFilterBar`:** Search input + status filter pills + urgency filter + country flag filter.

**3 Kanban columns** (equal width on desktop; stacked on mobile):
- 🟠 **New Leads** — orange dot
- 🔵 **In Progress** — blue dot
- 🟢 **Closed & Lost** — green/gray dots mixed

**Each column:** header (dot + title + count badge) + card list + dashed empty state if empty.

**`LeadCard` (the most important component):**
- Top row: masked customer name (bold) + `LeadScoreBadge` (urgency tag) + match score chip
- Second row: property type chip + area chip + budget range
- Third row: AI summary (1 line, italic, gray, truncated) — tap to expand
- `ExpiryCountdown` timer (if status = pending) — turns red when <2h
- USSD badge: "📱 Via USSD" if source = 'ussd'
- Action row: "Accept" (primary) + "Decline" (outline destructive) — for New; "Chat" + "Close Deal" — for In Progress
- `LeadActionMenu` (⋮ kebab): more options
- Hover: `hover:shadow-lg hover:-translate-y-0.5 transition-all`

**`LeadDetailPanel`** (slide-in from right on desktop, bottom sheet on mobile):
- Customer info: masked name, property type, areas, budget, move-in, occupants, features, notes
- AI Intelligence section: Gemini score / urgency tag / est. close timeline / budget realism / Gemini reasoning (expandable)
- Market context chip (if available)
- Action buttons: Accept / Chat / Close / Decline

**`ChatDrawer`** (slide up from bottom-right):
- Contained within the lead dashboard — doesn't navigate away
- Shows `ChatInterface` in a half-screen drawer
- Dismiss: tap backdrop or X button

#### 4C. Agent Verification (`/agent/verify`) — **`pages/verify-agent.tsx`** (rebuild)

Reference: `design.md §3.5, §12.8`

- Centered card on neutral-50 background, `max-w-md mx-auto`
- Hero: blue shield icon in `bg-primary/10 rounded-2xl` square
- Title: "Get Verified. Get Better Leads."
- Sub: "Refer AI uses Gemini 2.5 Flash to verify your real estate license"
- 3 trust badges in a row: "Bank-grade security" · "~60 seconds" · "Docs deleted after"
- **Upload zone** (`glass-morphism` card):
  - Title + description for document type required
  - Dashed upload area: `border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer`
  - Default: upload icon + "Tap to upload your license photo" + "JPG, PNG, or PDF · Max 5MB"
  - File selected: full image preview in `aspect-[4/3] rounded-xl overflow-hidden` with "Click to Change" hover overlay
- Checklist: 2 green `CheckCircle2` items ("Text must be clearly visible", "No blurry edges or glare")
- "Verify with AI" button (`h-12 rounded-xl text-lg font-semibold`):
  - Disabled if no file selected
  - Loading: `Loader2` spin icon + "AI Analyzing..."
- **Result states:**
  - Success: full green checkmark animation + "Verification Successful" + redirect
  - Under Review: amber card + "Your document is being reviewed by our team (24h)"
  - Failed: red card + AI reasoning message + "Try Again with a clearer photo"
- Footer: `text-[10px] uppercase tracking-widest text-neutral-400` — "Secure bank-grade · Google Cloud Vertex AI"

#### 4D. Property Listings (`/dashboard/listings`) — **Build New**

Reference: `design.md §12.2`

**List view:**
- Header: "My Listings" + "Add Listing" button (top right)
- Filter tabs: All / Active / Draft / Rented / Sold
- Responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- `PropertyCard`: cover photo (`aspect-[4/3] object-cover`) + AI quality badge (top-right corner, circular 0–100) + property type chip + price formatted by locale + area + status badge + "Edit" / "View" actions
- Empty state: `EmptyState` with `Building` icon + "Add Your First Listing" CTA

**Add Listing (`/dashboard/listings/new`) — 4-step wizard:**

Step 1 — Basics: Country → City + District → Property type (by country) → Title (text) → Description (textarea)

Step 2 — Details: Price + currency + priceType (dropdown: monthly/purchase) → Bedrooms (counter) → Bathrooms (decimal: 1 / 1.5 / 2 / etc.) → Size in sqm → Floor → Total floors → Amenities (`ChipSelector`: Parking, AC, Balcony, Gym, Pool, Pet-friendly, Furnished, Storage, Roof access, Near transport)

Step 3 — Photos (multi-upload, max 5):
- Photo upload zone with drag-and-drop
- Each uploaded photo gets AI analysis:
  - Processing: "Analyzing photo..." skeleton
  - Passed: `AIQualityBadge` score (e.g., "87/100") + detected amenities chips
  - Rejected (<30 score): red border + rejection reason + `agentAdvice` copy + "Replace Photo" button
- Reorder photos by dragging (or up/down arrows on mobile)

Step 4 — Review & Publish: Summary card with all entered details → "Publish Listing" (primary) or "Save as Draft" (secondary)

#### 4E. Agent Settings — Payments (`/dashboard/settings/payments`) — **Build New**

Reference: `design.md §12.5`

**Section 1 — Current Plan:**
- Plan name badge (Starter / Professional / Premium)
- Renewal date + "Manage Plan" button → Stripe portal or in-app upgrade modal

**Plan Upgrade Modal** (triggered by "Manage Plan" / "Upgrade"):
- 3-column plan comparison table:
  - Plan name + country-specific price
  - Lead limit per month
  - AI Verification included?
  - Priority matching?
- Current plan highlighted with border
- "Upgrade to {Plan}" CTA per column
- Payment method based on user's country (Stripe for ZA/JP, Paynow for ZW)

**Section 2 — Connect Bank (Stripe Connect):**
- Status card: Not Connected → "Connect Your Bank" button → `POST /api/payments/connect/start` → redirect to Stripe onboarding URL
- Connected: "✓ Connected" green badge + bank name + "View Stripe Dashboard" link → `GET /api/payments/connect/dashboard-link`
- Issues: amber "Action Required" badge + requirements list

**Section 3 — Payment History:**
- Table: Date / Type / Amount / Status badge / Receipt link

---

### Phase 5 — Referrer Experience

#### 5A. Referrer Hub (`/refer`) — **`pages/referrer-dashboard.tsx`** (rebuild)

Reference: `design.md §3.4`

**Header:**
- "Referrer Hub" title + "Share links, earn rewards" sub
- Right: available balance in `text-2xl font-bold text-emerald-600` with `CountUpNumber`

**Stats bar** (`grid-cols-3`): Active Links / Total Clicks / Conversions — `StatsCard` × 3

**Generate Referral Link card** (gradient `from-primary/5 to-accent/5`):
- Expanded form (animated with `motion.div height transition`):
  - Request Type dropdown
  - Target Area freetext
  - Apartment type dropdown (optional)
  - Notes textarea (optional — AI uses for promo copy)
  - "Generate AI Link" full-width button with `Sparkles` icon
- After generation: show AI-generated promo copy snippet with "Copy promo text" button

**Recent Links section:**
- Each link card:
  - Link URL: `refer.app/r/{shortCode}` in `font-mono bg-neutral-100 px-2 py-1 rounded text-sm`
  - Active/Inactive badge
  - Stats row: Clicks: N · Conversions: N · Earned: $X.XX
  - Action row: `Copy` icon button + `Share` icon button (native Web Share API)
  - Expandable: "AI wrote this promo copy for you →" collapsible section
- Empty: `EmptyState` with `Link2` icon

**Earnings & Rewards card:**
- 3 rows: Available (`text-emerald-600 font-bold text-xl`) / Pending (`text-amber-500`) / Total Earned (`text-neutral-600`)
- "Request Payout" primary button (disabled if below threshold)
- Minimum payout label: `text-xs text-neutral-500 text-center`

**Payout Request Modal:**
- Amount input (pre-filled, editable)
- Method display: "Via {Bank Transfer | E-wallet | Crypto}" + last-4 / provider name
- "Confirm Payout" button
- Success state: "Payout requested! Expected: 1–3 business days."

#### 5B. Payout History (`/refer/payouts`) — **Build New**

- Page header: "My Earnings"
- Summary card: Lifetime earned / Available now / Pending
- Timeline list of `paymentTransactions`:
  - Each row: Date / Amount / Method icon / Status badge / Receipt link
  - Grouped by month with month separator labels
- Empty: `EmptyState`

---

### Phase 6 — Admin Console

Reference: `design.md §3.7, §12.1`

Admin uses a **sidebar layout** (not bottom nav). Desktop-first. Sidebar: 240px wide, collapses to icon-only on md.

**Sidebar nav items:** Overview · Users · Verify Queue · Payouts · Settings

#### 6A. Admin Home (`/admin`)
- 4 KPI tiles: New Users This Week / Agents Pending Verification / Payouts Awaiting / Open Reports
- 3 quick action cards: "Review Verifications" / "Approve Payouts" / "Manage Users"
- Platform health status bar (from `/internal/api/system-health`)

#### 6B. Users (`/admin/users`)
- Filterable/searchable table:
  - Columns: Avatar + Name / Role badge / Country flag / Subscription status / Last Active / Actions dropdown
  - Filter bar: All Roles / Countries / Status tabs
- Row tap opens `UserDetailModal`:
  - Profile summary card
  - Activity log (last 10 actions from notifications)
  - Action buttons: Suspend / Change Role / Manually Verify / Send Notification

#### 6C. Verification Queue (`/admin/verify`)
- List ordered by submission date ASC
- Each row: agent name + country flag + Gemini confidence score + submission date + Review button
- `VerificationCard` modal:
  - Document image (full preview)
  - Extracted fields: License # / Expiry / Issuing Authority / AI confidence
  - "Approve" button (green) / "Reject" button (red → input rejection reason → confirm)
  - On approve: agent gets push notification + isVerified = true

#### 6D. Payout Approvals (`/admin/payouts`)
- List sorted by amount DESC
- Each row: referrer name + amount + method + date + "Review" button
- `PayoutApprovalModal`:
  - Referrer profile summary
  - Bank/wallet details
  - Past payout history
  - "Approve" / "Flag for Review" actions

#### 6E. Platform Settings (`/admin/settings`)
- Subscription pricing (per country, editable)
- Feature flags (toggles): AI Verification required / USSD enabled / Market Intelligence
- Minimum payout thresholds

---

### Phase 7 — Referral Landing Page (`/r/:shortCode`)

Reference: `design.md §12.3`

This is the public conversion page customers land on from a referral link. It must be fast, clean, and conversion-focused.

- **Load:** `GET /api/r/:shortCode` → fetch link metadata (targetArea, propertyType, country)
- **Hero section:** Gradient dark-blue header + platform logo + dynamic headline: "Find Your {propertyType} in {targetArea}" (pre-filled from link)
- **Trust strip:** "500+ verified agents" · "AI-powered matching" · "Free to sign up"
- **Quick request form** (3 fields only):
  - Budget range: min/max (pre-filled currency by targetCountry)
  - Area: pre-filled from link's targetArea, editable
  - Property type: pre-filled, dropdown
  - "Find My Agent" CTA button — large, full-width, `h-14`
  - On submit: `POST /api/customer/request` with `referralCode = shortCode`
- **How It Works:** 3 steps: Submit → Match → Move In (icon + title + 1-line desc)
- **Footer:** "Referred by a trusted member of the Refer network" — no referrer name shown
- **After submit:** Success card: "You're in! We're matching you with verified agents in {area}."

---

## Global Rules — Non-Negotiable

### Visual Quality

1. **No default browser styles.** Every element must be explicitly styled.
2. **Inter font everywhere.** Loaded from Google Fonts. Not system-ui fallback.
3. **No generic gray buttons.** Buttons use semantic colors from the token system.
4. **All cards use `border-radius: 1rem` minimum.** No square cards.
5. **Every interactive element has a hover state.** Cards lift (`translate-y-0.5`), buttons darken.
6. **Touch targets ≥ 44px.** CTA buttons minimum `h-12` (48px). Cards minimum `p-4`.
7. **Bottom nav clearance:** All authenticated page content has `pb-20` (80px).
8. **Loading states are never missing.** Every data-dependent section must have a skeleton.
9. **Empty states are never missing.** Every list/section must have an `EmptyState` fallback.
10. **Animations use Framer Motion.** Not raw CSS animation on complex elements.

### Code Quality

1. **TypeScript strict.** No `any` types without a comment explaining why.
2. **All data fetching uses TanStack Query.** No raw `fetch` calls in components.
3. **All forms use React Hook Form + Zod.** No uncontrolled inputs.
4. **API calls use `apiRequest` from `lib/queryClient.ts`.** Not raw fetch.
5. **All mutations invalidate their queryKey** on success.
6. **Mobile first.** Write `sm:`, `md:`, `lg:` modifiers — never assume desktop.
7. **All new routes must go through the `ProtectedRoute` wrapper** in `App.tsx` with correct role array.

### Data Rules

1. **`customerId = null` (USSD leads) must never crash.** Always use optional chaining + fallback display.
2. **AsyncScore fields (geminiScore, matchScore) may be null.** Show "Scoring..." if null — never show 0% or NaN.
3. **Prices/amounts always formatted by locale.** Use `Intl.NumberFormat` with correct currency.
4. **Dates always relative for recent items** (< 7 days): "2 hours ago", "Yesterday". Absolute format for older.
5. **Match score displayed as %:** `Math.round((lead.matchScore || 0) * 100)%` — never raw decimal.

### Multi-Region Rules

1. **Property type lists filter by country.** ZW types ≠ ZA types ≠ JP types.
2. **Contact method defaults by country:** JP → LINE first; ZW/ZA → WhatsApp first.
3. **Currency by country:** ZW → USD, ZA → ZAR, JP → JPY. Use symbol, not code.
4. **Paynow shown only for ZW users.** Stripe Connect for ZA/JP.

---

## File Structure (New Files to Create)

```
client/src/
├── components/
│   ├── layout/
│   │   ├── BottomNav.tsx          ← NEW
│   │   ├── PageHeader.tsx         ← NEW
│   │   ├── SectionTitle.tsx       ← NEW
│   │   └── AdminSidebar.tsx       ← NEW
│   ├── ui/
│   │   ├── ChipSelector.tsx       ← NEW
│   │   ├── OTPInput.tsx           ← NEW
│   │   ├── CountUpNumber.tsx      ← NEW
│   │   ├── StatusBadge.tsx        ← NEW
│   │   ├── EmptyState.tsx         ← NEW
│   │   ├── DashboardSkeleton.tsx  ← NEW
│   │   ├── AvatarInitials.tsx     ← NEW
│   │   ├── WhatsAppWindowBadge.tsx ← NEW
│   │   └── ReviewPromptCard.tsx   ← NEW
│   ├── property/
│   │   ├── PropertyCard.tsx       ← NEW
│   │   ├── PropertyPhotoGrid.tsx  ← NEW
│   │   ├── AIQualityBadge.tsx     ← NEW
│   │   └── PhotoUploadZone.tsx    ← NEW
│   └── admin/
│       ├── AdminStatsTile.tsx     ← NEW
│       ├── UserTable.tsx          ← NEW
│       ├── VerificationCard.tsx   ← NEW
│       └── PayoutApprovalCard.tsx ← NEW
└── pages/
    ├── referral-landing.tsx       ← NEW  (/r/:shortCode)
    ├── customer-form.tsx          ← REBUILD as multi-step
    ├── review.tsx                 ← NEW  (/review/:leadId)
    ├── dashboard/
    │   ├── settings-payments.tsx  ← NEW
    │   ├── listings.tsx           ← NEW
    │   ├── listings-new.tsx       ← NEW
    │   └── performance.tsx        ← NEW
    ├── refer/
    │   ├── link-detail.tsx        ← NEW
    │   └── payouts.tsx            ← NEW
    └── admin/
        ├── index.tsx              ← NEW
        ├── users.tsx              ← NEW
        ├── verify.tsx             ← NEW
        ├── payouts.tsx            ← NEW
        └── settings.tsx           ← NEW
```

---

## API Reference (Already Built — Use These)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/auth/user` | Current user + profile |
| POST | `/api/auth/set-role` | Set user role during onboarding |
| PUT | `/api/auth/contact-details` | Save contact details |
| POST | `/api/auth/complete-onboarding` | Finalize onboarding |
| GET | `/api/agent/leads` | All leads for current agent |
| PATCH | `/api/agent/lead/:leadId` | Update lead status |
| POST | `/api/agent/verify-document` | Upload doc for AI verification (FormData) |
| GET | `/api/agent/properties` | Agent's property listings |
| POST | `/api/agent/property` | Create a new property listing |
| POST | `/api/properties/:id/photos` | Upload property photos (multi-file) |
| GET | `/api/customer/requests` | Customer's submitted requests |
| GET | `/api/customer/leads` | Agents matched to customer |
| POST | `/api/customer/request` | Submit new property request |
| POST | `/api/customer/submit-feedback` | Submit rating after deal |
| GET | `/api/referrer/links` | All referral links for user |
| POST | `/api/referrer/link` | Create new referral link |
| GET | `/api/conversations` | All conversations for user |
| GET | `/api/conversation/:id/messages` | Messages in a conversation |
| POST | `/api/conversation/:id/message` | Send a message |
| GET | `/api/notifications` | All notifications for user |
| PATCH | `/api/notifications/:id/read` | Mark notification read |
| GET | `/api/r/:shortCode` | Get referral link by shortCode (public) |
| POST | `/api/payments/connect/start` | Start Stripe Connect onboarding |
| GET | `/api/payments/connect/status` | Get Stripe Connect status |
| GET | `/api/payments/connect/dashboard-link` | Get Stripe dashboard URL |
| POST | `/api/payments/paynow/initiate` | Start Paynow payment (ZW) |
| GET | `/api/ai/market-insights` | Generate market insights |

---

## Definition of Done

A screen is **done** when:

- [ ] It matches the spec in `design.md` structurally and visually
- [ ] All loading states are implemented (skeleton/spinner)
- [ ] All empty states are implemented (`EmptyState` component)
- [ ] All error states are handled (toast + optional inline)
- [ ] All mutations use `useMutation` with `onSuccess` query invalidation
- [ ] All data fields render per the Data → UI Mapping in `design.md §6`
- [ ] Null/undefined fields are handled gracefully (no crashes)
- [ ] Mobile layout is correct (paddings, touch targets, bottom nav clearance)
- [ ] Animations are implemented per `design.md §11` micro-animation spec
- [ ] Role-based access guard is applied to the route in `App.tsx`
- [ ] TypeScript has no `any` without justification

---

Begin with **Phase 1** (design system) and do not move to Phase 2 until all shared components are built. 
The quality bar is: **if it looks like a default shadcn app, it is not done.**
