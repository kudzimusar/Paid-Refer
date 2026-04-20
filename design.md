# Refer — Premium Design Specification v2.0

> **Version:** 2.0 · **Date:** 2026-04-09 · **Status:** Living Document — Enhanced with Expert Recommendations

---

## 1. Product Definition (Scope Lock)

### What We Are Building

**Refer** is a three-sided, AI-powered real estate referral marketplace connecting property seekers (**customers**) with licensed agents (**agents**) through a network of digital promoters (**referrers**) — operating initially across Zimbabwe (ZW), South Africa (ZA), and Japan (JP).

**Core value proposition:**
- For customers: Get matched with a verified local agent in minutes, not days.
- For agents: Receive AI-qualified, high-intent leads without cold calling.
- For referrers: Earn passive income simply by sharing a link.

**Primary flow:** Customer submits request → Gemini AI scores the lead (0–100) → Best-matched verified agent receives it → Agent accepts → Chat begins → Deal closes → Referrer earns commission.

### In Scope (Current Build — v1)

| Area | Included |
|---|---|
| Onboarding | Splash → Role selection → Firebase auth → Contact details → Role-specific profile → Completion screen |
| Authentication | Firebase phone-OTP, email/password |
| Agent Module | Dashboard, Kanban lead management, AI document verification, chat, Stripe Connect subscription |
| Customer Module | Request submission form, active request dashboard, agent match view, real-time chat |
| Referrer Module | Hub dashboard, AI link generation, earnings tracker, payout request |
| Admin Module | User management, agent verification queue, payout approvals (spec below) |
| AI Engine | Gemini 2.5 Flash — lead scoring, document extraction, property photo analysis |
| Payments | Stripe Connect (JP/ZA), Paynow/EcoCash (ZW) |
| Notifications | Firebase push, Brevo WhatsApp, LINE (JP), email, USSD (ZW) |
| USSD Gateway | Africa's Talking multi-level menu for feature-phone users (ZW) |

### Out of Scope (v1 — Hard No)

- Public property search/browse marketplace for customers
- Customer mortgage or credit tools
- Agent-to-agent referrals or sub-agent networks
- In-app property auction or bidding
- In-app property photo carousel browsing by customers
- Admin analytics dashboard with charts (v2)
- Real-time market intelligence UI for agents (v2 — data exists in DB)

---

## 2. User Roles & System Hierarchy

### Role Hierarchy

```
Admin (Level 4 — Platform Operator)
  ├── Agent (Level 3 — Licensed Real Estate Professional)
  ├── Referrer (Level 2 — Affiliate/Digital Promoter)
  └── Customer (Level 1 — Property Seeker)
```

### Role Definitions & Intent

| Role | Trust Level | Motivation | What They Fear |
|---|---|---|---|
| **Customer** | Unverified by default | Moving fast, finding the right place | Wasting time on bad agents |
| **Agent** | Verified via AI + optional manual | Growing client base, earning more commissions | Fake leads, slow platform, payment issues |
| **Referrer** | Self-registered, trusted by usage | Passive income from their network | Not being paid, low conversion rate |
| **Admin** | Maximum — platform operator | Platform health, agent quality control | Fraud, bad actors, compliance breaches |

### Access Boundaries (Complete Matrix)

| Capability | Customer | Agent | Referrer | Admin |
|---|---|---|---|---|
| Submit property request | ✅ | — | — | ✅ |
| View/receive leads | — | ✅ | — | ✅ |
| Accept or decline leads | — | ✅ | — | ✅ |
| Chat with counterpart | ✅ | ✅ | — | — |
| View own inbox messages | ✅ | ✅ | — | — |
| Generate referral links | — | — | ✅ | — |
| View own earnings & balance | — | — | ✅ | — |
| Request payout | — | — | ✅ | — |
| Upload verification documents | — | ✅ | — | — |
| Subscribe to agent plan | — | ✅ | — | — |
| Manage own Stripe Connect | — | ✅ | — | — |
| Post property listings | — | ✅ | — | — |
| Upload property photos | — | ✅ | — | — |
| Leave agent review (1–5 stars) | ✅ | — | — | — |
| View all users | — | — | — | ✅ |
| Approve/reject agent verification | — | — | — | ✅ |
| Approve payout requests | — | — | — | ✅ |
| View all referral earnings | — | — | — | ✅ |
| View market intelligence | — | ✅ (v2) | — | ✅ |
| USSD anonymous lead submission | ✅ (anon) | — | — | ✅ |

### Onboarding Status Machine

```
splash
  → phone_verified
    → role_selection
      → contact_details
        → role_specific   (agents & referrers only; customers skip)
          → verified      (agents only — after AI doc verification)
            → completed
```

**Agent extra gate:** Even after onboarding is `completed`, agents are only shown `isVerified = false` until their document verification passes. Unverified agents CAN see leads but cannot accept them.

---

## 3. Core User Flows (Action Logic)

### 3.1 Onboarding Flow

```
Entry: First app open / cold start URL
  ↓
[Splash Screen — /]
  - Animated logo (spring scale + rotate)
  - Feature pills: "Verified Agents" · "AI Matching" · "Easy Refer"
  - CTA: "Get Started" (primary) + "Already have an account? Sign In" (ghost)
  - If user is logged in + onboarding complete → redirect to role dashboard
  - If user is logged in + onboarding incomplete → resume at onboardingStatus checkpoint
  ↓
[Role Selection — /register]
  - 4 cards: Customer / Agent / Referrer / Admin
  - Each shows: icon, title, description, feature bullets, CTA
  - On tap → store role in localStorage → navigate to /login with role param
  ↓
[Firebase Auth — /login]
  - Phone OTP (primary for ZW/ZA markets)
  - Email + password (primary for JP market)
  - Google Sign-in (all markets)
  - Auth success → Firebase JWT issued → user upserted in DB
  ↓
[Contact Details — step 2/3]
  - Fields: First name*, Middle, Last name*, Email*, Phone* + country code, Preferred contact method*
  - Conditional: LINE ID field shown only if "LINE" selected; WhatsApp number shown only if "WhatsApp"
  - PUT /api/auth/contact-details → onboardingStatus = 'contact_details'
  ↓
[Role-Specific Setup — step 3/3 for agents & referrers]
  - Agent: License number + Areas covered (checkboxes) + Property types (pills) + Languages + Specializations (optional)
  - Referrer: Payment method (Bank Transfer / E-wallet / Crypto) + account details
  - Customer: SKIP — goes straight to completion
  ↓
[Completion Screen — /register/complete]
  - Animated checkmark (confetti or ring animation)
  - Summary card: "Welcome, {firstName}! You're a {role} on Refer."
  - CTA: "Go to My Dashboard"
  → POST /api/auth/complete-onboarding → redirect to role dashboard
```

---

### 3.2 Agent Lead Acceptance Flow

```
Entry: Agent dashboard receives push notification OR opens /dashboard/leads
  ↓
[Lead Inbox — Kanban: "New Leads" column (orange)]
  - Card shows: masked customer name, property type, area, budget range, AI urgency badge, match score %, expiry countdown
  ↓
Agent taps lead card → [Lead Detail Panel slides in from right]
  - Full request details: property type, bedrooms, move-in date, budget, must-haves, AI summary paragraph, Gemini score
  ↓
[Action Menu]
  - "Accept Lead" → PATCH /api/agent/lead/:id { status: 'contacted' }
    → Lead moves to "In Progress" column (blue dot)
    → Conversation auto-created
    → WhatsApp notification sent to customer (Brevo)
    → Agent scoring update triggered
  - "Decline" → { status: 'lost' } → Lead moves to "Closed & Lost" column
  ↓
[Chat opens — ChatDrawer slides from bottom-right]
  - Agent sends first message
  - WebSocket connection established
  ↓
[Deal Closure]
  - "Close Deal" → status = 'deal_closed' → green dot in Closed column
  → n8n commission workflow triggered
  → Agent prompted to confirm: "Has the customer signed/moved in?"
  - "Mark Lost" → status = 'lost' → gray dot in Closed column
```

---

### 3.3 Customer Request → Match Flow

