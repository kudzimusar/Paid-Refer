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
export const userRoleEnum = pgEnum('user_role', ['customer', 'agent', 'referrer', 'admin']);
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
  firebaseUid: varchar("firebase_uid", { length: 128 }).unique(),
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
  lastActiveAt: timestamp("last_active_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customer requests
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
  closedAt: timestamp("closed_at"),
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

// Properties (for agent sharing)
export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").references(() => users.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  price: integer("price"),
  propertyType: propertyTypeEnum("property_type"),
  area: varchar("area"),
  address: text("address"),
  features: text("features").array(),
  imageUrls: text("image_urls").array(),
  isAvailable: boolean("is_available").default(true),
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

// Notifications
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type"), // 'new_lead', 'message', 'payment', 'system'
  isRead: boolean("is_read").default(false),
  actionUrl: varchar("action_url"),
  metadata: jsonb("metadata"),
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
  customerRatingAvg: decimal("customer_rating_avg", { precision: 3, scale: 2 }),
  reliabilityIndex: decimal("reliability_index", { precision: 5, scale: 2 }), // Gemini synthesized
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
  modelVersion: varchar("model_version", { length: 32 }).default("gemini-1.5-pro"),
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

// ── BALANCES ───────────────────────────────────────────────
export const balances = pgTable("balances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  available: decimal("available", { precision: 12, scale: 2 }).default("0.00"),
  pending: decimal("pending", { precision: 12, scale: 2 }).default("0.00"),
  currency: currencyEnum("currency").default("USD"),
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

// Indexes for performance
export const leadIntelligenceIdx = index("lead_intelligence_request_idx")
  .on(leadIntelligence.customerRequestId);

export const agentScoresIdx = index("agent_scores_agent_idx")
  .on(agentScores.agentId);

export const workflowLogsIdx = index("workflow_logs_entity_idx")
  .on(workflowLogs.entityType, workflowLogs.entityId);

export const communicationLogsIdx = index("comm_logs_user_idx")
  .on(communicationLogs.userId, communicationLogs.sentAt);

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  agentProfile: one(agentProfiles, {
    fields: [users.id],
    references: [agentProfiles.userId],
  }),
  referrerProfile: one(referrerProfiles, {
    fields: [users.id],
    references: [referrerProfiles.userId],
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
  paymentTransactions: many(paymentTransactions),
  communicationLogs: many(communicationLogs),
}));

export const customerRequestsRelations = relations(customerRequests, ({ one, many }) => ({
  customer: one(users, {
    fields: [customerRequests.customerId],
    references: [users.id],
  }),
  leads: many(leads),
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

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type CustomerRequest = typeof customerRequests.$inferSelect;
export type InsertCustomerRequest = z.infer<typeof insertCustomerRequestSchema>;
export type AgentProfile = typeof agentProfiles.$inferSelect;
export type InsertAgentProfile = z.infer<typeof insertAgentProfileSchema>;
export type ReferrerProfile = typeof referrerProfiles.$inferSelect;
export type InsertReferrerProfile = z.infer<typeof insertReferrerProfileSchema>;
export type ReferralLink = typeof referralLinks.$inferSelect;
export type InsertReferralLink = z.infer<typeof insertReferralLinkSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
