import { sql, relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Enums
export const userRoleEnum = pgEnum('user_role', ['customer', 'agent', 'referrer', 'admin', 'house_owner', 'super_admin']);
export const requestStatusEnum = pgEnum('request_status', ['active', 'matched', 'completed', 'cancelled']);
export const propertyTypeEnum = pgEnum('property_type', [
  // Japan
  "1K", "1DK", "1LDK", "2K", "2DK", "2LDK", "3K+",
  "1R", "3DK", "3LDK", "4LDK",
  // ZA
  "sectional_title", "full_title", "cluster", "estate", "townhouse", "apartment",
  // ZW
  "stand", "cluster_home", "house", "flat", "commercial",
  // Shared
  "other"
]);
export const contactMethodEnum = pgEnum('contact_method', ['whatsapp', 'line', 'email', 'phone', 'sms', 'ussd', 'push']);
export const messageTypeEnum = pgEnum('message_type', ['text', 'image', 'file', 'property_share']);
export const leadStatusEnum = pgEnum('lead_status', ['pending', 'viewed', 'contacted', 'in_progress', 'closed']);

// Refer 2.0 Enums
export const countryEnum = pgEnum("country", ["ZW", "ZA", "JP"]);
export const currencyEnum = pgEnum("currency", ["USD", "ZAR", "JPY"]);
export const leadScoreEnum = pgEnum("lead_score", ["low", "medium", "high", "premium"]);
export const verificationMethodEnum = pgEnum("verification_method", ["auto_ai", "manual_review", "auto_approved"]);
export const paymentProviderEnum = pgEnum("payment_provider", ["stripe", "paynow", "pesapal", "payfast"]);
export const commChannelEnum = pgEnum("comm_channel", ["email", "whatsapp", "sms", "line", "ussd", "push"]);
export const workflowStatusEnum = pgEnum("workflow_status", ["pending", "running", "completed", "failed", "skipped"]);

// Onboarding status enum
export const onboardingStatusEnum = pgEnum('onboarding_status', [
  'splash', 
  'phone_verified', 
  'role_selection', 
  'contact_details', 
  'role_specific', 
  'verified',
  'completed'
]);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['inactive', 'active', 'grace_period', 'suspended']);

export const propertyStatusEnum = pgEnum("property_status", [
  "draft", "active", "rented", "sold", "archived"
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "new_lead", "lead_accepted", "lead_expired", "message",
  "payment", "payout", "verification", "system", "market_update"
]);