```
Entry: Customer dashboard (no active request) → "Create New Request"
  ↓
[Customer Request Form — /customer-form]
  Step 1 — Property Basics:
    - Country (ZW / ZA / JP) → drives property type list
    - City + Areas (multi-select chips)
    - Property type (filtered by country)
    - Bedrooms
  Step 2 — Budget & Timing:
    - Budget min/max (currency auto-set by country)
    - Move-in date (date picker)
    - Occupants (counter)
  Step 3 — Requirements:
    - Must-have features (chip multi-select: parking, pet-friendly, furnished, etc.)
    - Additional notes (textarea)
  → Submit: POST /api/customer/request
  ↓
System (async, ~30s):
  - Gemini scores lead 0–100
  - urgencyTag assigned (low/medium/high/premium)
  - estimatedCloseTimelineDays calculated
  - Best-matched agents notified (push + WhatsApp)
  ↓
[Customer Dashboard — /search]
  - "ACTIVE REQUEST" pulsing badge
  - Stats bar: Agents notified / Viewed request / Interested agents
  - AI scoring status chip: "Agents being matched..." → "X agents matched"
  ↓
As agents accept leads:
  - Customer sees "Interested Agents" section
  - Each agent card: avatar initials, match score %, AI summary excerpt, chat + phone CTAs
  ↓
Customer selects agent → [Chat opens]
  ↓
Post-deal: Customer sees "Rate Your Agent" prompt (1–5 stars + comment)
  - POST /api/customer/submit-feedback
```

---

### 3.4 Referrer Link → Conversion Flow

```
Entry: Referrer Hub (/refer) — "New Link" button
  ↓
[Link Generation Form — inline expand]
  - Request Type: dropdown (Apartment Rental / House Purchase / Commercial)
  - Target Area: freetext (e.g., "Harare CBD", "Tokyo Shibuya")
  - Apartment Type: optional dropdown (1K, 2LDK, Studio, etc.)
  - Notes: textarea (optional — AI uses this to write promo copy)
  → POST /api/referrer/link
  → AI generates shortCode + generatedCopyEn (AI promo copy)
  ↓
[Link Card in Recent Links]
  - URL: refer.app/r/{shortCode} (monospace, tap-to-copy)
  - Buttons: Copy icon + Share icon (native Web Share API)
  - Stats: Clicks / Conversions / Earned
  ↓
Customer clicks link → lands on [Referral Landing Page — /r/:shortCode]
  → Branded request form with referrer's area/type pre-filled
  → Customer submits → conversion tracked against shortCode
  ↓
[Earnings Update — async]
  - Referrer balance increments when deal closes
  - Push notification: "You earned $15 from a successful referral!"
  ↓
[Payout Request]
  - "Request Payout" button active when balance ≥ threshold ($10 USD / ¥1,000 / R150)
  - Payout method from profile (bank / e-wallet / crypto)
  - Status: pending → processing → paid
  - Push notification at each stage
```

---

### 3.5 Agent AI Document Verification Flow

```
Entry: Agent dashboard amber banner → "Verify Now" → /agent/verify
  ↓
[Identity Verification Screen]
  - Headline: "Get Verified. Get Better Leads."
  - Sub: "Refer AI uses Gemini 2.5 Flash to verify your real estate license"
  - Trust badges: "Bank-grade security" · "Results in ~60 seconds" · "Documents deleted after verification"
  ↓
[Upload Zone — dashed border]
  - Tap/click → file picker: image/* or PDF
  - Max 5MB, supports JPG/PNG/PDF
  - On file select: image preview shown
  - "Click to Change" overlay on hover
  ↓
[Verify with AI — button]
  → POST /api/agent/verify-document (FormData)
  → UI state: spinning loader + "AI Analyzing your document..."
  → Gemini extracts: license number, expiry date, issuing authority, country
  ↓
[Result states]
  Confidence ≥ 0.8 → "Verification Successful" toast → user.isVerified = true → redirect to /dashboard
  Confidence 0.5–0.8 → "Under Review" screen — queued for admin manual check (ETA 24h)
  Confidence < 0.5 → "Verification Failed" — AI reasoning shown ("License text not visible. Try in better light.") → re-upload prompt
  ↓
Admin (for manual_review):
  - Admin sees verification queue with document preview + Gemini's extracted data
  - Admin can "Approve" or "Reject with reason"
  - Agent notified via push on outcome
```

---

### 3.6 Referrer Payout Flow

```
Entry: Referrer Hub → Earnings & Rewards section
  ↓
Balance widget shows: Available / Pending / Lifetime (3 rows)
  "Request Payout" button: enabled if available ≥ country threshold
  Disabled state copy: "Minimum payout: $10.00 USD" / "¥1,000" / "R150"
  ↓
Tap → [Payout Confirmation Modal]
  - Amount (pre-filled, editable up to available balance)
  - Method (from profile — bank / e-wallet / crypto + account preview)
  - "Confirm Payout" button
  ↓
POST /api/referrer/payout
  → paymentTransaction created: status = 'pending'
  → n8n workflow triggered
  ↓
Status transitions (push notified at each):
  pending → processing (within 1 business day)
  processing → paid (bank: 1–3 days; e-wallet: instant; crypto: 1–6h)
  processing → failed → toast with reason + retry (balance not affected)
```

---

### 3.7 Admin — Key Operational Flows

```
[Verify Agent — Manual Review Queue]
  Admin opens /admin/verify
  → List of agents with verificationStatus = 'manual_review'
  → Tap row → Document preview + Gemini extracted fields
  → "Approve" → agentVerification.verificationStatus = 'verified', user.isVerified = true, agent notified
  → "Reject" → modal: enter rejection reason → agent notified

[Approve Payout — Payout Queue]
  Admin opens /admin/payouts
  → List of paymentTransactions with status = 'pending'
  → Review: referrer name, amount, method, bank details
  → "Approve" → triggers n8n transfer workflow
  → "Flag for review" → adds internal note

[User Management]
  Admin opens /admin/users
  → Table: all users with role, status, country, last active
  → Filter: by role / country / subscription status
  → Tap row → User detail: profile info + activity log + action buttons (suspend, change role, verify)
```

---

## 4. Screen Inventory (UI Surface Map)

### Public Screens

| Screen | Route | Status | Purpose |
|---|---|---|---|
| Splash | `/` | ✅ Built | Entry point, animated branding, CTA |
| Landing | `/` | ✅ Built | Marketing version of splash |
| Login / Auth | `/login` | ✅ Built | Firebase phone OTP + email |
| Role Selection | `/register` | ✅ Built | Choose role before signup |
| Onboarding Flow | `/register/:role` | ✅ Built | Multi-step role-specific setup |
| Referral Landing | `/r/:shortCode` | 🔲 Not built | Public request form via referral link |

### Customer Screens

| Screen | Route | Status | Purpose |
|---|---|---|---|
| Customer Dashboard | `/search` | ✅ Built | Active request tracker + agent matches |
| Request Form | `/customer-form` | ✅ Built | Multi-step property request submission |
| Chat | `/search/chat/:id` | ✅ Built | Real-time agent-customer conversation |
| Review Screen | `/review/:leadId` | 🔲 Not built | Post-deal rating of agent |

### Agent Screens

| Screen | Route | Status | Purpose |
|---|---|---|---|
| Agent Home | `/dashboard` | ✅ Built | Stats overview + priority leads + alerts |
| Lead Kanban | `/dashboard/leads` | ✅ Built | Full 3-column Kanban management |
| Property Listings | `/dashboard/listings` | 🔧 Placeholder | Agent's owned property cards |
| Add Listing | `/dashboard/listings/new` | 🔲 Not built | Multi-step listing creation with photo upload |
| AI Verification | `/agent/verify` | ✅ Built | Document upload + AI analysis screen |
| Settings / Payments | `/dashboard/settings/payments` | 🔲 Not built | Stripe Connect onboarding + subscription |
| Performance | `/dashboard/performance` | 🔲 Not built | Agent score, rating, response rate dashboard |
| Chat | `/search/chat/:id` | ✅ Built | Shared with customer role |

### Referrer Screens

| Screen | Route | Status | Purpose |
|---|---|---|---|
| Referrer Hub | `/refer` | ✅ Built | Link generation, stats, earnings widget |
| Link Detail | `/refer/link/:id` | 🔲 Not built | Individual link performance analytics |
| Payout History | `/refer/payouts` | 🔲 Not built | Full transaction timeline |

### Admin Screens

| Screen | Route | Status | Purpose |
|---|---|---|---|
| Admin Home | `/admin` | 🔲 Not built | Quick KPIs + pending action counts |
| User List | `/admin/users` | 🔲 Not built | All users table with filters |
| User Detail | `/admin/users/:id` | 🔲 Not built | Profile + actions for single user |
| Verification Queue | `/admin/verify` | 🔲 Not built | Manual review doc queue |
| Payout Approvals | `/admin/payouts` | 🔲 Not built | Pending payout admin list |
| Platform Settings | `/admin/settings` | 🔲 Not built | Subscription pricing, feature flags |

---

## 5. Component Inventory (Design System Foundation)

### Core Layout

| Component | File | Purpose |
|---|---|---|
| `GradientBackground` | `ui/gradient-background` | Full-page gradient wrapper — white-to-off-white |
| `PremiumCard` | `ui/premium-card` | Glassmorphism card with optional hover lift |
| `PremiumBadge` | `ui/premium-card` | Pill badge — "AI-Powered", "Verified", etc. |
| `StatsCard` | `dashboard/stats-card` | Metric tile: label + big number + color variant |
| `PageHeader` | needs building | Sticky top bar: back arrow, title, action icons |
| `BottomNav` | needs building | Fixed bottom 4-tab navigation per role |
| `SectionTitle` | needs building | Consistent h3 + optional "See all" link in a row |

### Auth

| Component | File | Purpose |
|---|---|---|
| `PhoneLogin` | `auth/PhoneLogin.tsx` | Firebase phone OTP |
| `OTPInput` | needs building | 6-digit segmented OTP input boxes |
| `SocialAuthButton` | needs building | Google sign-in pill button |

### Onboarding

| Component | File | Purpose |
|---|---|---|
| `StepProgressBar` | inline in onboarding.tsx | Blue filled progress bar: step N of M |
| `RoleCard` | inline | Icon + title + desc + arrow — tappable |
| `ChipSelector` | needs building | Reusable multi-select chip grid |
| `ContactMethodPicker` | inline | 2x2 grid of contact method tiles |

### Forms

| Component | File | Purpose |
|---|---|---|
| `AgentSignupForm` | `forms/agent-signup-form.tsx` | Agent license + coverage setup |
| `CustomerRequestForm` | `forms/customer-request-form.tsx` | 3-step property request wizard |
| `ReferrerSignupForm` | `forms/referrer-signup-form.tsx` | Payment method setup |
| `PropertyListingForm` | needs building | Multi-step listing: details + photos + pricing |
| `PayoutRequestModal` | needs building | Payout amount + method confirmation modal |
| `ReviewModal` | needs building | 1–5 star selector + comment textarea |

### Lead Management

| Component | File | Purpose |
|---|---|---|
| `LeadCard` | `leads/LeadCard.tsx` | Full card: score, area, type, budget, urgency, actions |
| `LeadStatsBar` | `leads/LeadStatsBar.tsx` | 5-tile stats: new / active / closed / lost / total |
| `LeadFilterBar` | `leads/LeadFilterBar.tsx` | Status / score / country filters + search |
| `LeadScoreBadge` | `leads/LeadScoreBadge.tsx` | Color-coded: low=gray, medium=yellow, high=red, premium=purple |
| `LeadDetailPanel` | `leads/LeadDetailPanel.tsx` | Right-side slide-in with full request details |
| `ExpiryCountdown` | `leads/ExpiryCountdown.tsx` | Live countdown — red when <2h |
| `LeadActionMenu` | `leads/LeadActionMenu.tsx` | Context menu for lead actions |
| `KanbanColumn` | inline in AgentLeadDashboard | Column with dot + count + dashed empty state |
| `AgentScoreCard` | needs building | Shows response rate, conversion %, rating |

### Chat

| Component | File | Purpose |
|---|---|---|
| `ChatInterface` | `chat/chat-interface.tsx` | Full chat: message list + input + typing indicator |
| `ChatDrawer` | `chat/ChatDrawer.tsx` | Slide-over drawer within lead dashboard |
| `ChatBubble` | needs building | Individual message: sent/received styling |
| `ChatInputBar` | needs building | Text input + send button + file attachment |
| `WhatsAppWindowBadge` | needs building | Shows "WhatsApp window open: Xh Ym left" |

### Property Listings (Needs Building)

| Component | File | Purpose |
|---|---|---|
| `PropertyCard` | needs building | Cover photo, price, type badge, AI quality score, status badge |
| `PropertyPhotoGrid` | needs building | Masonry/grid of uploaded photos with AI quality scores |
| `PropertyStatusPill` | needs building | Active / Draft / Rented / Sold — colored |
| `PhotoUploadZone` | needs building | Drag-and-drop zone; reuses verify-agent upload pattern |
| `AIQualityBadge` | needs building | Circular score badge 0–100; green >70, amber 40–70, red <40 |

### Admin (Needs Building)

| Component | File | Purpose |
|---|---|---|
| `AdminStatsTile` | needs building | KPI tile: metric + change vs last week |
| `UserTable` | needs building | Sortable/filterable table with role badge, status, last active |
| `VerificationCard` | needs building | Document preview + extracted fields + approve/reject actions |
| `PayoutApprovalCard` | needs building | Referrer name, amount, method, approve button |
| `SuspendUserModal` | needs building | Confirmation modal with reason field |

### Shared UI (Shadcn/UI — Active)

`Button`, `Card`, `CardContent`, `CardHeader`, `CardTitle`, `Badge`, `Input`, `Label`, `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`, `Checkbox`, `Textarea`, `Dialog`, `DialogContent`, `Tooltip`, `Toast`, `Toaster`, `Progress`, `Avatar`, `Separator`

### Component States Matrix

| State | How to Show It |
|---|---|
| **Default** | Normal render with live data |
| **Loading** | Skeleton pulse (`animate-pulse` gray rectangles at correct sizes) |
| **Empty** | Centered icon + headline + body + optional CTA inside a card |
| **Error** | Red `bg-red-50 border-red-200` inline banner with retry |
| **Success** | Green toast, auto-dismiss 3s |
| **Disabled** | `opacity-50 pointer-events-none cursor-not-allowed` |
| **Locked** | Blur overlay + lock icon + "Upgrade to unlock" label |
| **Processing** | Spinner in button + disabled + in-progress status badge |

---

## 6. Data → UI Mapping (Critical Layer)

### User Entity → UI

| Field | UI Representation |
|---|---|
| `role` | Route gating; bottom nav variant; header color accent |
| `isVerified` | Green shield badge on dashboard; amber unverified banner |
| `onboardingStatus` | Step progress bar; redirect logic; completion gating |
| `subscriptionStatus` | Header badge: green=Active / amber=Grace Period / red=Suspended |
| `firstName + lastName` | "Welcome, {firstName}!" in header greeting |
| `profileImageUrl` | Circle avatar; fallback = first 2 chars of name, uppercase, on colored bg |
| `preferredContactMethod` | Contact pill selected in UI; shown on agent cards to customer |
| `phone + phoneCountryCode` | Formatted with flag emoji in profile view |
| `lineId` | LINE bubble icon shown on agent card in Japan market |
| `whatsappNumber` | WhatsApp icon shown on agent card in ZW/ZA markets |

### Lead Entity → UI

| Field | UI Representation |
|---|---|
| `status` | Kanban column placement: pending=New, contacted/in_progress=In Progress, deal_closed/lost/expired=Closed & Lost |
| `matchScore` (0.0–1.0) | `{Math.round(score * 100)}%` with color: ≥80% = purple accent, ≥60% = blue primary, else gray |
| `aiSummary` | Light gray card inside LeadCard; italic font; collapsible if >2 lines |
| `lastContactAt` | "Last contact: {relative}" — "2 hours ago", "Yesterday" |
| `createdAt` | Footer timestamp on lead card |
| `acceptedAt` | Not shown to agent; used only in admin/analytics |
| `closedAt` | "Closed {date}" shown in Closed column card |