export const disputeStatusEnum = pgEnum("dispute_status", [
  "open", "under_review", "awaiting_agent", "awaiting_customer",
  "resolved_agent_favour", "resolved_customer_favour", "resolved_split", "closed"
]);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  middleName: varchar("middle_name"),
  lastName: varchar("last_name"),
  phone: varchar("phone"),
  phoneCountryCode: varchar("phone_country_code").default('+81'),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default('customer'),
  preferredContactMethod: contactMethodEnum("preferred_contact_method"),
  lineId: varchar("line_id"),
  whatsappNumber: varchar("whatsapp_number"),
  isVerified: boolean("is_verified").default(false),
  onboardingStatus: onboardingStatusEnum("onboarding_status").default('splash'),
  onboardingCompletedAt: timestamp("onboarding_completed_at"),
  stripeCustomerId: varchar("stripe_customer_id"),
  subscriptionStatus: subscriptionStatusEnum("subscription_status").default('inactive'),
  subscriptionRenewsAt: timestamp("subscription_renews_at"),
  lastActiveAt: timestamp("last_active_at"),
  firebaseUid: varchar("firebase_uid", { length: 128 }).unique(),
  referredByUserId: varchar("referred_by_user_id"), // Track the pyramid chain
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Refer 2.0 User Profiles
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  country: countryEnum("country").notNull().default("ZW"),
  currency: currencyEnum("currency").notNull().default("USD"),
  preferredChannel: commChannelEnum("preferred_channel").default("whatsapp"),
  stripeAccountId: varchar("stripe_account_id", { length: 64 }),
  lineUserId: varchar("line_user_id", { length: 64 }), // Japan
  ecocashNumber: varchar("ecocash_number", { length: 20 }), // Zimbabwe
  timezone: varchar("timezone", { length: 64 }).default("Africa/Harare"),
  locale: varchar("locale", { length: 10 }).default("en-ZW"),
  fcmToken: text("fcm_token"), // Firebase Cloud Messaging
  xp: integer("xp").default(0),
  lastActiveAt: timestamp("last_active_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customer requests
export const customerRequests = pgTable("customer_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => users.id), // Nullable for USSD
  phoneNumber: varchar("phone_number"), // For USSD leads
  budgetMin: integer("budget_min"),
  budgetMax: integer("budget_max"),
  currency: currencyEnum("currency").default("USD"),
  preferredCity: varchar("preferred_city"),
  preferredAreas: text("preferred_areas").array(),
  propertyType: varchar("property_type"), // Flexible string for USSD/Varied types
  bedrooms: varchar("bedrooms"),
  country: countryEnum("country").default("ZW"),
  source: varchar("source").default("web"), // web, ussd, app
  moveInDate: varchar("move_in_date"),
  occupants: integer("occupants").default(1),
  mustHaveFeatures: text("must_have_features").array(),
  jobVisaType: varchar("job_visa_type"),
  additionalNotes: text("additional_notes"),
  status: varchar("status").default("pending"),
  assignedAgentId: varchar("assigned_agent_id").references(() => users.id),
  assignedAt: timestamp("assigned_at"),
  conversationId: varchar("conversation_id"),
  serviceFeepaid: boolean("service_fee_paid").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Agent profiles
export const agentProfiles = pgTable("agent_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  licenseNumber: varchar("license_number").notNull(),
  licenseUploadUrl: varchar("license_upload_url"),
  areasCovered: text("areas_covered").array(),
  propertyTypes: text("property_types").array(),
  languagesSpoken: text("languages_spoken").array(),
  specializations: text("specializations").array(),
  rating: decimal("rating", { precision: 2, scale: 1 }).default('0.0'),
  totalReviews: integer("total_reviews").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Referrer profiles
export const referrerProfiles = pgTable("referrer_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  bankDetails: jsonb("bank_details"),
  ewalletDetails: jsonb("ewallet_details"),
  preferredRewardMethod: varchar("preferred_reward_method"),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default('0.00'),
  availableBalance: decimal("available_balance", { precision: 10, scale: 2 }).default('0.00'),
  totalReferrals: integer("total_referrals").default(0),
  successfulReferrals: integer("successful_referrals").default(0),
  tier: text("tier").default("Bronze"), // Bronze, Silver, Gold, Platinum
  rankProgress: integer("rank_progress").default(0), // 0-100% to next tier
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// House Owner profiles
export const houseOwnerProfiles = pgTable("house_owner_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  totalProperties: integer("total_properties").default(0),
  totalCashbackEarned: decimal("total_cashback_earned", { precision: 12, scale: 2 }).default('0.00'),
  isVerified: boolean("is_verified").default(false),
  isCompany: boolean("is_company").default(false),
  companyName: text("company_name"),
  verificationDocs: text("verification_docs").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Referral links
export const referralLinks = pgTable("referral_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerId: varchar("referrer_id").references(() => users.id).notNull(),
  shortCode: varchar("short_code", { length: 12 }).unique().notNull(),
  landingPageUrl: text("landing_page_url"), // Firebase Hosting URL
  qrCodeUrl: text("qr_code_url"), // Firebase Storage URL
  targetCountry: countryEnum("target_country").notNull().default("ZW"),
  customSlug: varchar("custom_slug", { length: 64 }), // e.g. /by/tendai
  generatedCopyEn: text("generated_copy_en"), // AI ghostwritten promo copy
  generatedCopyJa: text("generated_copy_ja"),
  totalClicks: integer("total_clicks").default(0),
  totalSubmissions: integer("total_submissions").default(0),
  totalConversions: integer("total_conversions").default(0),
  totalEarningsUsd: decimal("total_earnings_usd", { precision: 10, scale: 2 }).default("0.00"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Leads (agent-customer connections)
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => users.id).notNull(),
  agentId: varchar("agent_id").references(() => users.id).notNull(),
  requestId: varchar("request_id").references(() => customerRequests.id).notNull(),
  status: leadStatusEnum("status").default('pending'),
  matchScore: decimal("match_score", { precision: 3, scale: 2 }),
  aiSummary: text("ai_summary"),
  agentNotes: text("agent_notes"),
  lastContactAt: timestamp("last_contact_at"),
  acceptedAt: timestamp("accepted_at"),
  closedAt: timestamp("closed_at"),
  houseOwnerConfirmedAt: timestamp("house_owner_confirmed_at"),
  houseOwnerCashbackAmount: decimal("house_owner_cashback_amount", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat conversations
export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").references(() => leads.id).notNull(),
  customerId: varchar("customer_id").references(() => users.id).notNull(),
  agentId: varchar("agent_id").references(() => users.id).notNull(),
  lastMessageAt: timestamp("last_message_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat messages
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => conversations.id).notNull(),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  messageType: messageTypeEnum("message_type").default('text'),
  content: text("content"),
  fileUrl: varchar("file_url"),
  metadata: jsonb("metadata"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Properties table
export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").notNull().references(() => users.id),
  houseOwnerId: varchar("house_owner_id").references(() => users.id),
  country: countryEnum("country").notNull(),
  city: varchar("city", { length: 64 }).notNull(),
  district: varchar("district", { length: 128 }),
  address: text("address"),
  title: varchar("title", { length: 128 }).notNull(),
  description: text("description"),
  propertyType: propertyTypeEnum("property_type").notNull(),
  status: propertyStatusEnum("status").default("active"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  currency: currencyEnum("currency").notNull(),
  priceType: varchar("price_type", { length: 16 }).default("monthly"),
  bedrooms: integer("bedrooms"),
  bathrooms: decimal("bathrooms", { precision: 3, scale: 1 }),
  sizeSqm: decimal("size_sqm", { precision: 8, scale: 2 }),
  floor: integer("floor"),
  totalFloors: integer("total_floors"),
  amenities: jsonb("amenities").default([]),
  photoUrls: jsonb("photo_urls").default([]),
  availableFrom: timestamp("available_from"),
  // Japan specific
  keyMoney: decimal("key_money", { precision: 10, scale: 2 }),
  securityDeposit: decimal("security_deposit", { precision: 10, scale: 2 }),
  managementFee: decimal("management_fee", { precision: 10, scale: 2 }),
  petPolicy: varchar("pet_policy", { length: 16 }),
  // AI analysis
  aiQualityScore: integer("ai_quality_score"),
  aiAmenityTags: jsonb("ai_amenity_tags").default([]),
  viewCount: integer("view_count").default(0),
  firestoreId: varchar("firestore_id", { length: 64 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payments
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default('JPY'),
  paymentType: varchar("payment_type"), // 'service_fee', 'referral_payout'
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  status: varchar("status"), // 'pending', 'completed', 'failed'
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: notificationTypeEnum("type").notNull(),
  title: varchar("title", { length: 128 }).notNull(),
  body: text("body"),
  data: jsonb("data"),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  channel: commChannelEnum("channel").default("push"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── AGENT PERFORMANCE SCORING ──────────────────────────────
export const agentScores = pgTable("agent_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").notNull().references(() => users.id),
  responseRateScore: decimal("response_rate_score", { precision: 5, scale: 2 }).default("100"),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }).default("0"),
  avgResponseTimeMinutes: integer("avg_response_time_minutes"),
  totalLeadsReceived: integer("total_leads_received").default(0),
  totalLeadsAccepted: integer("total_leads_accepted").default(0),
  totalDealsClosed: integer("total_deals_closed").default(0),
  payoutReliabilityScore: decimal("payout_reliability_score", { precision: 5, scale: 2 }).default("100.00"),
  customerRatingAvg: decimal("customer_rating_avg", { precision: 3, scale: 2 }).default("0.00"),
  reliabilityIndex: decimal("reliability_index", { precision: 5, scale: 2 }).default("0.00"), // Gemini synthesized
  reliabilityLastCalculatedAt: timestamp("reliability_last_calculated_at"),
  scoreBand: leadScoreEnum("score_band").default("medium"), // low/medium/high/premium agent tier
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ── LEAD INTELLIGENCE ──────────────────────────────────────
export const leadIntelligence = pgTable("lead_intelligence", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerRequestId: varchar("customer_request_id").notNull().references(() => customerRequests.id),
  geminiScore: integer("gemini_score"), // 0-100
  geminiReasoning: text("gemini_reasoning"),
  budgetRealism: decimal("budget_realism", { precision: 5, scale: 2 }), // % vs market avg
  urgencyTag: leadScoreEnum("urgency_tag"),
  estimatedCloseTimelineDays: integer("estimated_close_timeline_days"),
  suggestedAlternatives: jsonb("suggested_alternatives"), // Gemini budget/area suggestions
  marketContextSnapshot: jsonb("market_context_snapshot"), // market data at time of scoring
  scoredAt: timestamp("scored_at").defaultNow(),
  modelVersion: varchar("model_version", { length: 32 }).default("gemini-2.0-flash"),
});

// ── AGENT VERIFICATION ─────────────────────────────────────
export const agentVerifications = pgTable("agent_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").notNull().references(() => users.id),
  country: countryEnum("country").notNull(),
  documentUrl: text("document_url").notNull(), // Firebase Storage URL
  extractedLicenseNumber: varchar("extracted_license_number", { length: 64 }),
  extractedExpiryDate: timestamp("extracted_expiry_date"),
  extractedIssuingAuthority: varchar("extracted_issuing_authority", { length: 128 }),
  aiConfidenceScore: decimal("ai_confidence_score", { precision: 5, scale: 2 }),
  verificationMethod: verificationMethodEnum("verification_method"),
  verificationStatus: varchar("verification_status", { length: 32 }).default("pending"),
  rejectionReason: text("rejection_reason"),
  reviewedBy: varchar("reviewed_by"), // null = AI reviewed, admin user uuid
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── SUBSCRIPTIONS TABLE ───────────────────────────────────────────
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 64 }).unique(),
  plan: varchar("plan", { length: 32 }).notNull(),
  status: varchar("status", { length: 32 }).default("active"),
  country: countryEnum("country").notNull(),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  cancelledAt: timestamp("cancelled_at"),
  trialEndsAt: timestamp("trial_ends_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── REVIEWS TABLE ─────────────────────────────────────────────────
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").notNull().references(() => users.id),
  customerId: varchar("customer_id").notNull().references(() => users.id),
  customerRequestId: varchar("customer_request_id").notNull(),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── WHATSAPP OPT-IN TRACKING ──────────────────────────────────────
export const whatsappOptIns = pgTable("whatsapp_opt_ins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  phoneNumber: varchar("phone_number").notNull().unique(),
  optedIn: boolean("opted_in").default(true),
  optedInAt: timestamp("opted_in_at").defaultNow(),
  optedInSource: varchar("opted_in_source", { length: 32 }),
  optedOutAt: timestamp("opted_out_at"),
  lastMessageAt: timestamp("last_message_at"),
  // 24-hour window tracking
  customerWindowOpensAt: timestamp("customer_window_opens_at"),
});

// ── AGENT PRE-REGISTRATION (USSD) ──────────────────────────
export const agentPreRegistrations = pgTable("agent_pre_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: varchar("phone_number").notNull(),
  name: varchar("name").notNull(),
  licenseNumber: varchar("license_number"),
  city: varchar("city"),
  country: countryEnum("country").default("ZW"),
  source: varchar("source").default("ussd"),
  status: varchar("status").default("ussd_pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── GLOBAL AGENT REGISTRY (DISCOVERY) ──────────────────────
export const globalAgentRegistry = pgTable("global_agent_registry", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  email: varchar("email"),
  phone: varchar("phone"),
  agencyName: varchar("agency_name"),
  licenseNumber: varchar("license_number"),
  country: countryEnum("country").notNull().default("ZW"),
  city: varchar("city"),
  areasCovered: text("areas_covered").array(),
  specializations: text("specializations").array(),
  externalRating: decimal("external_rating", { precision: 3, scale: 2 }),
  sourceUrl: text("source_url"), // URL where the agent was found
  lastSeenAt: timestamp("last_seen_at").defaultNow(),
  isPlatformUser: boolean("is_platform_user").default(false),
  platformUserId: varchar("platform_user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Balances table
export const balances = pgTable("balances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  available: decimal("available", { precision: 12, scale: 2 }).default("0.00"),
  pending: decimal("pending", { precision: 12, scale: 2 }).default("0.00"),
  lifetimeEarnings: decimal("lifetime_earnings", { precision: 12, scale: 2 }).default("0.00"),
  currency: currencyEnum("currency").default("USD"),
  lastPayoutAt: timestamp("last_payout_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ── WORKFLOW AUDIT LOG ─────────────────────────────────────
export const workflowLogs = pgTable("workflow_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workflowName: varchar("workflow_name", { length: 128 }).notNull(),
  n8nExecutionId: varchar("n8n_execution_id", { length: 64 }),
  triggerType: varchar("trigger_type", { length: 64 }), // webhook, cron, event
  triggerPayload: jsonb("trigger_payload"),
  status: workflowStatusEnum("status").default("pending"),
  entityType: varchar("entity_type", { length: 32 }), // user, lead, agent, referral
  entityId: varchar("entity_id"),
  resultSummary: jsonb("result_summary"),
  errorMessage: text("error_message"),
  durationMs: integer("duration_ms"),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// ── COMMUNICATIONS LOG ─────────────────────────────────────
export const communicationLogs = pgTable("communication_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  channel: commChannelEnum("channel").notNull(),
  provider: varchar("provider", { length: 32 }), // brevo, twilio, africastalking
  templateName: varchar("template_name", { length: 128 }),
  toAddress: varchar("to_address", { length: 128 }), // email or phone
  subject: text("subject"),
  status: varchar("status", { length: 32 }).default("sent"), // sent, delivered, opened, failed
  providerMessageId: varchar("provider_message_id", { length: 128 }),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  failureReason: text("failure_reason"),
  sentAt: timestamp("sent_at").defaultNow(),
});

// ── PAYMENTS (ENHANCED) ────────────────────────────────────
export const paymentTransactions = pgTable("payment_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type", { length: 32 }).notNull(), // subscription, commission, payout, refund
  provider: paymentProviderEnum("provider").notNull(),
  providerTransactionId: varchar("provider_transaction_id", { length: 128 }),
  amountLocal: decimal("amount_local", { precision: 12, scale: 2 }).notNull(),
  currency: currencyEnum("currency").notNull(),
  amountUsd: decimal("amount_usd", { precision: 12, scale: 2 }), // normalized
  exchangeRateUsed: decimal("exchange_rate_used", { precision: 10, scale: 6 }),
  status: varchar("status", { length: 32 }).default("pending"),
  stripeTransferId: varchar("stripe_transfer_id", { length: 128 }),
  relatedReferralId: varchar("related_referral_id"),
  receiptUrl: text("receipt_url"), // Firebase Storage PDF
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ── MARKET INTELLIGENCE SNAPSHOTS ─────────────────────────
export const marketSnapshots = pgTable("market_snapshots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  country: countryEnum("country").notNull(),
  city: varchar("city", { length: 64 }),
  district: varchar("district", { length: 128 }),
  propertyType: propertyTypeEnum("property_type"),
  avgRentLocal: decimal("avg_rent_local", { precision: 10, scale: 2 }),
  avgRentUsd: decimal("avg_rent_usd", { precision: 10, scale: 2 }),
  currency: currencyEnum("currency"),
  dataSourceUrl: text("data_source_url"),
  geminiAnalysis: text("gemini_analysis"),
  trendDirection: varchar("trend_direction", { length: 16 }), // up, down, stable
  trendPercentage: decimal("trend_percentage", { precision: 5, scale: 2 }),
  snapshotDate: timestamp("snapshot_date").defaultNow(),
});

// ── PROPERTY PHOTOS INTELLIGENCE ──────────────────────────
export const propertyPhotoAnalysis = pgTable("property_photo_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  photoUrl: text("photo_url").notNull(),
  detectedAmenities: jsonb("detected_amenities"), // ["AC", "balcony", "parking"]
  estimatedRoomSizeSqm: decimal("estimated_room_size_sqm", { precision: 6, scale: 2 }),
  qualityScore: integer("quality_score"), // 0-100, auto-reject if < 30
  isRejected: boolean("is_rejected").default(false),
  rejectionReason: text("rejection_reason"),
  analysedAt: timestamp("analysed_at").defaultNow(),
});

// ── EXCHANGE RATES ──────────────────────────────────────────
export const exchangeRates = pgTable("exchange_rates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromCurrency: currencyEnum("from_currency").notNull(),
  toCurrency: currencyEnum("to_currency").notNull(),
  rate: decimal("rate", { precision: 12, scale: 6 }).notNull(),
  source: varchar("source", { length: 32 }),
  fetchedAt: timestamp("fetched_at").defaultNow(),
}, (t) => ({
  uniquePair: index("unique_pair_idx").on(t.fromCurrency, t.toCurrency), // unique index
}));

// ── AGENT AVAILABILITY ──────────────────────────────────────
export const agentAvailability = pgTable("agent_availability", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").notNull().references(() => users.id).unique(),
  timezone: varchar("timezone", { length: 64 }).default("Africa/Harare"),
  weeklySchedule: jsonb("weekly_schedule").notNull(), // { mon: {start, end, active}, ... }
  autoReplyOutsideHours: boolean("auto_reply_outside_hours").default(true),
  autoReplyMessage: text("auto_reply_message"),
  vacationMode: boolean("vacation_mode").default(false),
  vacationUntil: timestamp("vacation_until"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ── DISPUTES ───────────────────────────────────────────────
export const disputes = pgTable("disputes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerRequestId: varchar("customer_request_id").notNull().references(() => customerRequests.id),
  raisedByUserId: varchar("raised_by_user_id").notNull().references(() => users.id),
  againstUserId: varchar("against_user_id").notNull().references(() => users.id),
  category: varchar("category", { length: 64 }).notNull(),
  description: text("description").notNull(),
  evidenceUrls: jsonb("evidence_urls").default([]),
  status: disputeStatusEnum("status").default("open"),
  assignedAdminId: varchar("assigned_admin_id").references(() => users.id),
  resolution: text("resolution"),
  resolvedAt: timestamp("resolved_at"),
  commissionHeld: boolean("commission_held").default(false),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const disputeMessages = pgTable("dispute_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  disputeId: varchar("dispute_id").notNull().references(() => disputes.id),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  senderRole: varchar("sender_role", { length: 16 }).notNull(),
  message: text("message").notNull(),
  attachmentUrls: jsonb("attachment_urls").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── SAVED SEARCHES ──────────────────────────────────────────
export const savedSearches = pgTable("saved_searches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => users.id),
  name: varchar("name", { length: 64 }),
  criteria: jsonb("criteria").notNull(),
  alertChannel: commChannelEnum("alert_channel").default("push"),
  alertFrequency: varchar("alert_frequency", { length: 16 }).default("instant"),
  isActive: boolean("is_active").default(true),
  lastAlertSentAt: timestamp("last_alert_sent_at"),
  matchCount: integer("match_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── COOKIE CONSENTS ─────────────────────────────────────────
export const cookieConsents = pgTable("cookie_consents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  sessionId: varchar("session_id", { length: 64 }),
  country: countryEnum("country").notNull(),
  analyticsAccepted: boolean("analytics_accepted").default(false),
  marketingAccepted: boolean("marketing_accepted").default(false),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  consentedAt: timestamp("consented_at").defaultNow(),
});

// ── FLAGGED CONTENT ─────────────────────────────────────────
export const flaggedContent = pgTable("flagged_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentType: varchar("content_type", { length: 32 }).notNull(), // message, photo, property
  contentId: varchar("content_id").notNull(),
  flaggedBy: varchar("flagged_by", { length: 64 }).notNull(), // ai_moderation, user_id, admin_id
  reason: text("reason"),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  status: varchar("status", { length: 32 }).default("pending"), // pending, reviewed, dismissed, resolved
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


// NOTE: Performance indexes should be defined inside each pgTable's 3rd arg
// (see exchangeRates above for the correct pattern).
// The following standalone index calls were removed because drizzle-orm
// does not support index().on() outside of a pgTable definition:
//   - lead_intelligence_request_idx
//   - agent_scores_agent_idx
//   - workflow_logs_entity_idx
//   - comm_logs_user_idx


// ── RELATIONS ─────────────────────────────

export const leadIntelligenceRelations = relations(leadIntelligence, ({ one }) => ({
  request: one(customerRequests, {
    fields: [leadIntelligence.customerRequestId],
    references: [customerRequests.id],
  }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  agentProfile: one(agentProfiles, {
    fields: [users.id],
    references: [agentProfiles.userId],
  }),
  referrerProfile: one(referrerProfiles, {
    fields: [users.id],
    references: [referrerProfiles.userId],
  }),
  houseOwnerProfile: one(houseOwnerProfiles, {
    fields: [users.id],
    references: [houseOwnerProfiles.userId],
  }),
  userProfile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  customerRequests: many(customerRequests),
  sentMessages: many(messages),
  notifications: many(notifications),
  payments: many(payments),
  agentScores: one(agentScores),
  agentVerifications: many(agentVerifications),
  globalRegistryEntry: one(globalAgentRegistry, {
    fields: [users.id],
    references: [globalAgentRegistry.platformUserId],
  }),
  paymentTransactions: many(paymentTransactions),
  communicationLogs: many(communicationLogs),
  referrals: many(users, { relationName: 'referredBy' }),
  referrer: one(users, {
    fields: [users.referredByUserId],
    references: [users.id],
    relationName: 'referredBy'
  }),
  settlementsAsPayer: many(commissionSettlements, { relationName: 'payer' }),
  settlementsAsPayee: many(commissionSettlements, { relationName: 'payee' }),
}));

export const customerRequestsRelations = relations(customerRequests, ({ one, many }) => ({
  customer: one(users, {
    fields: [customerRequests.customerId],
    references: [users.id],
  }),
  leads: many(leads),
  intelligence: one(leadIntelligence, {
    fields: [customerRequests.id],
    references: [leadIntelligence.customerRequestId],
  }),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  customer: one(users, {
    fields: [leads.customerId],
    references: [users.id],
  }),
  agent: one(users, {
    fields: [leads.agentId],
    references: [users.id],
  }),
  request: one(customerRequests, {
    fields: [leads.requestId],
    references: [customerRequests.id],
  }),
  conversation: one(conversations),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  lead: one(leads, {
    fields: [conversations.leadId],
    references: [leads.id],
  }),
  customer: one(users, {
    fields: [conversations.customerId],
    references: [users.id],
  }),
  agent: one(users, {
    fields: [conversations.agentId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomerRequestSchema = createInsertSchema(customerRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAgentProfileSchema = createInsertSchema(agentProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReferrerProfileSchema = createInsertSchema(referrerProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReferralLinkSchema = createInsertSchema(referralLinks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertAgentScoreSchema = createInsertSchema(agentScores).omit({
  id: true,
  updatedAt: true,
});

export const insertLeadIntelligenceSchema = createInsertSchema(leadIntelligence).omit({
  id: true,
  scoredAt: true,
});

export const insertAgentVerificationSchema = createInsertSchema(agentVerifications).omit({
  id: true,
  createdAt: true,
});

export const insertWorkflowLogSchema = createInsertSchema(workflowLogs).omit({
  id: true,
  startedAt: true,
});

export const insertCommunicationLogSchema = createInsertSchema(communicationLogs).omit({
  id: true,
  sentAt: true,
});

export const insertPaymentTransactionSchema = createInsertSchema(paymentTransactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMarketSnapshotSchema = createInsertSchema(marketSnapshots).omit({
  id: true,
  snapshotDate: true,
});

export const insertPropertyPhotoAnalysisSchema = createInsertSchema(propertyPhotoAnalysis).omit({
  id: true,
  analysedAt: true,
});

// ── NEW ADVANCED FEATURES TABLES ─────────────────────────────

export const leadAuctions = pgTable("lead_auctions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerRequestId: varchar("customer_request_id").notNull().references(() => customerRequests.id),
  status: varchar("status", { length: 32 }).default("open"),
  openedAt: timestamp("opened_at").defaultNow(),
  closesAt: timestamp("closes_at").notNull(), // 4 hours after opening
  maxPitches: integer("max_pitches").default(5),
  winningAgentId: varchar("winning_agent_id").references(() => users.id),
  customerSelectedAt: timestamp("customer_selected_at"),
});

export const agentPitches = pgTable("agent_pitches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  auctionId: varchar("auction_id").notNull().references(() => leadAuctions.id),
  agentId: varchar("agent_id").notNull().references(() => users.id),
  pitch: text("pitch").notNull(),           // 200 word max elevator pitch
  proposedTimeline: varchar("proposed_timeline", { length: 64 }),
  specialOffer: varchar("special_offer", { length: 128 }),
  trustScore: integer("trust_score"),       // snapshot at time of pitch
  aiPitchScore: integer("ai_pitch_score"), // Gemini scores the pitch quality
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const tenancyRecords = pgTable("tenancy_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => users.id),
  agentId: varchar("agent_id").notNull().references(() => users.id),
  propertyId: varchar("property_id").references(() => properties.id),
  customerRequestId: varchar("customer_request_id").references(() => customerRequests.id),
  leaseStartDate: timestamp("lease_start_date").notNull(),
  leaseEndDate: timestamp("lease_end_date").notNull(),
  monthlyRent: decimal("monthly_rent", { precision: 10, scale: 2 }).notNull(),
  currency: currencyEnum("currency").notNull(),
  renewalReminderSentAt: timestamp("renewal_reminder_sent_at"),
  renewedAt: timestamp("renewed_at"),
  country: countryEnum("country").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const backgroundChecks = pgTable("background_checks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  checkId: varchar("check_id").notNull().unique(),
  agentId: varchar("agent_id").notNull().references(() => users.id),
  tenantName: varchar("tenant_name").notNull(),
  tenantIdNumber: varchar("tenant_id_number").notNull(),
  proposedRent: decimal("proposed_rent", { precision: 12, scale: 2 }).notNull(),
  currency: currencyEnum("currency").notNull(),
  country: countryEnum("country").notNull(),
  status: varchar("status", { length: 32 }).default("pending"),
  reportUrl: text("report_url"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const collaborationRequests = pgTable("collaboration_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  initiatingAgentId: varchar("initiating_agent_id").notNull().references(() => users.id),
  targetAgentId: varchar("target_agent_id").notNull().references(() => users.id),
  customerRequestId: varchar("customer_request_id").notNull().references(() => customerRequests.id),
  proposedSplit: integer("proposed_split").notNull(), // 50 = 50/50, 60 = 60/40 to initiator
  reason: text("reason"),
  status: varchar("status", { length: 32 }).default("pending"),
  acceptedAt: timestamp("accepted_at"),
  declinedAt: timestamp("declined_at"),
  splitFinalised: boolean("split_finalised").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementId: varchar("achievement_id", { length: 64 }).notNull(),
  points: integer("points").notNull(),
  awardedAt: timestamp("awarded_at").defaultNow(),
});

export const neighbourhoodProfiles = pgTable("neighbourhood_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  area: varchar("area", { length: 128 }).notNull(),
  city: varchar("city", { length: 64 }).notNull(),
  country: countryEnum("country").notNull(),
  scores: jsonb("scores").notNull(), // { safety, transport, ... }
  insights: jsonb("insights").default([]),
  bestFor: jsonb("best_for").default([]),
  avoidIf: jsonb("avoid_if").default([]),
  localTips: jsonb("local_tips").default([]),
  priceDirection: varchar("price_direction", { length: 16 }),
  geminiSummary: text("gemini_summary"),
  sources: jsonb("sources").default([]),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const competitorPrices = pgTable("competitor_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  source: varchar("source", { length: 32 }).notNull(),
  propertyType: varchar("property_type", { length: 64 }).notNull(),
  city: varchar("city", { length: 64 }).notNull(),
  district: varchar("district", { length: 128 }),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  currency: currencyEnum("currency").notNull(),
  bedrooms: integer("bedrooms"),
  sizeSqm: decimal("size_sqm", { precision: 8, scale: 2 }),
  scrapedAt: timestamp("scraped_at").defaultNow(),
});

// ── COMMISSION SETTLEMENTS (Pyramid/Tiered referrals) ─────────
export const commissionSettlements = pgTable("commission_settlements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dealId: varchar("deal_id").notNull().references(() => leads.id),
  payerId: varchar("payer_id").notNull().references(() => users.id),
  payeeId: varchar("payee_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: currencyEnum("currency").notNull().default("USD"),
  level: integer("level").notNull(), // 1 for direct, 2 for grand-parent, etc.
  status: varchar("status", { length: 32 }).default("pending"), // pending, paid, disputed
  evidenceUrl: text("evidence_url"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod schemas for new tables
export const insertLeadAuctionSchema = createInsertSchema(leadAuctions).omit({ id: true, openedAt: true });
export const insertAgentPitchSchema = createInsertSchema(agentPitches).omit({ id: true, submittedAt: true });
export const insertTenancyRecordSchema = createInsertSchema(tenancyRecords).omit({ id: true, createdAt: true });
export const insertBackgroundCheckSchema = createInsertSchema(backgroundChecks).omit({ id: true, createdAt: true });
export const insertCollaborationRequestSchema = createInsertSchema(collaborationRequests).omit({ id: true, createdAt: true });
export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({ id: true, awardedAt: true });
export const insertNeighbourhoodProfileSchema = createInsertSchema(neighbourhoodProfiles).omit({ id: true, lastUpdated: true });
export const insertCompetitorPriceSchema = createInsertSchema(competitorPrices).omit({ id: true, scrapedAt: true });
export const insertHouseOwnerProfileSchema = createInsertSchema(houseOwnerProfiles).omit({ id: true, createdAt: true, updatedAt: true });

// Types
export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type CustomerRequest = typeof customerRequests.$inferSelect;
export type AgentProfile = typeof agentProfiles.$inferSelect;
export type ReferrerProfile = typeof referrerProfiles.$inferSelect;
export type ReferralLink = typeof referralLinks.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Property = typeof properties.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type AgentScore = typeof agentScores.$inferSelect;
export type LeadIntelligence = typeof leadIntelligence.$inferSelect;
export type AgentVerification = typeof agentVerifications.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type WhatsappOptIn = typeof whatsappOptIns.$inferSelect;
export type AgentPreRegistration = typeof agentPreRegistrations.$inferSelect;
export type Balance = typeof balances.$inferSelect;
export type WorkflowLog = typeof workflowLogs.$inferSelect;
export type CommunicationLog = typeof communicationLogs.$inferSelect;
export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type MarketSnapshot = typeof marketSnapshots.$inferSelect;
export type PropertyPhotoAnalysis = typeof propertyPhotoAnalysis.$inferSelect;
export type ExchangeRate = typeof exchangeRates.$inferSelect;
export type AgentAvailability = typeof agentAvailability.$inferSelect;
export type Dispute = typeof disputes.$inferSelect;
export type DisputeMessage = typeof disputeMessages.$inferSelect;
export type SavedSearch = typeof savedSearches.$inferSelect;
export type CookieConsent = typeof cookieConsents.$inferSelect;
export type FlaggedContent = typeof flaggedContent.$inferSelect;

export type LeadAuction = typeof leadAuctions.$inferSelect;
export type AgentPitch = typeof agentPitches.$inferSelect;
export type TenancyRecord = typeof tenancyRecords.$inferSelect;
export type BackgroundCheck = typeof backgroundChecks.$inferSelect;
export type CollaborationRequest = typeof collaborationRequests.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type NeighbourhoodProfile = typeof neighbourhoodProfiles.$inferSelect;
export type CompetitorPrice = typeof competitorPrices.$inferSelect;
export type CommissionSettlement = typeof commissionSettlements.$inferSelect;
export type HouseOwnerProfile = typeof houseOwnerProfiles.$inferSelect;
export type GlobalAgentRegistry = typeof globalAgentRegistry.$inferSelect;

export const insertExchangeRateSchema = createInsertSchema(exchangeRates).omit({
  id: true,
  fetchedAt: true,
});

export const insertGlobalAgentRegistrySchema = createInsertSchema(globalAgentRegistry).omit({
  id: true,
  createdAt: true,
});

export const insertAgentAvailabilitySchema = createInsertSchema(agentAvailability).omit({
  id: true,
  updatedAt: true,
});

export const insertDisputeSchema = createInsertSchema(disputes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDisputeMessageSchema = createInsertSchema(disputeMessages).omit({
  id: true,
  createdAt: true,
});

export const insertSavedSearchSchema = createInsertSchema(savedSearches).omit({
  id: true,
  createdAt: true,
});

export const insertCommissionSettlementSchema = createInsertSchema(commissionSettlements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCookieConsentSchema = createInsertSchema(cookieConsents).omit({
  id: true,
  consentedAt: true,
});

// Insert types
export type UpsertUser = typeof users.$inferInsert;
export type InsertCustomerRequest = z.infer<typeof insertCustomerRequestSchema>;
export type InsertAgentProfile = z.infer<typeof insertAgentProfileSchema>;
export type InsertReferrerProfile = z.infer<typeof insertReferrerProfileSchema>;
export type InsertReferralLink = z.infer<typeof insertReferralLinkSchema>;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type InsertCommissionSettlement = z.infer<typeof insertCommissionSettlementSchema>;
export type InsertHouseOwnerProfile = z.infer<typeof insertHouseOwnerProfileSchema>;