### Lead Intelligence Entity → UI

| Field | UI Representation |
|---|---|
| `geminiScore` (0–100) | Displayed as "AI: {score}/100" inside lead detail panel |
| `urgencyTag` | `LeadScoreBadge`: premium=purple pill, high=red, medium=amber, low=gray |
| `estimatedCloseTimelineDays` | Small chip: "Est. close: ~{N} days" below urgency badge |
| `budgetRealism` | Shows as "Budget: Realistic ✓" or "Budget: Below market ⚠" in detail panel |
| `suggestedAlternatives` | Listed as: "AI suggests also considering: {area1}, {area2}" |
| `geminiReasoning` | Expandable "Why this score?" section in detail panel — 2-3 sentences |

### Referral Link Entity → UI

| Field | UI Representation |
|---|---|
| `shortCode` | `refer.app/r/{shortCode}` in `font-mono text-sm` within a gray-100 chip |
| `isActive` | Green "Active" badge / gray "Inactive" badge |
| `totalClicks` | "Clicks: {N}" sub-label under link |
| `totalConversions` | "Conversions: {N}" — shown with green text if >0 |
| `totalEarningsUsd` | Currency formatted by market: "$12.50" / "¥1,500" / "R150" |
| `generatedCopyEn` | Collapsed expandable: "AI wrote this promo copy for you — tap to copy" |
| `createdAt` | "Created {relative date}" |
| `customSlug` | If set: shown as `refer.app/by/{slug}` in green "Custom URL" badge |

### Payment / Balance Entity → UI

| Field | UI Representation |
|---|---|
| `available` | Large bold `text-2xl font-bold text-emerald-600` in Referrer Hub header |
| `pending` | `text-amber-600` row: "Pending: ¥X" — with tooltip "Waiting for deal to close" |
| `lifetimeEarnings` | `text-neutral-600` row: "Total Earned: ¥X" |
| `status` (payment transaction) | Badge: pending=amber, processing=blue, completed=green, failed=red, refunded=gray |
| `createdAt` (payment) | Date in payout history row |
| `provider` | Icon: Stripe=S badge, Paynow=P badge, EcoCash=E badge |

### Agent Profile Entity → UI

| Field | UI Representation |
|---|---|
| `rating` | Star display (e.g., "4.7 ★") in agent card shown to customers |
| `totalReviews` | "({N} reviews)" sub-label below rating |
| `areasCovered` | Gray chips on agent profile view |
| `propertyTypes` | Gray chips below areas |
| `languagesSpoken` | Flag emoji + language name badges |
| `isActive` | Green "Online" dot or gray "Offline" |
| `licenseNumber` | Shown (partially masked) on verified profile: "Lic. ****7890 ✓" |

### Property Entity → UI (Listings Module)

| Field | UI Representation |
|---|---|
| `price + currency + priceType` | "¥150,000/mo" — price formatted with currency symbol; priceType as "/mo" or "/purchase" |
| `propertyType` | Colored chip tag: "2LDK", "Townhouse", "Stand" |
| `status` | Badge: active=green, draft=gray dot, rented=blue, sold=blue, archived=gray |
| `aiQualityScore` | Circular badge 0–100: ≥70=green, 40–69=amber, <40=red |
| `photoUrls[0]` | Cover photo (first photo in array) — `object-cover aspect-[4/3]` |
| `bedrooms` | "{N} bed" label |
| `sizeSqm` | "{N}㎡" or "{N} sqm" depending on locale |
| `availableFrom` | "Available from: {date}" or "Available now" if past |
| `amenities` | Top 3 amenity icons (parking, AC, balcony, etc.) + "+N more" |

### Notification Entity → UI

| Field | UI Representation |
|---|---|
| `type` | Icon: new_lead=🔔 bell, message=💬 bubble, payment=💳 card, verification=🛡 shield, payout=💸 banknote |
| `isRead` | Unread: bold text + blue left-border 4px; Read: normal weight, no border |
| `title` | `font-semibold text-sm text-neutral-900` |
| `body` | `text-sm text-neutral-500` — truncated at 2 lines |
| `createdAt` | Relative time: "2m ago", "1h ago", "Yesterday" |

---

## 7. Interaction Rules (UX Behavior)

### Form Behavior

- **Validation:** On-blur via Zod; errors are red `<p class="text-sm text-red-600 mt-1">` below the field
- **Required fields:** Asterisk (*) in label; submit blocked until valid
- **Multi-select chips:** Toggle on tap; selected = `bg-{color}-600 text-white`; unselected = `bg-gray-100 text-gray-700`
- **Submit disables on pending:** `disabled={mutation.isPending}` + spinner in button
- **Conditional fields:** Animate in with `motion.div` + height transition (not sudden jump)
- **Back navigation:** React Hook Form state preserved in parent — no data loss on back
- **Multi-step forms:** Progress bar fills linearly; steps slide in from right, out to left
- **Phone input:** Country code dropdown + phone number field; flag emoji visible in selector
- **Date picker:** Use native HTML `<input type="date">` + custom styled trigger
- **File upload zones:** Dashed border `border-dashed border-2`; hover = `border-primary/50`; on file load = preview replaces placeholder

### API Failure Handling

| Scenario | UI Response |
|---|---|
| Network timeout / offline | Toast: "No connection. Check your internet and try again." — amber variant |
| 401 Unauthorized | Redirect to `/login?next=[current path]` |
| 403 Forbidden (wrong role) | Redirect to own role's dashboard |
| 403 Forbidden (feature locked) | Show inline lock state — "Upgrade your plan to unlock" |
| 404 Not Found | Toast error; stay on screen |
| 400 Bad Request | Show field-level errors from server response if available; else generic toast |
| 500 Server Error | Toast: "Something went wrong. Please try again." + retry button |
| AI timeout (>10s) | Show "AI is taking longer than usual..." message with progress dots |

### Loading States

| Context | Loading Pattern |
|---|---|
| App startup / auth check | Full-page centered spinner (4px animated border, no text) |
| Dashboard data fetch | `DashboardSkeleton` — pulse gray rectangles at correct sizes |
| Card/section fetch | Skeleton rows inside the card |
| Button mutation | Button disabled + spinner left of label text |
| AI verification analysis | Giant centered spinner + "AI Analyzing your document..." |
| Lead detail panel opening | Skeleton for text fields inside the slide-in panel |
| Property photo upload | Per-photo progress bar (0–100%) |

### State Transitions (Lead Lifecycle)

| Transition | Trigger | UI Effect |
|---|---|---|
| pending → contacted | Agent "Accept Lead" | Card slides to In Progress column; WhatsApp sent |
| contacted → in_progress | Agent sends first message | Status badge updates; no column change |
| in_progress → deal_closed | Agent "Close Deal" | Card slides to Closed column; green dot; success toast |
| in_progress → lost | Agent "Mark Lost" | Card slides to Closed column; gray dot |
| pending → expired | ExpiryCountdown hits 0 | Card grays out; all actions disabled; "Expired" badge appears |
| unverified → verified (agent) | AI or admin approves | Amber banner dismisses; premium leads unlocked |
| subscription grace → suspended | n8n cron triggers | Red banner: "Account suspended. Renew to receive leads." |

### Animations

| Component | Animation Spec |
|---|---|
| Splash logo | `type: "spring", stiffness: 200, damping: 15` — scale 0→1 + rotate -180→0 |
| Onboarding page transitions | `AnimatePresence`: exit x=-20, enter x=20, duration 0.3s |
| Completion checkmark | Ring scales up + fade (or Lottie confetti if available) |
| Lead card acceptance | Slide out of column (transform + opacity, 0.25s) |
| Kanban column badge count | CountUp animation 0→N on first load |
| Balance number | CountUp on mount — 0 → actual balance |
| Chat drawer opening | Slide up from bottom-right, 0.3s ease-out |
| Notification dot | `animate-pulse` on bell icon when unread > 0 |
| Stats tiles | Stagger fade-in: each tile delays +0.1s (children animated) |
| Modal open/close | `DialogContent` scales 0.95→1 + fades, duration 0.2s |

---

## 8. Navigation Structure

### Bottom Navigation (Mobile — Primary)

Each role gets a fixed bottom tab bar with role-specific tabs. Tab icons use Lucide icons.

#### Customer Bottom Nav (4 tabs)

| Tab | Icon | Route | Label |
|---|---|---|---|
| 1 | `Home` | `/search` | My Request |
| 2 | `MessageCircle` | `/chat` | Messages |
| 3 | `Bell` | `/notifications` | Alerts |
| 4 | `User` | `/profile` | Profile |

#### Agent Bottom Nav (5 tabs)

| Tab | Icon | Route | Label |
|---|---|---|---|
| 1 | `LayoutDashboard` | `/dashboard` | Home |
| 2 | `Users` | `/dashboard/leads` | My Leads |
| 3 | `Building` | `/dashboard/listings` | Listings |
| 4 | `MessageCircle` | `/chat` | Chat |
| 5 | `User` | `/profile` | Profile |

#### Referrer Bottom Nav (4 tabs)

| Tab | Icon | Route | Label |
|---|---|---|---|
| 1 | `TrendingUp` | `/refer` | Hub |
| 2 | `Link` | `/refer/links` | My Links |
| 3 | `Banknote` | `/refer/payouts` | Earnings |
| 4 | `User` | `/profile` | Profile |

#### Admin Bottom Nav (5 tabs)

| Tab | Icon | Route | Label |
|---|---|---|---|
| 1 | `BarChart3` | `/admin` | Overview |
| 2 | `Users` | `/admin/users` | Users |
| 3 | `Shield` | `/admin/verify` | Verify |
| 4 | `Banknote` | `/admin/payouts` | Payouts |
| 5 | `Settings` | `/admin/settings` | Settings |

### Desktop / Tablet Navigation

- Left sidebar: 240px wide, collapsed to 64px on md screens
- Logo at top, nav items in a vertical list with icon + label
- Active item: `bg-primary/10 text-primary font-semibold rounded-lg`
- Bottom of sidebar: user avatar + name + logout

### Protected Route Guard Pattern

```
Auth check → loading spinner → not logged in → /login?next=...
             ↓
           logged in → role check → wrong role → redirect to own dashboard
             ↓
           correct role → render page
```

---

## 9. States & Edge Cases

### Empty States (All screens)

| Screen | When shown | Illustration | Copy | CTA |
|---|---|---|---|---|
| Agent Dashboard — no leads | No leads in any status | Bell icon | "No new leads yet. We'll notify you the moment a match comes in." | None |
| Customer Dashboard — no request | No active requests | Search icon | "You don't have an active search. Let's find your perfect home." | "Start a Search" |
| Chat — no conversations | No accepted leads | MessageCircle icon | "No messages yet. Accept a lead to start chatting." / "Submit a request to connect with agents." | Role-based link |
| Referrer Hub — no links | No links created | Link2 icon | "No referral links yet. Create one and start earning today!" | "Create My First Link" |
| Kanban column — empty | Column filter shows 0 | Dotted box | "No {column name} leads right now." | None |
| Listings — no properties | No properties posted | Building icon | "You haven't added any listings yet." | "Add Your First Listing" |
| Notifications — empty | No notifications | Bell icon | "You're all caught up. No new notifications." | None |
| Payout History — empty | No payouts yet | Banknote icon | "No payouts yet. Refer clients and start earning!" | None |

### Error Scenarios

| Scenario | UI Behavior |
|---|---|
| USSD customer lead (no auth) | `customerId = null` → customer name shown as "Anonymous (USSD)" with phone masked |
| Lead score still pending | Show "AI scoring..." skeleton inside lead intelligence area; don't block card render |
| WhatsApp window expired | Show "WhatsApp window closed — send via email instead" inline in chat |
| File too large (>5MB) | Client-side: red toast before upload starts: "Max file size is 5MB" |
| Wrong file type | Client-side: red toast: "Please upload a JPG, PNG, or PDF" |
| Stripe Connect not complete | Show "Connect your bank account to receive leads" amber banner on agent settings |
| Paynow payment pending polling | Show "Awaiting EcoCash confirmation..." + auto-poll every 5s |
| Property photo rejected by AI | Show inline rejection card: photo preview + reason + advice (from `agentAdvice` field) |

### Permission Edge Cases

| Situation | Behavior |
|---|---|
| Unverified agent viewing lead | Lead card visible but blurred; "Verify your account to accept this lead" overlay |
| Suspended agent opening app | Full-screen lockout: "Account Suspended — your subscription has expired. Renew to continue." + Renew button |
| Grace period agent (7 days) | Amber top banner: "Your subscription payment failed. You have 7 days to renew before leads are paused." |
| Customer tries to access agent routes | Hard redirect to `/search` |
| Referrer tries to access agent or admin routes | Hard redirect to `/refer` |

---

## 10. Trust, Transparency & Security UX

### What Users Can See About Their Activity

| Role | Visible Data |
|---|---|
| **Customer** | Request status, count of agents notified/viewed/interested, match score %, AI lead summary, chat history, their own review submission |
| **Agent** | Lead pipeline (Kanban), AI match scores, Gemini reasoning on each lead, own performance scores (response rate, conversion), chat with customers, Stripe payout status |
| **Referrer** | Link performance (clicks, conversions, earnings per link), available balance, pending balance, payout history, AI-generated promo copy per link |
| **Admin** | All of the above for any user, plus: verification status with AI confidence score, payout queue, platform-level stats |

### Status Visibility Contract

| Entity | Status Values Shown | Display |
|---|---|---|
| Lead | New / In Progress / Closed / Lost / Expired | Kanban column + badge |
| Verification | Pending / Under Review / Verified / Rejected | Amber banner → green badge |
| Subscription | Active / Grace Period / Suspended | Colored banner system |
| Payment | Pending / Processing / Paid / Failed | Badge with semantic color |
| Referral conversion | Pending / Converted / Paid out | Timeline row in referral detail |

### Messaging Style Guide

| Type | Tone | Example |
|---|---|---|
| **Error** | Factual, short, actionable | "Failed to upload. Check your connection and try again." |
| **Warning** | Calm, time-aware | "Your account will be paused in 3 days if payment isn't updated." |
| **Success** | Warm, affirming | "Lead accepted! Your customer has been notified." |
| **Info** | Helpful, contextual | "AI is analyzing your document. This takes about 60 seconds." |
| **Empty** | Encouraging, not apologetic | "No leads yet — we'll notify you the moment a match arrives." |
| **Security** | Formal, concise | "Secure bank-grade verification · Powered by Google Cloud Vertex AI" |

### Trust Signals to Include

- "AI-Powered Matching" badge on landing page
- "Verified Agent" green shield on every agent card shown to customers
- "Refer AI Verified" seal on agent dashboard after verification
- "256-bit encrypted" note near document upload
- License number (partially masked) shown on verified agent profiles
- Review count + star rating visible to customers
- WhatsApp window indicator (builds trust in active communication)

---

## 11. Visual Direction (AI Guidance Layer)

### Design Aesthetic

**Premium fintech × Japanese minimalism × African energy.**

The UI should feel like a fintech app (Stripe, Wise) but with warmth — the precision of a Japanese app (clean whitespace, consistent spacing) combined with the boldness needed for markets like Zimbabwe and South Africa. Think: what if Revolut was built for East/Southern African property markets and Japan simultaneously.

Reference apps for mood: **Robinhood** (premium mobile fintech), **Suumo** (Japanese real estate clarity), **Peach** (South African fintech warmth), **Stripe Dashboard** (data-dense but readable).

### Color System (Semantic)

| Token | Value | Semantic Meaning |
|---|---|---|
| `--primary` | `hsl(221, 83%, 53%)` — Royal Blue | Action, trust, primary CTA, links |
| `--accent` | `hsl(262, 83%, 58%)` — Purple | AI features, premium, high-value signals |
| `--background` | `hsl(0, 0%, 98%)` — Off-white | Page background |
| `--card` | `hsl(0, 0%, 100%)` — White | Card backgrounds |
| `--border` | `hsl(220, 13%, 91%)` — Light border | Card dividers, form outlines |
| `--muted-foreground` | `hsl(220, 9%, 46%)` — Mid gray | Helper text, captions, placeholder |
| `--destructive` | `hsl(0, 84%, 60%)` — Red | Errors, destructive actions |
| `--gradient-primary` | `135deg, #3b82f6 → #8b5cf6` | Hero backgrounds, splash screen |
| Amber `#f59e0b` | Warning system | Grace period, unverified warnings |
| Emerald `#10b981` | Success system | Verified, active, deal closed, paid |
| Orange `#f97316` | Urgency system | New leads dot, high urgency tags |
| Gray `#6b7280` | Neutral system | Inactive, closed, archived states |

### Typography System

| Use Case | Tailwind Classes | Notes |
|---|---|---|
| Page title (landing, splash) | `text-4xl font-bold tracking-tight` | Hero gravity |
| Dashboard section title | `text-xl font-bold text-neutral-900` | Clear hierarchy |
| Card title | `text-lg font-semibold text-neutral-900` | Card headers |
| Sub-section | `text-base font-semibold text-neutral-800` | Within cards |
| Body text | `text-sm text-neutral-600 leading-relaxed` | General content |
| Form labels | `text-sm font-medium text-neutral-800` | Input labels |
| Captions / metadata | `text-xs text-neutral-500` | Timestamps, counts |
| Monospace (codes/URLs) | `font-mono text-sm text-neutral-700` | Referral links, license numbers |
| Error text | `text-sm text-red-600` | Form validation |
| Amount display | `text-2xl font-bold text-emerald-600` | Balance, earnings header |

**Font Recommendation:** Load **Inter** from Google Fonts. It is the industry standard for fintech apps and renders beautifully at all weights on mobile.

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Glassmorphism System

Used selectively — not everywhere. Best on gradient backgrounds (splash, landing hero, completion screen).

```css
/* Light glassmorphism — on gradient backgrounds */
.glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* Premium card — on white backgrounds (most dashboard cards) */
.premium-card {
  background: #ffffff;
  border: 1px solid hsl(220, 13%, 91%);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04);
  border-radius: 1rem;
}
```

### Spacing & Layout

- **Mobile max-width:** `max-w-sm` (384px) for forms and detail views; full-width for cards/lists
- **Card padding:** `p-4` (16px) standard; `p-6` (24px) for prominent/hero cards
- **Section gap:** `space-y-6` (24px) between major sections on a screen
- **Grid columns:** `grid-cols-2` for quick stats; `grid-cols-3` for Kanban; `grid-cols-1` for form fields on mobile
- **Bottom nav clearance:** `pb-20` (80px) on all authenticated content pages
- **Safe area:** `pt-safe-top` for status bar clearance
- **Border radius:** `--radius: 1rem` (16px) for cards; `rounded-full` for avatars and pills; `rounded-xl` (12px) for buttons
- **Touch targets:** Minimum 44×44px for all interactive elements; CTA buttons minimum `h-12` (48px)

### Density Guidelines

| Surface | Density |
|---|---|
| Landing / Splash | Spacious — large whitespace, centered content, breathing room |
| Onboarding steps | Balanced — focused single task per step |
| Customer dashboard | Balanced — clear hierarchy, not cluttered |
| Agent dashboard | Compact-balanced — multiple sections visible without scroll bloat |
| Kanban lead cards | Compact — maximum info in minimum space, but still readable |
| Chat interface | Focused — messages take full width, input bar fixed bottom |
| Admin tables | Data-dense — similar to Stripe Dashboard |

### Micro-Animations (Complete Spec)

| Element | Animation |
|---|---|
| Splash logo | `spring: stiffness 200, damping 15` — scale 0→1 + rotate -180→0 |
| Splash feature cards | Stagger fade-in with y offset: 0.3s, 0.4s, 0.5s |
| Onboarding step slide | `AnimatePresence`: exit x=-40, enter x=40, opacity 0→1, 0.25s |
| Progress bar fill | `transition: width 0.3s ease-in-out` |
| Role card select | Border ring appears: `ring-2 ring-blue-500 transition-all` |
| Stats tile count | CountUp 0→N over 0.6s on mount (use react-countup) |
| Dashboard skeleton | `animate-pulse` — background-color cycles gray-200 ↔ gray-100 |
| Active request pulse | `animate-pulse` on green dot only |
| Lead card hover | `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200` |
| Lead acceptance exit | `opacity: 0, x: -20, height: 0` — 0.25s ease |
| Bottom nav active | `transition-colors` — icon + label color shift |
| Chat drawer slide | `translateY: 100%→0` — 0.3s ease-out |
| Toast appear | Slide up from bottom + fade: `translateY: 20px→0, opacity: 0→1` |
| Verification result | Success: ring scales + green fill; Fail: shake animation |
| Modal open | `scale: 0.95→1, opacity: 0→1, backdrop-blur fades in` — 0.2s |

---

## 12. Resolved Design Decisions (Previously Open Questions)

The following were identified as ambiguous. These are expert recommendations that should serve as defaults — override with specific product decisions where needed.

---

### 12.1 Admin Dashboard Scope

**Recommendation:** Build a focused 5-screen admin console, not a full analytics dashboard.

**Admin Home (`/admin`):**
- 4 KPI tiles: New Users This Week / Agents Pending Verification / Payouts Awaiting Approval / Open Reports
- 3 quick-action cards: "Review Verifications" / "Approve Payouts" / "Manage Users"
- Simple platform health bar (based on `/internal/api/system-health`)

**Admin Users (`/admin/users`):**
- Sortable/searchable table: Name, Role badge, Country flag, Subscription status, Last Active, Actions
- Filter bar: Role / Country / Status / Date range
- Tap row → User Detail modal: profile summary + activity log + action buttons (Suspend, Change Role, Send Message, Verify Manually)

**Admin Verification Queue (`/admin/verify`):**
- List of agents with `verificationStatus = 'manual_review'` ordered by submission date
- Each row: agent name, country, Gemini extracted fields (license #, expiry, authority), confidence score
- Tap → full-screen document viewer + extracted data side panel
- Actions: "Approve" (green) / "Reject" (red, requires reason) — rejection reason sent as notification

**Admin Payout Approvals (`/admin/payouts`):**
- List of `paymentTransactions` with `status = 'pending'` ordered by amount desc
- Each row: referrer name (with avatar), amount formatted, method icon (bank/e-wallet), date, Review button
- Tap → Payout Detail modal: referrer profile + bank details + all their past payouts
- Actions: "Approve" → triggers n8n / "Flag for Review" → adds internal note

**Admin Settings (`/admin/settings`):**
- Subscription pricing by country (editable fields: ZW price, ZA price, JP price per plan)
- Feature flag toggles: "Require AI Verification", "Enable USSD", "Enable Market Intelligence"
- Minimum payout thresholds (by currency)

**Design:** Use a sidebar layout for admin (not bottom nav). White sidebar with `text-sm` nav items. Content area with table-heavy layouts. Stripe Dashboard is the reference.

---

### 12.2 Property Listings UI

**Recommendation:** Agent-only card grid with photo cover, AI quality score, and status badge.

**Layout (`/dashboard/listings`):**
- Top bar: "My Listings" title + "Add Listing" button (primary, right-aligned)
- Filter row: All / Active / Draft / Rented / Sold
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- Each card: cover photo (aspect 4:3) + AI quality badge (top-right corner) + property type chip + price + area + status badge + "Edit" / "View" actions

**Property Card states:**
- Draft: gray top border + "Draft" badge — not visible to customers
- Active: green "Active" badge — visible to customers (future feature)
- Rented/Sold: blue badge + slightly desaturated cover photo

**Add Listing Flow (`/dashboard/listings/new`):**
- Step 1 — Basics: Country → City + District → Property type → Title → Description
- Step 2 — Details: Price + currency + priceType → Bedrooms → Bathrooms → Size (sqm) → Floor → Amenities (chip multi-select)
- Step 3 — Photos: Multi-photo upload zone (max 5); each photo analyzed by Gemini AI on upload; rejected photos shown inline with reason + advice
- Step 4 — Review & Publish: Summary card + "Publish" (active) or "Save Draft" (secondary)

**AI photo rejection pattern:** If a photo scores below 30/100 (quality too low), show inline rejection: thumbnail + "⚠ Photo blurry — try again in better light" + `agentAdvice` text. Allow re-upload.

**Customers DO NOT browse listings directly in v1.** The agent-customer match happens via request → matching. Listings are an agent tool for organizing their inventory.

---

### 12.3 Referral Landing Page (The `/r/:shortCode` Experience)

**Recommendation:** A conversion-optimized, lightly branded landing page — not generic.

**URL:** `refer.app/r/{shortCode}` or `refer.app/by/{customSlug}` if agent has custom slug.

**Page Structure:**
1. **Hero section:** Platform logo + "Find Your {propertyType} in {targetArea}" headline — pre-filled from link's targetCountry + targetArea
2. **Trust signals strip:** "500+ verified agents" · "AI-powered matching" · "Free to sign up"
3. **Quick Request Form:** Budget range + preferred area + property type → "Find My Agent" CTA
   - Pre-fills country/area/type from referral link metadata
   - Maps to: POST /api/customer/request with `referralCode = shortCode`
4. **How It Works:** 3-step visual: Submit → Match → Move In
5. **Footer:** "Referred by a trusted member of the Refer network" — small print, no referrer name shown (privacy)

**Referrer privacy:** The referrer's identity is NOT shown to the customer. Only "referred by a member of the Refer network" is shown. This prevents customers from bypassing the platform.

**Design:** Dark blue gradient header (matches splash screen brand), white content area, single-column mobile layout. CTA button is large — `h-14 w-full` — prioritize conversion over information density.

**After submit:** "You're in! We're matching you with {N} verified agents in {area}. Expect a WhatsApp/email within minutes."

---

### 12.4 Market Intelligence UI (When to Surface)

**Recommendation:** Surface as a "Market Pulse" card on the Agent Dashboard (v2 addition — low complexity).

**When:** Add as Phase 2 (after v1 launch). Backend tables (`marketSnapshots`) are ready.

**Where:** A collapsible "Market Pulse" card at the bottom of the Agent Dashboard (`/dashboard`).

**Content of Market Pulse card:**
- "Average rent in {agent's top area}: {avgRentLocal}/mo" (from marketSnapshots)
- Trend indicator: "↑ 4% vs last month" (green) or "↓ 2%" (red)
- "Last updated: {snapshotDate}"
- Small Gemini analysis excerpt (1 sentence from `geminiAnalysis`)
- "View full market report" (Future — links to /dashboard/market)

**Full market page (v2 — `/dashboard/market`):**
- Area selector (agent's covered areas)
- Line chart: rent trends last 6 months by property type
- Table: avg rent by district + trend direction
- Gemini market commentary block
- Compare: "Your deals vs market average"

**Implementation note:** Initially this can be purely static Gemini-generated text from the `geminiAnalysis` field — no real chart needed in v2 MVP.

---

### 12.5 Agent Subscription & Pricing

**Recommendation:** Build a `Settings > Payments` screen, and a Plan Upgrade modal.

**Subscription tiers (recommended structure):**

| Plan | ZW (USD/mo) | ZA (ZAR/mo) | JP (¥/mo) | Lead Limit | Verification |
|---|---|---|---|---|---|
| **Starter** | $0 | R0 | ¥0 | View leads only; can't accept | Manual only |
| **Professional** | $19 | R350 | ¥2,800 | 20 accepted/mo | AI auto |
| **Premium** | $49 | R900 | ¥7,200 | Unlimited | AI auto + priority |

**Settings > Payments (`/dashboard/settings/payments`):**
- Section 1: Current Plan — plan name badge + renewal date + "Manage Plan" link (Stripe portal or in-app plan selector)
- Section 2: Connect Bank Account — Stripe Connect onboarding card + status (Not Connected / Connected / Issues)
  - If not connected: "Connect Your Bank" button → POST /api/payments/connect/start → external Stripe onboarding URL
  - If connected: "Connected to {bank}" + "View Stripe Dashboard" link
- Section 3: Payment History — list of `paymentTransactions` for this user (subscription payments)
- Section 4: Paynow (ZW only) — EcoCash number for ZW subscriptions

**Upgrade Plan Modal:**
- Comparison table of 3 plans (current highlighted)
- "Upgrade to Premium" → POST /api/payments → Stripe Checkout or Paynow
- Payment method selects based on agent's country (Stripe for ZA/JP, Paynow for ZW)

---

### 12.6 Review Flow

**Recommendation:** In-chat prompt, not a separate screen.

**Trigger:** When an agent marks a lead as `deal_closed`, the customer receives:
1. A push/WhatsApp notification: "🏠 Congrats on your new home! How was your experience with Agent {name}?"
2. Inside the chat UI: A `ReviewPromptCard` pinned at the top of the conversation
   - 5-star tap selector
   - Optional comment field (placeholder: "Tell others what made this agent great...")
   - "Submit Review" button → POST /api/customer/submit-feedback

**Display of reviews:**
- Agent cards shown to customers display: star rating + review count
- Agent's Performance screen shows their latest 5 reviews
- Admin can see all reviews per agent

**Review editing:** Not allowed once submitted (integrity of the system).

---

### 12.7 USSD (Web vs Backend-Only)

**Recommendation:** Purely backend/telco — NO web UI for USSD flow.

The USSD menus run in Africa's Talking and are purely text-driven (on feature phones). There is no web component. The anonymous leads created via USSD surface on the Agent Kanban as regular leads with `customerId = null`.

**However — add a USSD status page (`/admin/ussd` — admin only):**
- Shows live USSD session count
- Recent USSD-originated leads (source = 'ussd')
- USSD menu tree preview
- Test the USSD callback via a web form (for developers/QA)

**Agent UI consideration:** USSD-originated lead cards should show:
- "📱 Via USSD" source badge
- Customer name shown as "Anonymous (USSD)" + masked phone: "+263 ***-***-7890"
- Contact method limited to phone call or WhatsApp (no email; no LINE)

---

### 12.8 Internationalisation (i18n) — Japan Market

**Recommendation:** Build the i18n system now, even if Japanese content is 80% English for v1.

**Why now:** The schema already has `generatedCopyJa` for AI-generated Japanese promo copy. The Japan market has LINE as the primary messaging channel. Property types are completely different (1K, 2LDK vs Stand, Cluster). Not planning for i18n now means painful refactoring later.

**Implementation approach:**

```typescript
// Recommended: react-i18next
import { useTranslation } from 'react-i18next';

// Usage
const { t } = useTranslation();
<h1>{t('dashboard.welcome', { name: user.firstName })}</h1>
```

**Language detection logic:**
1. Check `user.locale` from DB (`userProfiles.locale`)
2. Fall back to browser `navigator.language`
3. Default to `en-ZW` for ZW/ZA markets, `ja-JP` for JP market

**JP-specific UI adaptations beyond language:**
- Currency: Always `¥` (JPY) with comma separators — `¥150,000`
- Dates: `YYYY年MM月DD日` format in Japanese locale
- Property types: Show Japanese type names (1K, 2LDK etc.) — these are already in English globally
- Contact method: Default to LINE (not WhatsApp) in JP onboarding
- Payment: Default to Stripe (no Paynow) for JP market
- Address format: City → District → Block in JP (reverse of Western format)
- Phone country codes: `+81` default for JP
- Verification documents: ZREB license (ZW), EAAB (ZA), 宅地建物取引士 license (JP)

**Translation files to create:**
- `locales/en.json` — base English
- `locales/ja.json` — Japanese (start with Gemini-translated, review by native speaker)
- `locales/en-ZA.json` — ZA English (minor differences: "flat" not "apartment", ZAR currency)

---

## 13. System Constraints & Technical Notes

### Platform Targets

| Target | Priority | Notes |
|---|---|---|
| Mobile Web (PWA) | **Primary** | Touch-first; safe-area insets (`pt-safe-top`, `pb-20`) |
| Desktop Web | Secondary | Responsive at lg/xl breakpoints; sidebar nav |
| Native App (iOS/Android) | Out of scope v1 | PWA installable as a proxy |

### Multi-Region Design Matrix

| Market | Currency | Payment Provider | Primary Channel | Property Types |
|---|---|---|---|---|
| Zimbabwe (ZW) | USD | Paynow / EcoCash | WhatsApp + USSD | Stand, Cluster, House, Flat, Commercial |
| South Africa (ZA) | ZAR | Stripe / PayFast | WhatsApp + Email | Sectional Title, Full Title, Townhouse, Apartment |
| Japan (JP) | JPY | Stripe Connect | LINE + Email | 1K, 1DK, 1LDK, 2K, 2DK, 2LDK, 3LDK, 4LDK |

**UI implication — what changes by market:**
- Property type chip list filtered by detected/selected country
- Contact method default in onboarding
- Payout minimum threshold shown in local currency
- Subscription price displayed in local currency
- Verification document type name (ZREB, EAAB, 宅建士)
- Address input field order

### Performance Constraints

- TanStack Query: stale-while-revalidate; queryKey-based cache invalidation after mutations
- File uploads: 5MB max enforced client-side before server submission
- Images: Firebase Storage CDN; use `size=800x600` param for thumbnails
- WebSocket: Exponential backoff reconnect (already in backend)
- Mobile: No auto-play video, no heavy animations on scroll, lazy-load images below fold

### Backend Limitations (Design Must Respect)

| Constraint | UI Design Rule |
|---|---|
| USSD leads have `customerId = null` | Show as "Anonymous (USSD)" — never crash on null customer |
| Lead intelligence scoring is async (30s+) | Score shown as "Scoring..." skeleton first; then hydrates when ready |
| WhatsApp 24h conversation window | Show `WhatsAppWindowBadge` with remaining time in chat |
| n8n payouts are not instant (1–3 days) | Never show "Paid" immediately; always show "Processing" until webhook confirms |
| Stripe Connect requires country-specific config | Check `stripeAccountId` before allowing payout; show setup prompt if missing |
| Property photos screened by Gemini (async) | Show "Analyzing photo..." per uploaded image; show quality badge after |
| Agent scoring recalculated by `agent-scoring.ts` on each status change | Do not hard-refresh on accept; optimistic update then reconcile |

### Real-time vs Async Behavior (UI Contract)

| Feature | Behavior | UI Pattern |
|---|---|---|
| Chat messages | Real-time (WebSocket) | Messages appear instantly; no polling needed |
| Lead notifications | Real-time (WebSocket + push) | Bell badge updates live |
| Lead intelligence score | Async — Gemini (up to 60s) | Skeleton → hydrates when ready |
| Property photo quality score | Async — Gemini (5–15s) | "Analyzing..." indicator per photo |
| Agent verification result | Async — Gemini (up to 60s); manual can be 24h | Show processing state; push when done |
| Stripe webhook (payment) | Async — seconds to minutes | "Processing" badge; refreshes on push/webhook |
| n8n referral payout | Async — 1–3 business days | "Processing" state with estimated completion range |
| Paynow EcoCash payment | Async — poll every 5s | Auto-poll `checkPaymentStatus` until resolved |

---

## 14. AI Prompt Summary (Execution Layer)

> Copy-paste this section to brief Stitch, v0, Galileo, Lovable, or any AI design tool.

---

**Product:** Refer — a premium real estate referral marketplace for Zimbabwe, South Africa, and Japan. Three-sided marketplace: customers (property seekers), agents (licensed real estate pros), referrers (affiliate link generators).

**Design style:** Premium fintech mobile-first. Glassmorphism on gradient backgrounds; clean white cards on dashboards. Blue-to-purple gradient brand (#3b82f6 → #8b5cf6). Large rounded corners (1rem). Inter font. Framer Motion spring animations. Semantic color system: amber=warning, emerald=success, red=error, orange=urgent. Touch targets ≥ 44px. Bottom tab navigation per role.

**Key screens to design (in priority order):**

1. **Splash / Landing** — Blue-purple gradient background, animated logo (building + handshake icon), glassmorphism feature cards (3 icons: Verified Agents, AI Matching, Easy Refer), "Get Started" white button, "Already have an account? Sign In" ghost button

2. **Role Selection** — Clean white cards (4 total), each with colored icon (blue=customer, green=agent, purple=referrer, red=admin), title, description text, feature bullet list, arrow right indicator

3. **Onboarding Contact Details (Step 2)** — Form with progress bar (Step 2 of 3), first/last name row, email with mail icon, phone with country code dropdown (flag emoji) + number field, 2×2 contact method picker (Email, Phone, WhatsApp, LINE tiles)

4. **Agent Kanban Lead Dashboard** — Header: "Lead Management" + leads count. Stats bar: 5 tiles (New/Active/Closed/Lost/Total). Filter bar. 3 Kanban columns: orange dot "New Leads" / blue dot "In Progress" / green dot "Closed & Lost". Lead cards with: AI urgency badge (purple/red/amber/gray), match score %, masked customer name, budget range, property type chip, expiry countdown, Accept + Decline buttons

5. **Customer Active Request Dashboard** — "ACTIVE REQUEST" pulsing green badge, request summary card (property type + area + budget), 3-stat grid (Agents notified / Viewed / Interested), section: "Interested Agents" with cards (avatar initials, match %, AI summary, Chat + Phone CTAs)

6. **Referrer Hub** — Header: "Referrer Hub" + large balance `¥X,XXX available`. Stats bar: Active Links / Total Clicks / Conversions. "Generate Referral Link" gradient card with expand form. Recent Links section: each card has monospace link URL, copy icon, share icon, click count

7. **Agent AI Verification** — Shield icon hero, "Get Verified. Get Better Leads." headline, dashed upload zone (drag or tap to upload license photo), image preview on file select, "Verify with AI" blue button, spinning loader state: "AI Analyzing your document...", trust footer: "Secure bank-grade verification · Google Cloud Vertex AI"

8. **Referral Landing Page** — Dark blue hero header with platform name + pre-filled headline ("Find Your 2LDK in Shibuya"), quick 3-field request form (budget + area + type) + large "Find My Agent" CTA, "How it Works" 3-step section, trust strip (agent count, AI matching badge)

9. **Admin Verification Queue** — Clean table/list: agent name + license preview + Gemini confidence score badge + submission date. Row tap → modal: document image viewer + extracted fields (License #, Expiry, Authority) + Approve (green) / Reject (red) buttons

10. **Settings > Payments (Agent)** — Current Plan section (badge + renewal date + Manage button), Connect Bank section (Stripe Connect status + CTA), Payment History list

**What NOT to design:**
- No public property browsing interface for customers
- No mortgage/credit tools
- No native iOS/Android chrome (no tab bars with homebuttons, no back swipe indicators)
- No map views
- No Kanban drag-and-drop (static columns only for v1)
- No dark mode (exists in CSS tokens but not the focus)

---

## 15. Outstanding Decisions (Require Final Sign-Off)

These are smaller decisions left intentionally open — answer them before finalizing the UI:

| # | Question | Default Recommendation | Priority |
|---|---|---|---|
| 1 | Agent card shown to customer: show photo or initials avatar only? | **Initials avatar only** (no profile photo in v1 — privacy + simplicity) | Medium |
| 2 | Should referrers see each other's link performance (leaderboard)? | **No** — private data; no leaderboard in v1 | Low |
| 3 | Can a customer submit more than 1 active request at a time? | **1 active request at a time** — override requires admin action | High |
| 4 | Subscription model: Monthly only, or also Annual? | **Monthly only** in v1; annual discount in v2 | Medium |
| 5 | Is the "customSlug" feature for referral links (e.g., /by/tendai) available to all referrers or premium only? | **Premium referrers only** (or all — decide branding impact) | Low |
| 6 | Does the completion animation use Lottie (confetti) or a simple Framer Motion ring? | **Framer Motion ring** for v1 (no external Lottie dependency needed) | Low |
| 7 | Do agents see customer's real name or a masked name until they accept the lead? | **Masked until accepted** ("Customer T***i M***a") — trust but protect privacy | High |
| 8 | Is the WhatsApp conversation window indicator shown to both agent and customer, or agent only? | **Agent only** — customers don't need to understand platform plumbing | Medium |
| 9 | Should unverified agent leads be blurred or hidden entirely? | **Blurred** (visible but locked) — motivates verification through FOMO | High |
| 10 | Admin screen: accessible via the same app or a separate admin URL? | **Same app, separate route** `/admin` — simpler than a separate deployment | Medium |

