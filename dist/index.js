var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  agentAvailability: () => agentAvailability,
  agentPitches: () => agentPitches,
  agentPreRegistrations: () => agentPreRegistrations,
  agentProfiles: () => agentProfiles2,
  agentScores: () => agentScores,
  agentVerifications: () => agentVerifications,
  backgroundChecks: () => backgroundChecks,
  balances: () => balances,
  collaborationRequests: () => collaborationRequests,
  commChannelEnum: () => commChannelEnum,
  communicationLogs: () => communicationLogs,
  competitorPrices: () => competitorPrices,
  contactMethodEnum: () => contactMethodEnum,
  conversations: () => conversations2,
  conversationsRelations: () => conversationsRelations,
  cookieConsents: () => cookieConsents,
  countryEnum: () => countryEnum,
  currencyEnum: () => currencyEnum,
  customerRequests: () => customerRequests,
  customerRequestsRelations: () => customerRequestsRelations,
  disputeMessages: () => disputeMessages,
  disputeStatusEnum: () => disputeStatusEnum,
  disputes: () => disputes,
  exchangeRates: () => exchangeRates,
  flaggedContent: () => flaggedContent,
  insertAgentAvailabilitySchema: () => insertAgentAvailabilitySchema,
  insertAgentPitchSchema: () => insertAgentPitchSchema,
  insertAgentProfileSchema: () => insertAgentProfileSchema,
  insertAgentScoreSchema: () => insertAgentScoreSchema,
  insertAgentVerificationSchema: () => insertAgentVerificationSchema,
  insertBackgroundCheckSchema: () => insertBackgroundCheckSchema,
  insertCollaborationRequestSchema: () => insertCollaborationRequestSchema,
  insertCommunicationLogSchema: () => insertCommunicationLogSchema,
  insertCompetitorPriceSchema: () => insertCompetitorPriceSchema,
  insertConversationSchema: () => insertConversationSchema,
  insertCookieConsentSchema: () => insertCookieConsentSchema,
  insertCustomerRequestSchema: () => insertCustomerRequestSchema,
  insertDisputeMessageSchema: () => insertDisputeMessageSchema,
  insertDisputeSchema: () => insertDisputeSchema,
  insertExchangeRateSchema: () => insertExchangeRateSchema,
  insertLeadAuctionSchema: () => insertLeadAuctionSchema,
  insertLeadIntelligenceSchema: () => insertLeadIntelligenceSchema,
  insertLeadSchema: () => insertLeadSchema,
  insertMarketSnapshotSchema: () => insertMarketSnapshotSchema,
  insertMessageSchema: () => insertMessageSchema,
  insertNeighbourhoodProfileSchema: () => insertNeighbourhoodProfileSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertPaymentSchema: () => insertPaymentSchema,
  insertPaymentTransactionSchema: () => insertPaymentTransactionSchema,
  insertPropertyPhotoAnalysisSchema: () => insertPropertyPhotoAnalysisSchema,
  insertPropertySchema: () => insertPropertySchema,
  insertReferralLinkSchema: () => insertReferralLinkSchema,
  insertReferrerProfileSchema: () => insertReferrerProfileSchema,
  insertSavedSearchSchema: () => insertSavedSearchSchema,
  insertTenancyRecordSchema: () => insertTenancyRecordSchema,
  insertUserAchievementSchema: () => insertUserAchievementSchema,
  insertUserProfileSchema: () => insertUserProfileSchema,
  insertUserSchema: () => insertUserSchema,
  insertWorkflowLogSchema: () => insertWorkflowLogSchema,
  leadAuctions: () => leadAuctions,
  leadIntelligence: () => leadIntelligence,
  leadIntelligenceRelations: () => leadIntelligenceRelations,
  leadScoreEnum: () => leadScoreEnum,
  leadStatusEnum: () => leadStatusEnum,
  leads: () => leads,
  leadsRelations: () => leadsRelations,
  marketSnapshots: () => marketSnapshots,
  messageTypeEnum: () => messageTypeEnum,
  messages: () => messages,
  messagesRelations: () => messagesRelations,
  neighbourhoodProfiles: () => neighbourhoodProfiles,
  notificationTypeEnum: () => notificationTypeEnum,
  notifications: () => notifications,
  onboardingStatusEnum: () => onboardingStatusEnum,
  paymentProviderEnum: () => paymentProviderEnum,
  paymentTransactions: () => paymentTransactions,
  payments: () => payments,
  properties: () => properties,
  propertyPhotoAnalysis: () => propertyPhotoAnalysis,
  propertyStatusEnum: () => propertyStatusEnum,
  propertyTypeEnum: () => propertyTypeEnum,
  referralLinks: () => referralLinks,
  referrerProfiles: () => referrerProfiles,
  requestStatusEnum: () => requestStatusEnum,
  reviews: () => reviews,
  savedSearches: () => savedSearches,
  sessions: () => sessions,
  subscriptionStatusEnum: () => subscriptionStatusEnum,
  subscriptions: () => subscriptions,
  tenancyRecords: () => tenancyRecords,
  userAchievements: () => userAchievements,
  userProfiles: () => userProfiles2,
  userRoleEnum: () => userRoleEnum,
  users: () => users2,
  usersRelations: () => usersRelations,
  verificationMethodEnum: () => verificationMethodEnum,
  whatsappOptIns: () => whatsappOptIns,
  workflowLogs: () => workflowLogs,
  workflowStatusEnum: () => workflowStatusEnum
});
import { sql, relations } from "drizzle-orm";
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
  pgEnum
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions, userRoleEnum, requestStatusEnum, propertyTypeEnum, contactMethodEnum, messageTypeEnum, leadStatusEnum, countryEnum, currencyEnum, leadScoreEnum, verificationMethodEnum, paymentProviderEnum, commChannelEnum, workflowStatusEnum, onboardingStatusEnum, subscriptionStatusEnum, propertyStatusEnum, notificationTypeEnum, disputeStatusEnum, users2, userProfiles2, customerRequests, agentProfiles2, referrerProfiles, referralLinks, leads, conversations2, messages, properties, payments, notifications, agentScores, leadIntelligence, agentVerifications, subscriptions, reviews, whatsappOptIns, agentPreRegistrations, balances, workflowLogs, communicationLogs, paymentTransactions, marketSnapshots, propertyPhotoAnalysis, exchangeRates, agentAvailability, disputes, disputeMessages, savedSearches, cookieConsents, flaggedContent, leadIntelligenceRelations, usersRelations, customerRequestsRelations, leadsRelations, conversationsRelations, messagesRelations, insertUserSchema, insertCustomerRequestSchema, insertAgentProfileSchema, insertReferrerProfileSchema, insertReferralLinkSchema, insertLeadSchema, insertConversationSchema, insertMessageSchema, insertPropertySchema, insertPaymentSchema, insertNotificationSchema, insertUserProfileSchema, insertAgentScoreSchema, insertLeadIntelligenceSchema, insertAgentVerificationSchema, insertWorkflowLogSchema, insertCommunicationLogSchema, insertPaymentTransactionSchema, insertMarketSnapshotSchema, insertPropertyPhotoAnalysisSchema, leadAuctions, agentPitches, tenancyRecords, backgroundChecks, collaborationRequests, userAchievements, neighbourhoodProfiles, competitorPrices, insertLeadAuctionSchema, insertAgentPitchSchema, insertTenancyRecordSchema, insertBackgroundCheckSchema, insertCollaborationRequestSchema, insertUserAchievementSchema, insertNeighbourhoodProfileSchema, insertCompetitorPriceSchema, insertExchangeRateSchema, insertAgentAvailabilitySchema, insertDisputeSchema, insertDisputeMessageSchema, insertSavedSearchSchema, insertCookieConsentSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    sessions = pgTable(
      "sessions",
      {
        sid: varchar("sid").primaryKey(),
        sess: jsonb("sess").notNull(),
        expire: timestamp("expire").notNull()
      },
      (table) => [index("IDX_session_expire").on(table.expire)]
    );
    userRoleEnum = pgEnum("user_role", ["customer", "agent", "referrer", "admin"]);
    requestStatusEnum = pgEnum("request_status", ["active", "matched", "completed", "cancelled"]);
    propertyTypeEnum = pgEnum("property_type", [
      // Japan
      "1K",
      "1DK",
      "1LDK",
      "2K",
      "2DK",
      "2LDK",
      "3K+",
      "1R",
      "3DK",
      "3LDK",
      "4LDK",
      // ZA
      "sectional_title",
      "full_title",
      "cluster",
      "estate",
      "townhouse",
      "apartment",
      // ZW
      "stand",
      "cluster_home",
      "house",
      "flat",
      "commercial",
      // Shared
      "other"
    ]);
    contactMethodEnum = pgEnum("contact_method", ["whatsapp", "line", "email", "phone", "sms", "ussd", "push"]);
    messageTypeEnum = pgEnum("message_type", ["text", "image", "file", "property_share"]);
    leadStatusEnum = pgEnum("lead_status", ["pending", "viewed", "contacted", "in_progress", "closed"]);
    countryEnum = pgEnum("country", ["ZW", "ZA", "JP"]);
    currencyEnum = pgEnum("currency", ["USD", "ZAR", "JPY"]);
    leadScoreEnum = pgEnum("lead_score", ["low", "medium", "high", "premium"]);
    verificationMethodEnum = pgEnum("verification_method", ["auto_ai", "manual_review", "auto_approved"]);
    paymentProviderEnum = pgEnum("payment_provider", ["stripe", "paynow", "pesapal", "payfast"]);
    commChannelEnum = pgEnum("comm_channel", ["email", "whatsapp", "sms", "line", "ussd", "push"]);
    workflowStatusEnum = pgEnum("workflow_status", ["pending", "running", "completed", "failed", "skipped"]);
    onboardingStatusEnum = pgEnum("onboarding_status", [
      "splash",
      "phone_verified",
      "role_selection",
      "contact_details",
      "role_specific",
      "verified",
      "completed"
    ]);
    subscriptionStatusEnum = pgEnum("subscription_status", ["inactive", "active", "grace_period", "suspended"]);
    propertyStatusEnum = pgEnum("property_status", [
      "draft",
      "active",
      "rented",
      "sold",
      "archived"
    ]);
    notificationTypeEnum = pgEnum("notification_type", [
      "new_lead",
      "lead_accepted",
      "lead_expired",
      "message",
      "payment",
      "payout",
      "verification",
      "system",
      "market_update"
    ]);
    disputeStatusEnum = pgEnum("dispute_status", [
      "open",
      "under_review",
      "awaiting_agent",
      "awaiting_customer",
      "resolved_agent_favour",
      "resolved_customer_favour",
      "resolved_split",
      "closed"
    ]);
    users2 = pgTable("users", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      email: varchar("email").unique(),
      firstName: varchar("first_name"),
      middleName: varchar("middle_name"),
      lastName: varchar("last_name"),
      phone: varchar("phone"),
      phoneCountryCode: varchar("phone_country_code").default("+81"),
      profileImageUrl: varchar("profile_image_url"),
      role: userRoleEnum("role").default("customer"),
      preferredContactMethod: contactMethodEnum("preferred_contact_method"),
      lineId: varchar("line_id"),
      whatsappNumber: varchar("whatsapp_number"),
      isVerified: boolean("is_verified").default(false),
      onboardingStatus: onboardingStatusEnum("onboarding_status").default("splash"),
      onboardingCompletedAt: timestamp("onboarding_completed_at"),
      stripeCustomerId: varchar("stripe_customer_id"),
      subscriptionStatus: subscriptionStatusEnum("subscription_status").default("inactive"),
      subscriptionRenewsAt: timestamp("subscription_renews_at"),
      firebaseUid: varchar("firebase_uid", { length: 128 }).unique(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    userProfiles2 = pgTable("user_profiles", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users2.id, { onDelete: "cascade" }),
      country: countryEnum("country").notNull().default("ZW"),
      currency: currencyEnum("currency").notNull().default("USD"),
      preferredChannel: commChannelEnum("preferred_channel").default("whatsapp"),
      stripeAccountId: varchar("stripe_account_id", { length: 64 }),
      lineUserId: varchar("line_user_id", { length: 64 }),
      // Japan
      ecocashNumber: varchar("ecocash_number", { length: 20 }),
      // Zimbabwe
      timezone: varchar("timezone", { length: 64 }).default("Africa/Harare"),
      locale: varchar("locale", { length: 10 }).default("en-ZW"),
      fcmToken: text("fcm_token"),
      // Firebase Cloud Messaging
      xp: integer("xp").default(0),
      lastActiveAt: timestamp("last_active_at"),
      createdAt: timestamp("created_at").defaultNow()
    });
    customerRequests = pgTable("customer_requests", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      customerId: varchar("customer_id").references(() => users2.id),
      // Nullable for USSD
      phoneNumber: varchar("phone_number"),
      // For USSD leads
      budgetMin: integer("budget_min"),
      budgetMax: integer("budget_max"),
      currency: currencyEnum("currency").default("USD"),
      preferredCity: varchar("preferred_city"),
      preferredAreas: text("preferred_areas").array(),
      propertyType: varchar("property_type"),
      // Flexible string for USSD/Varied types
      bedrooms: varchar("bedrooms"),
      country: countryEnum("country").default("ZW"),
      source: varchar("source").default("web"),
      // web, ussd, app
      moveInDate: varchar("move_in_date"),
      occupants: integer("occupants").default(1),
      mustHaveFeatures: text("must_have_features").array(),
      jobVisaType: varchar("job_visa_type"),
      additionalNotes: text("additional_notes"),
      status: varchar("status").default("pending"),
      assignedAgentId: varchar("assigned_agent_id").references(() => users2.id),
      assignedAt: timestamp("assigned_at"),
      conversationId: varchar("conversation_id"),
      serviceFeepaid: boolean("service_fee_paid").default(false),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    agentProfiles2 = pgTable("agent_profiles", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users2.id).notNull(),
      licenseNumber: varchar("license_number").notNull(),
      licenseUploadUrl: varchar("license_upload_url"),
      areasCovered: text("areas_covered").array(),
      propertyTypes: text("property_types").array(),
      languagesSpoken: text("languages_spoken").array(),
      specializations: text("specializations").array(),
      rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"),
      totalReviews: integer("total_reviews").default(0),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    referrerProfiles = pgTable("referrer_profiles", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users2.id).notNull(),
      bankDetails: jsonb("bank_details"),
      ewalletDetails: jsonb("ewallet_details"),
      preferredRewardMethod: varchar("preferred_reward_method"),
      totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0.00"),
      availableBalance: decimal("available_balance", { precision: 10, scale: 2 }).default("0.00"),
      totalReferrals: integer("total_referrals").default(0),
      successfulReferrals: integer("successful_referrals").default(0),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    referralLinks = pgTable("referral_links", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      referrerId: varchar("referrer_id").references(() => users2.id).notNull(),
      shortCode: varchar("short_code", { length: 12 }).unique().notNull(),
      landingPageUrl: text("landing_page_url"),
      // Firebase Hosting URL
      qrCodeUrl: text("qr_code_url"),
      // Firebase Storage URL
      targetCountry: countryEnum("target_country").notNull().default("ZW"),
      customSlug: varchar("custom_slug", { length: 64 }),
      // e.g. /by/tendai
      generatedCopyEn: text("generated_copy_en"),
      // AI ghostwritten promo copy
      generatedCopyJa: text("generated_copy_ja"),
      totalClicks: integer("total_clicks").default(0),
      totalSubmissions: integer("total_submissions").default(0),
      totalConversions: integer("total_conversions").default(0),
      totalEarningsUsd: decimal("total_earnings_usd", { precision: 10, scale: 2 }).default("0.00"),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    leads = pgTable("leads", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      customerId: varchar("customer_id").references(() => users2.id).notNull(),
      agentId: varchar("agent_id").references(() => users2.id).notNull(),
      requestId: varchar("request_id").references(() => customerRequests.id).notNull(),
      status: leadStatusEnum("status").default("pending"),
      matchScore: decimal("match_score", { precision: 3, scale: 2 }),
      aiSummary: text("ai_summary"),
      agentNotes: text("agent_notes"),
      lastContactAt: timestamp("last_contact_at"),
      acceptedAt: timestamp("accepted_at"),
      closedAt: timestamp("closed_at"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    conversations2 = pgTable("conversations", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      leadId: varchar("lead_id").references(() => leads.id).notNull(),
      customerId: varchar("customer_id").references(() => users2.id).notNull(),
      agentId: varchar("agent_id").references(() => users2.id).notNull(),
      lastMessageAt: timestamp("last_message_at"),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    messages = pgTable("messages", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      conversationId: varchar("conversation_id").references(() => conversations2.id).notNull(),
      senderId: varchar("sender_id").references(() => users2.id).notNull(),
      messageType: messageTypeEnum("message_type").default("text"),
      content: text("content"),
      fileUrl: varchar("file_url"),
      metadata: jsonb("metadata"),
      isRead: boolean("is_read").default(false),
      createdAt: timestamp("created_at").defaultNow()
    });
    properties = pgTable("properties", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      agentId: varchar("agent_id").notNull().references(() => users2.id),
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
      updatedAt: timestamp("updated_at").defaultNow()
    });
    payments = pgTable("payments", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users2.id).notNull(),
      amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
      currency: varchar("currency").default("JPY"),
      paymentType: varchar("payment_type"),
      // 'service_fee', 'referral_payout'
      stripePaymentIntentId: varchar("stripe_payment_intent_id"),
      status: varchar("status"),
      // 'pending', 'completed', 'failed'
      metadata: jsonb("metadata"),
      createdAt: timestamp("created_at").defaultNow()
    });
    notifications = pgTable("notifications", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users2.id),
      type: notificationTypeEnum("type").notNull(),
      title: varchar("title", { length: 128 }).notNull(),
      body: text("body"),
      data: jsonb("data"),
      isRead: boolean("is_read").default(false),
      readAt: timestamp("read_at"),
      channel: commChannelEnum("channel").default("push"),
      createdAt: timestamp("created_at").defaultNow()
    });
    agentScores = pgTable("agent_scores", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      agentId: varchar("agent_id").notNull().references(() => users2.id),
      responseRateScore: decimal("response_rate_score", { precision: 5, scale: 2 }).default("100"),
      conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }).default("0"),
      avgResponseTimeMinutes: integer("avg_response_time_minutes"),
      totalLeadsReceived: integer("total_leads_received").default(0),
      totalLeadsAccepted: integer("total_leads_accepted").default(0),
      totalDealsClosed: integer("total_deals_closed").default(0),
      customerRatingAvg: decimal("customer_rating_avg", { precision: 3, scale: 2 }),
      reliabilityIndex: decimal("reliability_index", { precision: 5, scale: 2 }),
      // Gemini synthesized
      reliabilityLastCalculatedAt: timestamp("reliability_last_calculated_at"),
      scoreBand: leadScoreEnum("score_band").default("medium"),
      // low/medium/high/premium agent tier
      updatedAt: timestamp("updated_at").defaultNow()
    });
    leadIntelligence = pgTable("lead_intelligence", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      customerRequestId: varchar("customer_request_id").notNull().references(() => customerRequests.id),
      geminiScore: integer("gemini_score"),
      // 0-100
      geminiReasoning: text("gemini_reasoning"),
      budgetRealism: decimal("budget_realism", { precision: 5, scale: 2 }),
      // % vs market avg
      urgencyTag: leadScoreEnum("urgency_tag"),
      estimatedCloseTimelineDays: integer("estimated_close_timeline_days"),
      suggestedAlternatives: jsonb("suggested_alternatives"),
      // Gemini budget/area suggestions
      marketContextSnapshot: jsonb("market_context_snapshot"),
      // market data at time of scoring
      scoredAt: timestamp("scored_at").defaultNow(),
      modelVersion: varchar("model_version", { length: 32 }).default("gemini-2.0-flash")
    });
    agentVerifications = pgTable("agent_verifications", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      agentId: varchar("agent_id").notNull().references(() => users2.id),
      country: countryEnum("country").notNull(),
      documentUrl: text("document_url").notNull(),
      // Firebase Storage URL
      extractedLicenseNumber: varchar("extracted_license_number", { length: 64 }),
      extractedExpiryDate: timestamp("extracted_expiry_date"),
      extractedIssuingAuthority: varchar("extracted_issuing_authority", { length: 128 }),
      aiConfidenceScore: decimal("ai_confidence_score", { precision: 5, scale: 2 }),
      verificationMethod: verificationMethodEnum("verification_method"),
      verificationStatus: varchar("verification_status", { length: 32 }).default("pending"),
      rejectionReason: text("rejection_reason"),
      reviewedBy: varchar("reviewed_by"),
      // null = AI reviewed, admin user uuid
      verifiedAt: timestamp("verified_at"),
      createdAt: timestamp("created_at").defaultNow()
    });
    subscriptions = pgTable("subscriptions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users2.id),
      stripeSubscriptionId: varchar("stripe_subscription_id", { length: 64 }).unique(),
      plan: varchar("plan", { length: 32 }).notNull(),
      status: varchar("status", { length: 32 }).default("active"),
      country: countryEnum("country").notNull(),
      currentPeriodStart: timestamp("current_period_start"),
      currentPeriodEnd: timestamp("current_period_end"),
      cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
      cancelledAt: timestamp("cancelled_at"),
      trialEndsAt: timestamp("trial_ends_at"),
      createdAt: timestamp("created_at").defaultNow()
    });
    reviews = pgTable("reviews", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      agentId: varchar("agent_id").notNull().references(() => users2.id),
      customerId: varchar("customer_id").notNull().references(() => users2.id),
      customerRequestId: varchar("customer_request_id").notNull(),
      rating: integer("rating").notNull(),
      // 1-5
      comment: text("comment"),
      isPublic: boolean("is_public").default(true),
      createdAt: timestamp("created_at").defaultNow()
    });
    whatsappOptIns = pgTable("whatsapp_opt_ins", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users2.id),
      phoneNumber: varchar("phone_number").notNull().unique(),
      optedIn: boolean("opted_in").default(true),
      optedInAt: timestamp("opted_in_at").defaultNow(),
      optedInSource: varchar("opted_in_source", { length: 32 }),
      optedOutAt: timestamp("opted_out_at"),
      lastMessageAt: timestamp("last_message_at"),
      // 24-hour window tracking
      customerWindowOpensAt: timestamp("customer_window_opens_at")
    });
    agentPreRegistrations = pgTable("agent_pre_registrations", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      phoneNumber: varchar("phone_number").notNull(),
      name: varchar("name").notNull(),
      licenseNumber: varchar("license_number"),
      city: varchar("city"),
      country: countryEnum("country").default("ZW"),
      source: varchar("source").default("ussd"),
      status: varchar("status").default("ussd_pending"),
      createdAt: timestamp("created_at").defaultNow()
    });
    balances = pgTable("balances", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users2.id).unique(),
      available: decimal("available", { precision: 12, scale: 2 }).default("0.00"),
      pending: decimal("pending", { precision: 12, scale: 2 }).default("0.00"),
      lifetimeEarnings: decimal("lifetime_earnings", { precision: 12, scale: 2 }).default("0.00"),
      currency: currencyEnum("currency").default("USD"),
      lastPayoutAt: timestamp("last_payout_at"),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    workflowLogs = pgTable("workflow_logs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workflowName: varchar("workflow_name", { length: 128 }).notNull(),
      n8nExecutionId: varchar("n8n_execution_id", { length: 64 }),
      triggerType: varchar("trigger_type", { length: 64 }),
      // webhook, cron, event
      triggerPayload: jsonb("trigger_payload"),
      status: workflowStatusEnum("status").default("pending"),
      entityType: varchar("entity_type", { length: 32 }),
      // user, lead, agent, referral
      entityId: varchar("entity_id"),
      resultSummary: jsonb("result_summary"),
      errorMessage: text("error_message"),
      durationMs: integer("duration_ms"),
      startedAt: timestamp("started_at").defaultNow(),
      completedAt: timestamp("completed_at")
    });
    communicationLogs = pgTable("communication_logs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users2.id),
      channel: commChannelEnum("channel").notNull(),
      provider: varchar("provider", { length: 32 }),
      // brevo, twilio, africastalking
      templateName: varchar("template_name", { length: 128 }),
      toAddress: varchar("to_address", { length: 128 }),
      // email or phone
      subject: text("subject"),
      status: varchar("status", { length: 32 }).default("sent"),
      // sent, delivered, opened, failed
      providerMessageId: varchar("provider_message_id", { length: 128 }),
      openedAt: timestamp("opened_at"),
      clickedAt: timestamp("clicked_at"),
      failureReason: text("failure_reason"),
      sentAt: timestamp("sent_at").defaultNow()
    });
    paymentTransactions = pgTable("payment_transactions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users2.id),
      type: varchar("type", { length: 32 }).notNull(),
      // subscription, commission, payout, refund
      provider: paymentProviderEnum("provider").notNull(),
      providerTransactionId: varchar("provider_transaction_id", { length: 128 }),
      amountLocal: decimal("amount_local", { precision: 12, scale: 2 }).notNull(),
      currency: currencyEnum("currency").notNull(),
      amountUsd: decimal("amount_usd", { precision: 12, scale: 2 }),
      // normalized
      exchangeRateUsed: decimal("exchange_rate_used", { precision: 10, scale: 6 }),
      status: varchar("status", { length: 32 }).default("pending"),
      stripeTransferId: varchar("stripe_transfer_id", { length: 128 }),
      relatedReferralId: varchar("related_referral_id"),
      receiptUrl: text("receipt_url"),
      // Firebase Storage PDF
      metadata: jsonb("metadata"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    marketSnapshots = pgTable("market_snapshots", {
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
      trendDirection: varchar("trend_direction", { length: 16 }),
      // up, down, stable
      trendPercentage: decimal("trend_percentage", { precision: 5, scale: 2 }),
      snapshotDate: timestamp("snapshot_date").defaultNow()
    });
    propertyPhotoAnalysis = pgTable("property_photo_analysis", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      propertyId: varchar("property_id").notNull().references(() => properties.id),
      photoUrl: text("photo_url").notNull(),
      detectedAmenities: jsonb("detected_amenities"),
      // ["AC", "balcony", "parking"]
      estimatedRoomSizeSqm: decimal("estimated_room_size_sqm", { precision: 6, scale: 2 }),
      qualityScore: integer("quality_score"),
      // 0-100, auto-reject if < 30
      isRejected: boolean("is_rejected").default(false),
      rejectionReason: text("rejection_reason"),
      analysedAt: timestamp("analysed_at").defaultNow()
    });
    exchangeRates = pgTable("exchange_rates", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      fromCurrency: currencyEnum("from_currency").notNull(),
      toCurrency: currencyEnum("to_currency").notNull(),
      rate: decimal("rate", { precision: 12, scale: 6 }).notNull(),
      source: varchar("source", { length: 32 }),
      fetchedAt: timestamp("fetched_at").defaultNow()
    }, (t) => ({
      uniquePair: index("unique_pair_idx").on(t.fromCurrency, t.toCurrency)
      // unique index
    }));
    agentAvailability = pgTable("agent_availability", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      agentId: varchar("agent_id").notNull().references(() => users2.id).unique(),
      timezone: varchar("timezone", { length: 64 }).default("Africa/Harare"),
      weeklySchedule: jsonb("weekly_schedule").notNull(),
      // { mon: {start, end, active}, ... }
      autoReplyOutsideHours: boolean("auto_reply_outside_hours").default(true),
      autoReplyMessage: text("auto_reply_message"),
      vacationMode: boolean("vacation_mode").default(false),
      vacationUntil: timestamp("vacation_until"),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    disputes = pgTable("disputes", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      customerRequestId: varchar("customer_request_id").notNull().references(() => customerRequests.id),
      raisedByUserId: varchar("raised_by_user_id").notNull().references(() => users2.id),
      againstUserId: varchar("against_user_id").notNull().references(() => users2.id),
      category: varchar("category", { length: 64 }).notNull(),
      description: text("description").notNull(),
      evidenceUrls: jsonb("evidence_urls").default([]),
      status: disputeStatusEnum("status").default("open"),
      assignedAdminId: varchar("assigned_admin_id").references(() => users2.id),
      resolution: text("resolution"),
      resolvedAt: timestamp("resolved_at"),
      commissionHeld: boolean("commission_held").default(false),
      refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    disputeMessages = pgTable("dispute_messages", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      disputeId: varchar("dispute_id").notNull().references(() => disputes.id),
      senderId: varchar("sender_id").notNull().references(() => users2.id),
      senderRole: varchar("sender_role", { length: 16 }).notNull(),
      message: text("message").notNull(),
      attachmentUrls: jsonb("attachment_urls").default([]),
      createdAt: timestamp("created_at").defaultNow()
    });
    savedSearches = pgTable("saved_searches", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      customerId: varchar("customer_id").notNull().references(() => users2.id),
      name: varchar("name", { length: 64 }),
      criteria: jsonb("criteria").notNull(),
      alertChannel: commChannelEnum("alert_channel").default("push"),
      alertFrequency: varchar("alert_frequency", { length: 16 }).default("instant"),
      isActive: boolean("is_active").default(true),
      lastAlertSentAt: timestamp("last_alert_sent_at"),
      matchCount: integer("match_count").default(0),
      createdAt: timestamp("created_at").defaultNow()
    });
    cookieConsents = pgTable("cookie_consents", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users2.id),
      sessionId: varchar("session_id", { length: 64 }),
      country: countryEnum("country").notNull(),
      analyticsAccepted: boolean("analytics_accepted").default(false),
      marketingAccepted: boolean("marketing_accepted").default(false),
      ipAddress: varchar("ip_address", { length: 45 }),
      userAgent: text("user_agent"),
      consentedAt: timestamp("consented_at").defaultNow()
    });
    flaggedContent = pgTable("flagged_content", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      contentType: varchar("content_type", { length: 32 }).notNull(),
      // message, photo, property
      contentId: varchar("content_id").notNull(),
      flaggedBy: varchar("flagged_by", { length: 64 }).notNull(),
      // ai_moderation, user_id, admin_id
      reason: text("reason"),
      confidence: decimal("confidence", { precision: 5, scale: 2 }),
      status: varchar("status", { length: 32 }).default("pending"),
      // pending, reviewed, dismissed, resolved
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    leadIntelligenceRelations = relations(leadIntelligence, ({ one }) => ({
      request: one(customerRequests, {
        fields: [leadIntelligence.customerRequestId],
        references: [customerRequests.id]
      })
    }));
    usersRelations = relations(users2, ({ one, many }) => ({
      agentProfile: one(agentProfiles2, {
        fields: [users2.id],
        references: [agentProfiles2.userId]
      }),
      referrerProfile: one(referrerProfiles, {
        fields: [users2.id],
        references: [referrerProfiles.userId]
      }),
      userProfile: one(userProfiles2, {
        fields: [users2.id],
        references: [userProfiles2.userId]
      }),
      customerRequests: many(customerRequests),
      sentMessages: many(messages),
      notifications: many(notifications),
      payments: many(payments),
      agentScores: one(agentScores),
      agentVerifications: many(agentVerifications),
      paymentTransactions: many(paymentTransactions),
      communicationLogs: many(communicationLogs)
    }));
    customerRequestsRelations = relations(customerRequests, ({ one, many }) => ({
      customer: one(users2, {
        fields: [customerRequests.customerId],
        references: [users2.id]
      }),
      leads: many(leads),
      intelligence: one(leadIntelligence, {
        fields: [customerRequests.id],
        references: [leadIntelligence.customerRequestId]
      })
    }));
    leadsRelations = relations(leads, ({ one, many }) => ({
      customer: one(users2, {
        fields: [leads.customerId],
        references: [users2.id]
      }),
      agent: one(users2, {
        fields: [leads.agentId],
        references: [users2.id]
      }),
      request: one(customerRequests, {
        fields: [leads.requestId],
        references: [customerRequests.id]
      }),
      conversation: one(conversations2)
    }));
    conversationsRelations = relations(conversations2, ({ one, many }) => ({
      lead: one(leads, {
        fields: [conversations2.leadId],
        references: [leads.id]
      }),
      customer: one(users2, {
        fields: [conversations2.customerId],
        references: [users2.id]
      }),
      agent: one(users2, {
        fields: [conversations2.agentId],
        references: [users2.id]
      }),
      messages: many(messages)
    }));
    messagesRelations = relations(messages, ({ one }) => ({
      conversation: one(conversations2, {
        fields: [messages.conversationId],
        references: [conversations2.id]
      }),
      sender: one(users2, {
        fields: [messages.senderId],
        references: [users2.id]
      })
    }));
    insertUserSchema = createInsertSchema(users2).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertCustomerRequestSchema = createInsertSchema(customerRequests).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertAgentProfileSchema = createInsertSchema(agentProfiles2).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertReferrerProfileSchema = createInsertSchema(referrerProfiles).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertReferralLinkSchema = createInsertSchema(referralLinks).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertLeadSchema = createInsertSchema(leads).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertConversationSchema = createInsertSchema(conversations2).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertMessageSchema = createInsertSchema(messages).omit({
      id: true,
      createdAt: true
    });
    insertPropertySchema = createInsertSchema(properties).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPaymentSchema = createInsertSchema(payments).omit({
      id: true,
      createdAt: true
    });
    insertNotificationSchema = createInsertSchema(notifications).omit({
      id: true,
      createdAt: true
    });
    insertUserProfileSchema = createInsertSchema(userProfiles2).omit({
      id: true,
      createdAt: true
    });
    insertAgentScoreSchema = createInsertSchema(agentScores).omit({
      id: true,
      updatedAt: true
    });
    insertLeadIntelligenceSchema = createInsertSchema(leadIntelligence).omit({
      id: true,
      scoredAt: true
    });
    insertAgentVerificationSchema = createInsertSchema(agentVerifications).omit({
      id: true,
      createdAt: true
    });
    insertWorkflowLogSchema = createInsertSchema(workflowLogs).omit({
      id: true,
      startedAt: true
    });
    insertCommunicationLogSchema = createInsertSchema(communicationLogs).omit({
      id: true,
      sentAt: true
    });
    insertPaymentTransactionSchema = createInsertSchema(paymentTransactions).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertMarketSnapshotSchema = createInsertSchema(marketSnapshots).omit({
      id: true,
      snapshotDate: true
    });
    insertPropertyPhotoAnalysisSchema = createInsertSchema(propertyPhotoAnalysis).omit({
      id: true,
      analysedAt: true
    });
    leadAuctions = pgTable("lead_auctions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      customerRequestId: varchar("customer_request_id").notNull().references(() => customerRequests.id),
      status: varchar("status", { length: 32 }).default("open"),
      openedAt: timestamp("opened_at").defaultNow(),
      closesAt: timestamp("closes_at").notNull(),
      // 4 hours after opening
      maxPitches: integer("max_pitches").default(5),
      winningAgentId: varchar("winning_agent_id").references(() => users2.id),
      customerSelectedAt: timestamp("customer_selected_at")
    });
    agentPitches = pgTable("agent_pitches", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      auctionId: varchar("auction_id").notNull().references(() => leadAuctions.id),
      agentId: varchar("agent_id").notNull().references(() => users2.id),
      pitch: text("pitch").notNull(),
      // 200 word max elevator pitch
      proposedTimeline: varchar("proposed_timeline", { length: 64 }),
      specialOffer: varchar("special_offer", { length: 128 }),
      trustScore: integer("trust_score"),
      // snapshot at time of pitch
      aiPitchScore: integer("ai_pitch_score"),
      // Gemini scores the pitch quality
      submittedAt: timestamp("submitted_at").defaultNow()
    });
    tenancyRecords = pgTable("tenancy_records", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      customerId: varchar("customer_id").notNull().references(() => users2.id),
      agentId: varchar("agent_id").notNull().references(() => users2.id),
      propertyId: varchar("property_id").references(() => properties.id),
      customerRequestId: varchar("customer_request_id").references(() => customerRequests.id),
      leaseStartDate: timestamp("lease_start_date").notNull(),
      leaseEndDate: timestamp("lease_end_date").notNull(),
      monthlyRent: decimal("monthly_rent", { precision: 10, scale: 2 }).notNull(),
      currency: currencyEnum("currency").notNull(),
      renewalReminderSentAt: timestamp("renewal_reminder_sent_at"),
      renewedAt: timestamp("renewed_at"),
      country: countryEnum("country").notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    backgroundChecks = pgTable("background_checks", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      checkId: varchar("check_id").notNull().unique(),
      agentId: varchar("agent_id").notNull().references(() => users2.id),
      tenantName: varchar("tenant_name").notNull(),
      tenantIdNumber: varchar("tenant_id_number").notNull(),
      proposedRent: decimal("proposed_rent", { precision: 12, scale: 2 }).notNull(),
      currency: currencyEnum("currency").notNull(),
      country: countryEnum("country").notNull(),
      status: varchar("status", { length: 32 }).default("pending"),
      reportUrl: text("report_url"),
      completedAt: timestamp("completed_at"),
      createdAt: timestamp("created_at").defaultNow()
    });
    collaborationRequests = pgTable("collaboration_requests", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      initiatingAgentId: varchar("initiating_agent_id").notNull().references(() => users2.id),
      targetAgentId: varchar("target_agent_id").notNull().references(() => users2.id),
      customerRequestId: varchar("customer_request_id").notNull().references(() => customerRequests.id),
      proposedSplit: integer("proposed_split").notNull(),
      // 50 = 50/50, 60 = 60/40 to initiator
      reason: text("reason"),
      status: varchar("status", { length: 32 }).default("pending"),
      acceptedAt: timestamp("accepted_at"),
      declinedAt: timestamp("declined_at"),
      splitFinalised: boolean("split_finalised").default(false),
      createdAt: timestamp("created_at").defaultNow()
    });
    userAchievements = pgTable("user_achievements", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users2.id),
      achievementId: varchar("achievement_id", { length: 64 }).notNull(),
      points: integer("points").notNull(),
      awardedAt: timestamp("awarded_at").defaultNow()
    });
    neighbourhoodProfiles = pgTable("neighbourhood_profiles", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      area: varchar("area", { length: 128 }).notNull(),
      city: varchar("city", { length: 64 }).notNull(),
      country: countryEnum("country").notNull(),
      scores: jsonb("scores").notNull(),
      // { safety, transport, ... }
      insights: jsonb("insights").default([]),
      bestFor: jsonb("best_for").default([]),
      avoidIf: jsonb("avoid_if").default([]),
      localTips: jsonb("local_tips").default([]),
      priceDirection: varchar("price_direction", { length: 16 }),
      geminiSummary: text("gemini_summary"),
      sources: jsonb("sources").default([]),
      lastUpdated: timestamp("last_updated").defaultNow()
    });
    competitorPrices = pgTable("competitor_prices", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      source: varchar("source", { length: 32 }).notNull(),
      propertyType: varchar("property_type", { length: 64 }).notNull(),
      city: varchar("city", { length: 64 }).notNull(),
      district: varchar("district", { length: 128 }),
      price: decimal("price", { precision: 12, scale: 2 }).notNull(),
      currency: currencyEnum("currency").notNull(),
      bedrooms: integer("bedrooms"),
      sizeSqm: decimal("size_sqm", { precision: 8, scale: 2 }),
      scrapedAt: timestamp("scraped_at").defaultNow()
    });
    insertLeadAuctionSchema = createInsertSchema(leadAuctions).omit({ id: true, openedAt: true });
    insertAgentPitchSchema = createInsertSchema(agentPitches).omit({ id: true, submittedAt: true });
    insertTenancyRecordSchema = createInsertSchema(tenancyRecords).omit({ id: true, createdAt: true });
    insertBackgroundCheckSchema = createInsertSchema(backgroundChecks).omit({ id: true, createdAt: true });
    insertCollaborationRequestSchema = createInsertSchema(collaborationRequests).omit({ id: true, createdAt: true });
    insertUserAchievementSchema = createInsertSchema(userAchievements).omit({ id: true, awardedAt: true });
    insertNeighbourhoodProfileSchema = createInsertSchema(neighbourhoodProfiles).omit({ id: true, lastUpdated: true });
    insertCompetitorPriceSchema = createInsertSchema(competitorPrices).omit({ id: true, scrapedAt: true });
    insertExchangeRateSchema = createInsertSchema(exchangeRates).omit({
      id: true,
      fetchedAt: true
    });
    insertAgentAvailabilitySchema = createInsertSchema(agentAvailability).omit({
      id: true,
      updatedAt: true
    });
    insertDisputeSchema = createInsertSchema(disputes).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertDisputeMessageSchema = createInsertSchema(disputeMessages).omit({
      id: true,
      createdAt: true
    });
    insertSavedSearchSchema = createInsertSchema(savedSearches).omit({
      id: true,
      createdAt: true
    });
    insertCookieConsentSchema = createInsertSchema(cookieConsents).omit({
      id: true,
      consentedAt: true
    });
  }
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
var dbUrl, pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    neonConfig.webSocketConstructor = ws;
    dbUrl = process.env.DATABASE_URL;
    if (!dbUrl || dbUrl.includes("user:password@host")) {
      console.warn(
        "\u26A0\uFE0F  DATABASE_URL is not configured \u2014 API routes will fail but the UI will load."
      );
    }
    pool = new Pool({ connectionString: dbUrl || "postgres://localhost:5432/paid_refer_dev" });
    db = drizzle({ client: pool, schema: schema_exports });
  }
});

// server/lib/firebase-admin.ts
import admin from "firebase-admin";
var app2, noopFirestore, firestore, storage2, messaging, auth;
var init_firebase_admin = __esm({
  "server/lib/firebase-admin.ts"() {
    "use strict";
    app2 = null;
    try {
      if (admin.apps?.length) {
        app2 = admin.app();
      } else if (process.env.FIREBASE_PROJECT_ID) {
        app2 = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
          }),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        });
      } else {
        console.warn("\u26A0\uFE0F  Firebase credentials not configured \u2014 Firebase features disabled.");
      }
    } catch (err) {
      console.warn("\u26A0\uFE0F  Firebase init failed:", err.message);
    }
    noopFirestore = { settings: () => {
    }, collection: () => ({}), doc: () => ({}) };
    firestore = app2 ? admin.firestore() : noopFirestore;
    storage2 = app2 ? admin.storage() : {};
    messaging = app2 ? admin.messaging() : {};
    auth = app2 ? admin.auth() : {};
    if (app2) {
      firestore.settings({ ignoreUndefinedProperties: true });
    }
  }
});

// server/lib/firestore-chat.ts
var firestore_chat_exports = {};
__export(firestore_chat_exports, {
  createConversation: () => createConversation,
  markMessagesRead: () => markMessagesRead,
  sendMessage: () => sendMessage,
  setTypingIndicator: () => setTypingIndicator
});
import { FieldValue, Timestamp } from "firebase-admin/firestore";
async function createConversation(customerRequestId, agentId, customerId, country) {
  const conversationRef = firestore.collection("conversations").doc();
  await conversationRef.set({
    customerRequestId,
    agentId,
    customerId,
    country,
    status: "active",
    lastMessage: null,
    lastMessageAt: null,
    agentUnreadCount: 0,
    customerUnreadCount: 0,
    createdAt: FieldValue.serverTimestamp()
  });
  return conversationRef.id;
}
async function sendMessage(conversationId, senderId, senderRole, content, type = "text", propertyData) {
  const messagesRef = firestore.collection("conversations").doc(conversationId).collection("messages");
  const msgRef = await messagesRef.add({
    senderId,
    senderRole,
    content,
    type,
    propertyData: propertyData || null,
    readBy: [senderId],
    createdAt: FieldValue.serverTimestamp()
  });
  await firestore.collection("conversations").doc(conversationId).update({
    lastMessage: content,
    lastMessageAt: FieldValue.serverTimestamp(),
    // Increment unread for the OTHER party
    [`${senderRole === "agent" ? "customer" : "agent"}UnreadCount`]: FieldValue.increment(1)
  });
  return msgRef.id;
}
async function setTypingIndicator(conversationId, userId, isTyping) {
  const typingRef = firestore.collection("conversations").doc(conversationId).collection("typing").doc(userId);
  if (isTyping) {
    await typingRef.set({
      userId,
      startedAt: FieldValue.serverTimestamp(),
      expiresAt: Timestamp.fromDate(new Date(Date.now() + 5e3))
      // auto-expire 5s
    });
  } else {
    await typingRef.delete();
  }
}
async function markMessagesRead(conversationId, userId, userRole) {
  const messagesRef = firestore.collection("conversations").doc(conversationId).collection("messages");
  const unread = await messagesRef.where("readBy", "array-contains", [userId]).get();
  const batch = firestore.batch();
  unread.docs.forEach((doc) => {
    batch.update(doc.ref, {
      readBy: FieldValue.arrayUnion(userId)
    });
  });
  batch.update(firestore.collection("conversations").doc(conversationId), {
    [`${userRole}UnreadCount`]: 0
  });
  await batch.commit();
}
var init_firestore_chat = __esm({
  "server/lib/firestore-chat.ts"() {
    "use strict";
    init_firebase_admin();
  }
});

// server/lib/brevo-whatsapp.ts
async function sendWhatsApp(message) {
  let payload;
  switch (message.type) {
    case "text":
      payload = {
        receiverPhoneNumber: normalizePhone(message.to),
        type: "text",
        text: { body: message.body }
      };
      break;
    case "template":
      payload = {
        receiverPhoneNumber: normalizePhone(message.to),
        type: "template",
        template: {
          name: message.templateName,
          language: { code: message.languageCode },
          components: message.components || []
        }
      };
      break;
    case "interactive_buttons":
      payload = {
        receiverPhoneNumber: normalizePhone(message.to),
        type: "interactive",
        interactive: {
          type: "button",
          header: message.header ? { type: "text", text: message.header } : void 0,
          body: { text: message.body },
          footer: message.footer ? { text: message.footer } : void 0,
          action: {
            buttons: message.buttons.map((b) => ({
              type: "reply",
              reply: { id: b.id, title: b.title }
            }))
          }
        }
      };
      break;
    case "interactive_list":
      payload = {
        receiverPhoneNumber: normalizePhone(message.to),
        type: "interactive",
        interactive: {
          type: "list",
          body: { text: message.body },
          action: {
            button: message.buttonLabel,
            sections: message.sections
          }
        }
      };
      break;
    default:
      return { success: false };
  }
  try {
    const res = await fetch(`${BREVO_API_BASE}/whatsapp/sendMessage`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Brevo WhatsApp error:", data);
      return { success: false };
    }
    await logCommunication(message.to, "whatsapp", "brevo", data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (err) {
    console.error("Brevo WhatsApp exception:", err);
    return { success: false };
  }
}
function normalizePhone(phone) {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("07") && cleaned.length === 10) {
    cleaned = "263" + cleaned.slice(1);
  }
  if (cleaned.startsWith("7") && cleaned.length === 9) {
    cleaned = "263" + cleaned;
  }
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    cleaned = "27" + cleaned.slice(1);
  }
  if (!cleaned.startsWith("+")) {
    cleaned = "+" + cleaned;
  }
  return cleaned;
}
async function logCommunication(phone, channel, provider, messageId) {
  try {
    await db.insert(communicationLogs).values({
      channel,
      provider,
      toAddress: phone,
      providerMessageId: messageId,
      status: "sent"
    });
  } catch (err) {
    console.error("Failed to log communication:", err);
  }
}
var BREVO_API_BASE, headers;
var init_brevo_whatsapp = __esm({
  "server/lib/brevo-whatsapp.ts"() {
    "use strict";
    init_db();
    init_schema();
    BREVO_API_BASE = "https://api.brevo.com/v3";
    headers = {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json"
    };
  }
});

// server/lib/whatsapp-messages.ts
async function sendAgentMatchedNotification(phone, customerName, agentName, agentPhone, propertyType, city) {
  return sendWhatsApp({
    type: "interactive_buttons",
    to: phone,
    header: "\u{1F3AF} Your agent is ready!",
    body: `Great news, ${customerName}!

We've matched you with *${agentName}*, a verified agent specialising in *${propertyType}* in *${city}*.

${agentName} will contact you shortly. You can also reach them directly.`,
    footer: "Refer Property",
    buttons: [
      { id: `call_agent_${agentPhone}`, title: `Call ${agentName.split(" ")[0]}` },
      { id: "view_profile", title: "View agent profile" }
    ]
  });
}
var init_whatsapp_messages = __esm({
  "server/lib/whatsapp-messages.ts"() {
    "use strict";
    init_brevo_whatsapp();
  }
});

// server/lib/whatsapp-handler.ts
var whatsapp_handler_exports = {};
__export(whatsapp_handler_exports, {
  handleIncomingWhatsApp: () => handleIncomingWhatsApp,
  sendHelpMessage: () => sendHelpMessage
});
import { and as and8, eq as eq10, inArray, desc as desc4, sql as sql9 } from "drizzle-orm";
async function handleIncomingWhatsApp(message) {
  const phone = normalizePhone(message.from);
  let actionId = null;
  let textBody = null;
  if (message.type === "interactive") {
    actionId = message.interactive?.button_reply?.id || message.interactive?.list_reply?.id || null;
  } else if (message.type === "button") {
    actionId = message.button?.payload || null;
  } else if (message.type === "text") {
    textBody = message.text?.body?.trim().toLowerCase() || null;
  }
  if (actionId) {
    if (actionId.startsWith("accept_lead_")) {
      const leadId = actionId.replace("accept_lead_", "");
      await handleLeadAcceptViaWhatsApp(phone, leadId);
      return;
    }
    if (actionId.startsWith("decline_lead_")) {
      const leadId = actionId.replace("decline_lead_", "");
      await handleLeadDeclineViaWhatsApp(phone, leadId);
      return;
    }
    if (actionId.startsWith("view_lead_")) {
      const leadId = actionId.replace("view_lead_", "");
      await sendLeadDetailsWhatsApp(phone, leadId);
      return;
    }
    if (actionId === "check_status") {
      await handleCheckStatusRequest(phone);
      return;
    }
    if (actionId === "expand_search") {
      await handleExpandSearchRequest(phone);
      return;
    }
    if (actionId === "view_earnings") {
      await handleViewEarningsRequest(phone);
      return;
    }
  }
  if (textBody) {
    if (textBody === "agent" || textBody === "find agent") {
      await handleFindAgentRequest(phone);
      return;
    }
    if (textBody === "stop" || textBody === "unsubscribe") {
      await handleOptOut(phone);
      return;
    }
    if (textBody === "help") {
      await sendHelpMessage(phone);
      return;
    }
    if (textBody === "earnings" || textBody === "balance") {
      await handleViewEarningsRequest(phone);
      return;
    }
    await routeToInAppChat(phone, textBody);
  }
}
async function handleLeadAcceptViaWhatsApp(agentPhone, leadId) {
  const [agent] = await db.select().from(users2).where(
    and8(
      eq10(users2.phone, agentPhone),
      eq10(users2.role, "agent")
    )
  );
  if (!agent) {
    await sendWhatsApp({
      type: "text",
      to: agentPhone,
      body: "We couldn't find your agent account. Please log in to the app to accept this lead."
    });
    return;
  }
  if (agent.subscriptionStatus !== "active") {
    await sendWhatsApp({
      type: "text",
      to: agentPhone,
      body: `\u26A0\uFE0F Your account subscription is ${agent.subscriptionStatus}. Please update your payment to accept leads.`
    });
    return;
  }
  const [lead] = await db.select().from(customerRequests).where(
    and8(
      eq10(customerRequests.id, leadId),
      eq10(customerRequests.status, "pending")
    )
  );
  if (!lead) {
    await sendWhatsApp({
      type: "text",
      to: agentPhone,
      body: `Sorry, lead #${leadId} is no longer available. It may have been accepted by another agent or expired.`
    });
    return;
  }
  await db.update(customerRequests).set({
    // @ts-ignore - assignedAgentId might not be in basic schema but user added it in PART 1 interfaces
    assignedAgentId: agent.id,
    status: "agent_assigned",
    // @ts-ignore
    assignedAt: /* @__PURE__ */ new Date()
  }).where(eq10(customerRequests.id, leadId));
  const { createConversation: createConversation2 } = await Promise.resolve().then(() => (init_firestore_chat(), firestore_chat_exports));
  const conversationId = await createConversation2(
    leadId,
    agent.id,
    lead.customerId,
    lead.country
  );
  await db.update(customerRequests).set({
    // @ts-ignore
    conversationId
  }).where(eq10(customerRequests.id, leadId));
  await sendWhatsApp({
    type: "text",
    to: agentPhone,
    body: `\u2705 Lead #${leadId} accepted! You can now contact the customer.

\u{1F4DE} ${lead.phoneNumber}
\u{1F4AC} Continue on app: ${process.env.APP_BASE_URL}/dashboard/leads/${leadId}`
  });
  const [profile] = await db.select().from(userProfiles2).where(eq10(userProfiles2.userId, lead.customerId));
  if (profile?.whatsappNumber) {
    await sendAgentMatchedNotification(
      profile.whatsappNumber,
      "there",
      // customer name
      agent.firstName || "An agent",
      agent.phone || "",
      lead.propertyType || "property",
      lead.preferredCity || ""
    );
  }
}
async function handleLeadDeclineViaWhatsApp(phone, leadId) {
  await sendWhatsApp({
    type: "text",
    to: phone,
    body: `Decline record for lead #${leadId}. The lead will be offered to other agents.`
  });
}
async function sendLeadDetailsWhatsApp(phone, leadId) {
  const [lead] = await db.select().from(customerRequests).where(eq10(customerRequests.id, leadId));
  if (!lead) return;
  await sendWhatsApp({
    type: "text",
    to: phone,
    body: `*Lead Details #${leadId}*
\u{1F4CD} City: ${lead.preferredCity}
\u{1F4B0} Budget: ${lead.budgetMin}-${lead.budgetMax}
\u{1F3E0} Type: ${lead.propertyType}
\u{1F4C5} Move-in: ${lead.moveInDate || "Flexible"}`
  });
}
async function handleFindAgentRequest(phone) {
  const [user] = await db.select().from(users2).where(eq10(users2.phone, phone));
  if (!user) {
    await sendWhatsApp({
      type: "interactive_buttons",
      to: phone,
      body: "Welcome to Refer Property! To find a verified agent, please register first.",
      buttons: [
        { id: "register_web", title: "Register online" }
      ]
    });
    return;
  }
  const [existingRequest] = await db.select().from(customerRequests).where(
    and8(
      eq10(customerRequests.customerId, user.id),
      inArray(customerRequests.status, ["pending", "agent_assigned"])
    )
  );
  if (existingRequest) {
    await sendWhatsApp({
      type: "text",
      to: phone,
      body: `You already have an active request (REF-${existingRequest.id}). We're still matching you with an agent in ${existingRequest.preferredCity}. We'll notify you as soon as one is assigned.`
    });
    return;
  }
  await sendWhatsApp({
    type: "interactive_list",
    to: phone,
    body: "Which city are you looking for property in?",
    buttonLabel: "Select city",
    sections: [
      {
        title: "Zimbabwe",
        rows: [
          { id: "city_harare", title: "Harare", description: "Capital city" },
          { id: "city_bulawayo", title: "Bulawayo", description: "Matabeleland" },
          { id: "city_victoria_falls", title: "Victoria Falls", description: "Tourism hub" }
        ]
      },
      {
        title: "South Africa",
        rows: [
          { id: "city_johannesburg", title: "Johannesburg", description: "Economic hub" },
          { id: "city_cape_town", title: "Cape Town", description: "Western Cape" },
          { id: "city_durban", title: "Durban", description: "KwaZulu-Natal" }
        ]
      }
    ]
  });
}
async function sendHelpMessage(phone) {
  await sendWhatsApp({
    type: "text",
    to: phone,
    body: `\u{1F3E0} *Refer Property Help*

Reply with:

*AGENT* \u2014 Find a property agent
*EARNINGS* \u2014 Check your referral earnings
*STOP* \u2014 Unsubscribe from notifications

Or visit: ${process.env.APP_BASE_URL}

Support: ${process.env.SUPPORT_WHATSAPP || "+263771234567"}`
  });
}
async function handleOptOut(phone) {
  await db.execute(sql9`
    UPDATE user_profiles
    SET preferred_channel = 'email',
        whatsapp_opted_out = true,
        whatsapp_opted_out_at = NOW()
    WHERE whatsapp_number = ${phone}
  `);
  await sendWhatsApp({
    type: "text",
    to: phone,
    body: "You've been unsubscribed from WhatsApp notifications. You'll still receive important account emails.\n\nTo re-subscribe, reply *START* anytime."
  });
}
async function handleCheckStatusRequest(phone) {
  await sendWhatsApp({
    type: "text",
    to: phone,
    body: "Checking your request status... One moment."
  });
}
async function handleExpandSearchRequest(phone) {
  await sendWhatsApp({
    type: "text",
    to: phone,
    body: "Expanding your search area. We will notify you of more matches."
  });
}
async function handleViewEarningsRequest(phone) {
  await sendWhatsApp({
    type: "text",
    to: phone,
    body: "Retrieving your earnings balance..."
  });
}
async function routeToInAppChat(phone, text2) {
  const [user] = await db.select().from(users2).where(eq10(users2.phone, phone));
  if (!user) return;
  const [activeRequest] = await db.select().from(customerRequests).where(
    and8(
      eq10(customerRequests.customerId, user.id),
      eq10(customerRequests.status, "in_progress")
    )
  ).orderBy(desc4(customerRequests.createdAt)).limit(1);
  if (activeRequest?.conversationId) {
    const { sendMessage: sendMessage2 } = await Promise.resolve().then(() => (init_firestore_chat(), firestore_chat_exports));
    await sendMessage2(
      // @ts-ignore
      activeRequest.conversationId,
      user.id,
      user.role === "agent" ? "agent" : "customer",
      `[WhatsApp] ${text2}`
    );
  }
}
var init_whatsapp_handler = __esm({
  "server/lib/whatsapp-handler.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_brevo_whatsapp();
    init_whatsapp_messages();
  }
});

// server/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

// server/middleware/rateLimit.ts
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { createClient } from "redis";
var redis = createClient({ url: process.env.REDIS_URL });
redis.connect().catch(console.error);
var apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 100,
  standardHeaders: true,
  store: new RedisStore({ sendCommand: (...args) => redis.sendCommand(args) }),
  message: { error: "Too many requests, slow down" }
});
var authLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 10,
  store: new RedisStore({ sendCommand: (...args) => redis.sendCommand(args) }),
  message: { error: "Too many login attempts" }
});
var aiLimiter = rateLimit({
  windowMs: 60 * 1e3,
  max: 20,
  keyGenerator: (req) => req.user?.id?.toString() || req.ip || "unknown",
  store: new RedisStore({ sendCommand: (...args) => redis.sendCommand(args) }),
  message: { error: "AI request limit reached, wait a moment" }
});
var uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1e3,
  max: 5,
  keyGenerator: (req) => req.user?.id?.toString() || req.ip || "unknown",
  store: new RedisStore({ sendCommand: (...args) => redis.sendCommand(args) }),
  message: { error: "Upload limit reached for this hour" }
});

// server/middleware/errorHandler.ts
var AppError = class extends Error {
  constructor(statusCode, message, code, details) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.code = code;
    this.details = details;
    this.name = "AppError";
  }
};
function errorHandler(err, req, res, next) {
  console.error({
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    method: req.method,
    url: req.url,
    userId: req.user?.id,
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : void 0
  });
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      details: err.details
    });
  }
  if (err.code === "23505") {
    return res.status(409).json({ error: "Duplicate entry" });
  }
  if (err.code === "23503") {
    return res.status(400).json({ error: "Referenced record not found" });
  }
  res.status(500).json({
    error: "Internal server error",
    requestId: req.headers["x-request-id"]
  });
}

// server/app.ts
var app = express();
var Sentry = null;
if (process.env.SENTRY_DSN) {
  try {
    Sentry = await import("@sentry/node");
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
  } catch {
  }
}
app.use(helmet({
  contentSecurityPolicy: false,
  // handled by Firebase Hosting
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: [
    process.env.APP_BASE_URL || "http://localhost:5173",
    "http://localhost:5173",
    // Vite dev
    "http://localhost:3000"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}));
app.use("/webhooks/stripe", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);
app.use((req, res, next) => {
  req.headers["x-request-id"] = req.headers["x-request-id"] || crypto.randomUUID();
  next();
});
app.get("/health", (req, res) => res.json({ status: "ok", ts: Date.now() }));
if (Sentry) {
  app.use(Sentry.Handlers.errorHandler());
}
app.use(errorHandler);
var app_default = app;

// server/routes.ts
import express2 from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import multer from "multer";

// server/storage.ts
import { nanoid } from "nanoid";

// server/db-storage.ts
init_schema();
init_db();
import { eq, or } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users2).where(eq(users2.id, id));
    return user;
  }
  async getUserByFirebaseUid(firebaseUid) {
    const [user] = await db.select().from(users2).where(eq(users2.firebaseUid, firebaseUid));
    return user;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users2).values(insertUser).returning();
    return user;
  }
  async upsertUser(userData) {
    const existing = await this.getUser(userData.id);
    if (existing) {
      return this.updateUser(existing.id, userData);
    }
    const [user] = await db.insert(users2).values(userData).returning();
    return user;
  }
  async updateUser(userId, updates) {
    const [user] = await db.update(users2).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users2.id, userId)).returning();
    return user;
  }
  async updateUserRole(userId, role) {
    const [user] = await db.update(users2).set({ role, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users2.id, userId)).returning();
    return user;
  }
  async createCustomerRequest(request) {
    const [created] = await db.insert(customerRequests).values(request).returning();
    return created;
  }
  async getCustomerRequest(id) {
    const [request] = await db.select().from(customerRequests).where(eq(customerRequests.id, id));
    return request;
  }
  async getCustomerRequestsByUser(userId) {
    return db.select().from(customerRequests).where(eq(customerRequests.customerId, userId));
  }
  async updateCustomerRequest(id, updates) {
    const [updated] = await db.update(customerRequests).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(customerRequests.id, id)).returning();
    return updated;
  }
  async createAgentProfile(profile) {
    const [created] = await db.insert(agentProfiles2).values(profile).returning();
    return created;
  }
  async getAgentProfile(userId) {
    const [profile] = await db.select().from(agentProfiles2).where(eq(agentProfiles2.userId, userId));
    return profile;
  }
  async getAgentProfiles(filters) {
    return db.select().from(agentProfiles2).where(eq(agentProfiles2.isActive, true));
  }
  async updateAgentProfile(userId, updates) {
    const [updated] = await db.update(agentProfiles2).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(agentProfiles2.userId, userId)).returning();
    return updated;
  }
  async createAgentPreRegistration(data) {
    const [created] = await db.insert(agentPreRegistrations).values(data).returning();
    return created;
  }
  async getAgentPreRegistration(id) {
    const [reg] = await db.select().from(agentPreRegistrations).where(eq(agentPreRegistrations.id, id));
    return reg;
  }
  async updateAgentPreRegistration(id, updates) {
    const [updated] = await db.update(agentPreRegistrations).set(updates).where(eq(agentPreRegistrations.id, id)).returning();
    return updated;
  }
  async createReferrerProfile(profile) {
    const [created] = await db.insert(referrerProfiles).values(profile).returning();
    return created;
  }
  async getReferrerProfile(userId) {
    const [profile] = await db.select().from(referrerProfiles).where(eq(referrerProfiles.userId, userId));
    return profile;
  }
  async updateReferrerProfile(userId, updates) {
    const [updated] = await db.update(referrerProfiles).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(referrerProfiles.userId, userId)).returning();
    return updated;
  }
  async createReferralLink(link) {
    const [created] = await db.insert(referralLinks).values(link).returning();
    return created;
  }
  async getReferralLink(id) {
    const [link] = await db.select().from(referralLinks).where(eq(referralLinks.id, id));
    return link;
  }
  async getReferralLinkByShortCode(shortCode) {
    const [link] = await db.select().from(referralLinks).where(eq(referralLinks.shortCode, shortCode));
    return link;
  }
  async getReferralLinksByReferrer(referrerId) {
    return db.select().from(referralLinks).where(eq(referralLinks.referrerId, referrerId));
  }
  async updateReferralLink(id, updates) {
    const [updated] = await db.update(referralLinks).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(referralLinks.id, id)).returning();
    return updated;
  }
  async createLead(lead) {
    const [created] = await db.insert(leads).values(lead).returning();
    return created;
  }
  async getLead(id) {
    const [obj] = await db.select().from(leads).where(eq(leads.id, id));
    return obj;
  }
  async getLeadsByAgent(agentId) {
    return db.select().from(leads).where(eq(leads.agentId, agentId));
  }
  async getLeadsByCustomer(customerId) {
    return db.select().from(leads).where(eq(leads.customerId, customerId));
  }
  async updateLead(id, updates) {
    const [updated] = await db.update(leads).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(leads.id, id)).returning();
    return updated;
  }
  async createConversation(conversation) {
    const [created] = await db.insert(conversations2).values(conversation).returning();
    return created;
  }
  async getConversation(id) {
    const [obj] = await db.select().from(conversations2).where(eq(conversations2.id, id));
    return obj;
  }
  async getConversationsByUser(userId) {
    return db.select().from(conversations2).where(or(eq(conversations2.customerId, userId), eq(conversations2.agentId, userId)));
  }
  async updateConversation(id, updates) {
    const [updated] = await db.update(conversations2).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(conversations2.id, id)).returning();
    return updated;
  }
  async createMessage(message) {
    const [created] = await db.insert(messages).values(message).returning();
    return created;
  }
  async getMessagesByConversation(conversationId) {
    return db.select().from(messages).where(eq(messages.conversationId, conversationId));
  }
  async markMessageAsRead(id) {
    const [updated] = await db.update(messages).set({ isRead: true }).where(eq(messages.id, id)).returning();
    return updated;
  }
  async createProperty(property) {
    const [created] = await db.insert(properties).values(property).returning();
    return created;
  }
  async getProperty(id) {
    const [obj] = await db.select().from(properties).where(eq(properties.id, id));
    return obj;
  }
  async getPropertiesByAgent(agentId) {
    return db.select().from(properties).where(eq(properties.agentId, agentId));
  }
  async searchProperties(filters) {
    return db.select().from(properties);
  }
  async updateProperty(id, updates) {
    const [updated] = await db.update(properties).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(properties.id, id)).returning();
    return updated;
  }
  async createPayment(payment) {
    const [created] = await db.insert(payments).values(payment).returning();
    return created;
  }
  async getPayment(id) {
    const [obj] = await db.select().from(payments).where(eq(payments.id, id));
    return obj;
  }
  async getPaymentsByUser(userId) {
    return db.select().from(payments).where(eq(payments.userId, userId));
  }
  async updatePayment(id, updates) {
    const [updated] = await db.update(payments).set(updates).where(eq(payments.id, id)).returning();
    return updated;
  }
  async createNotification(notification) {
    const [created] = await db.insert(notifications).values(notification).returning();
    return created;
  }
  async getNotificationsByUser(userId) {
    return db.select().from(notifications).where(eq(notifications.userId, userId));
  }
  async markNotificationAsRead(id) {
    const [updated] = await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id)).returning();
    return updated;
  }
  async markAllNotificationsAsRead(userId) {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
  }
  // Automation
  async logWorkflow(log2) {
    await db.insert(workflowLogs).values(log2);
  }
  async updateLeadIntelligence(intel) {
    const { leadId, ...rest } = intel;
    await db.update(leads).set({ aiSummary: JSON.stringify(rest), updatedAt: /* @__PURE__ */ new Date() }).where(eq(leads.id, leadId));
  }
  async updateAgentScore(score) {
    await db.update(agentProfiles2).set({ rating: score.rating.toString(), updatedAt: /* @__PURE__ */ new Date() }).where(eq(agentProfiles2.userId, score.agentId));
  }
  async createVerification(verification) {
  }
  async logCommunication(log2) {
  }
};
var dbStorage = new DatabaseStorage();

// server/storage.ts
var storage = dbStorage;

// server/firebaseAuth.ts
init_firebase_admin();
async function setupFirebaseAuth(app3) {
  app3.use(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (req.path.startsWith("/api/public") || req.path.startsWith("/internal")) {
      return next();
    }
    if (!authHeader?.startsWith("Bearer ")) {
      return next();
    }
    const idToken = authHeader.split("Bearer ")[1];
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      let dbUser = await storage.getUserByFirebaseUid(decodedToken.uid);
      if (!dbUser) {
        dbUser = await storage.createUser({
          firebaseUid: decodedToken.uid,
          email: decodedToken.email || null,
          phone: decodedToken.phone_number || null,
          onboardingStatus: "splash"
        });
      }
      req.user = {
        ...decodedToken,
        id: dbUser.id,
        role: dbUser.role,
        country: dbUser.country,
        dbUser
      };
      next();
    } catch (error) {
      console.error("Firebase auth error:", error);
      res.status(401).json({ message: "Invalid or expired session" });
    }
  });
}
async function setUserClaims(firebaseUid, claims) {
  await auth.setCustomUserClaims(firebaseUid, {
    userId: claims.userId,
    role: claims.role,
    country: claims.country
  });
}

// server/openai.ts
import OpenAI from "openai";
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});
async function generateResponseSuggestion(context) {
  try {
    let prompt = "";
    switch (context.type) {
      case "agent_first_contact":
        prompt = `
Generate a professional first contact message from an agent to a customer.

Customer: ${context.customerName}
Agent: ${context.agentName}
Customer looking for: ${context.customerRequest?.propertyType} in ${context.customerRequest?.preferredAreas?.join(" or ")}
Budget: \xA5${context.customerRequest?.budgetMin}-${context.customerRequest?.budgetMax}

Write a personalized, professional message that:
- Acknowledges their specific needs
- Shows expertise in their target area
- Offers to help
- Suggests next steps
- Keep it friendly but professional
- Max 100 words

Respond with JSON: {"suggestion": "message text"}
`;
        break;
      case "property_share":
        prompt = `
Generate a message for an agent sharing a property with a customer.

Property: ${context.property?.title}
Price: \xA5${context.property?.price}
Area: ${context.property?.area}
Type: ${context.property?.propertyType}

Write a message that:
- Highlights key features
- Mentions why it matches their needs
- Invites questions or viewing
- Keep it concise and engaging
- Max 80 words

Respond with JSON: {"suggestion": "message text"}
`;
        break;
      default:
        prompt = `Generate a helpful follow-up message. Respond with JSON: {"suggestion": "Thank you for your interest. How can I help you further?"}`;
    }
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content || '{"suggestion": ""}');
  } catch (error) {
    console.error("AI response suggestion error:", error);
    return { suggestion: "Thank you for your message. I'll get back to you soon!" };
  }
}
async function generateReferralContent(referralData) {
  try {
    const prompt = `
Generate a unique referral link and content for this real estate referral:

Request Type: ${referralData.requestType}
Target Area: ${referralData.targetArea}
Apartment Type: ${referralData.apartmentType || "Any"}
Notes: ${referralData.notes || "None"}

Create:
1. A unique 8-character short code (letters and numbers)
2. An engaging title (max 60 chars)
3. A compelling description (max 120 chars)

Make it appealing and specific to the area/type mentioned.

Respond with JSON in this format:
{
  "shortCode": "xyz123ab",
  "title": "Find Your Perfect Shibuya Apartment",
  "description": "Discover amazing 1LDK apartments in Shibuya with verified agents. Move-in ready properties!"
}
`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    if (!result.shortCode) {
      result.shortCode = Math.random().toString(36).substr(2, 8);
    }
    return result;
  } catch (error) {
    console.error("AI referral generation error:", error);
    return {
      shortCode: Math.random().toString(36).substr(2, 8),
      title: `${referralData.targetArea} ${referralData.apartmentType || "Apartment"} Search`,
      description: `Find great ${referralData.apartmentType || "apartments"} in ${referralData.targetArea} with trusted agents.`
    };
  }
}
async function generateMarketInsights(area, propertyType) {
  try {
    const prompt = `
Generate market insights for real estate in ${area}, Japan${propertyType ? ` for ${propertyType} properties` : ""}.

Provide general market insights based on typical Tokyo area trends (do not use specific data or make up statistics):

1. General market conditions
2. Popular features in demand
3. Seasonal trends
4. Tips for agents and customers

Keep insights general and helpful, avoid specific numbers or unverifiable claims.

Respond with JSON in this format:
{
  "insights": ["Market insight 1", "Market insight 2"],
  "trends": ["Trend 1", "Trend 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}
`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content || '{"insights": [], "trends": [], "recommendations": []}');
  } catch (error) {
    console.error("AI market insights error:", error);
    return {
      insights: [],
      trends: [],
      recommendations: []
    };
  }
}

// server/routes.ts
import * as admin2 from "firebase-admin";

// server/lib/ai-verification.ts
import { VertexAI } from "@google-cloud/vertexai";
var project = process.env.GOOGLE_CLOUD_PROJECT || "";
var location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
var _model = null;
function getModel() {
  if (!_model) {
    if (!project) throw new Error("GOOGLE_CLOUD_PROJECT not set");
    const vertexAI = new VertexAI({ project, location });
    _model = vertexAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }
  return _model;
}
async function verifyIdentityDocument(userId, imageBuffer, mimeType) {
  try {
    const prompt = `
      Analyze this identity document (e.g., Passport, License, ID Card).
      1. Verify if it looks authentic and belongs to a real person.
      2. Extract the Full Name, ID/License Number, and Expiry Date.
      3. Identify the Document Type.
      
      Return the result strictly as a JSON object with the following structure:
      {
        "isAuthentic": boolean,
        "extractedData": {
          "fullName": "string",
          "idNumber": "string",
          "expiryDate": "string",
          "documentType": "string"
        },
        "confidence": number (0-1),
        "reasoning": "string"
      }
    `;
    const request = {
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType
              }
            }
          ]
        }
      ]
    };
    const streamingResp = await getModel().generateContent(request);
    const response = await streamingResp.response;
    const text2 = response.candidates[0].content.parts[0].text;
    const jsonMatch = text2?.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from AI response");
    }
    const result = JSON.parse(jsonMatch[0]);
    await storage.logWorkflow({
      workflowId: "identity_verification",
      status: result.isAuthentic ? "success" : "failed",
      payload: { userId, ...result },
      timestamp: /* @__PURE__ */ new Date()
    });
    return result;
  } catch (error) {
    console.error("AI Identity Verification Error:", error);
    throw new Error("Failed to verify document via AI");
  }
}

// server/routes.ts
import fs from "fs";

// server/middleware/auth.ts
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "forbidden",
        message: "Insufficient permissions",
        required: roles,
        actual: req.user.role
      });
    }
    next();
  };
}
var FEATURE_ACCESS = {
  active: [
    "accept_leads",
    "send_messages",
    "view_leads",
    "manage_listings",
    "view_analytics",
    "update_profile"
  ],
  grace_period: [
    // Soft lock — can still communicate with existing leads, not accept new ones
    "send_messages",
    "view_leads",
    "update_profile"
  ],
  suspended: [
    // Read-only access to their data only
    "view_leads"
  ],
  inactive: [
    "update_profile"
  ]
};
function requireFeature(feature) {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (req.user.role !== "agent") {
      return next();
    }
    const user = await storage.getUser(req.user.id);
    const status = user?.subscriptionStatus || "inactive";
    const allowedFeatures = FEATURE_ACCESS[status] || [];
    if (!allowedFeatures.includes(feature)) {
      return res.status(403).json({
        error: "subscription_required",
        message: getBlockedMessage(status, feature),
        subscriptionStatus: status,
        upgradeUrl: `/dashboard/settings/payments`
      });
    }
    next();
  };
}
function getBlockedMessage(status, feature) {
  if (status === "suspended") {
    return "Your account is suspended due to an unpaid subscription. Reactivate to continue.";
  }
  if (status === "grace_period") {
    return "Your payment is overdue. Some features are restricted until your subscription is renewed.";
  }
  return "This feature requires an active subscription.";
}

// server/lib/validators.ts
import { z } from "zod";
var firebaseVerifySchema = z.object({
  idToken: z.string().min(1),
  role: z.enum(["agent", "customer", "referrer"]),
  country: z.enum(["ZW", "ZA", "JP"]),
  referralCode: z.string().optional()
});
var customerRequestSchema = z.object({
  propertyType: z.enum([
    "1R",
    "1K",
    "1DK",
    "1LDK",
    "2K",
    "2DK",
    "2LDK",
    "3K",
    "3DK",
    "3LDK",
    "4LDK",
    "house_rent",
    "house_buy",
    "flat_rent",
    "flat_buy",
    "sectional_title",
    "full_title",
    "cluster",
    "estate",
    "townhouse",
    "apartment",
    "stand",
    "cluster_home",
    "commercial",
    "other"
  ]),
  preferredLocation: z.string().min(2).max(128),
  city: z.string().min(2).max(64),
  country: z.enum(["ZW", "ZA", "JP"]),
  budgetMin: z.number().positive(),
  budgetMax: z.number().positive(),
  currency: z.enum(["USD", "ZAR", "JPY"]),
  bedrooms: z.string().optional().nullable(),
  moveInDate: z.string().datetime().optional().nullable(),
  visaType: z.string().max(64).optional().nullable(),
  mustHaveFeatures: z.array(z.string()).max(10).optional(),
  notes: z.string().max(500).optional(),
  referralCode: z.string().optional()
}).refine((d) => d.budgetMax >= d.budgetMin, {
  message: "budgetMax must be >= budgetMin",
  path: ["budgetMax"]
});
var agentProfileSchema = z.object({
  name: z.string().min(2).max(128),
  email: z.string().email(),
  phone: z.string().min(9).max(20),
  country: z.enum(["ZW", "ZA", "JP"]),
  serviceAreas: z.array(z.string()).min(1).max(10),
  propertySpecializations: z.array(z.string()).min(1).max(8),
  yearsExperience: z.number().int().min(0).max(50),
  bio: z.string().max(500).optional(),
  languages: z.array(z.string()).min(1),
  whatsappNumber: z.string().optional()
});
var propertyListingSchema = z.object({
  title: z.string().min(5).max(128),
  description: z.string().min(10).max(2e3),
  propertyType: z.string(),
  country: z.enum(["ZW", "ZA", "JP"]),
  city: z.string().min(2).max(64),
  district: z.string().max(128).optional(),
  address: z.string().max(256).optional(),
  price: z.number().positive(),
  currency: z.enum(["USD", "ZAR", "JPY"]),
  priceType: z.enum(["monthly", "once_off", "per_sqm"]),
  bedrooms: z.number().int().min(0).max(20).optional(),
  bathrooms: z.number().min(0).max(20).optional(),
  sizeSqm: z.number().positive().optional(),
  floor: z.number().int().optional(),
  totalFloors: z.number().int().optional(),
  availableFrom: z.string().datetime().optional(),
  amenities: z.array(z.string()).max(30).optional(),
  // Japan-specific
  keyMoney: z.number().optional(),
  securityDeposit: z.number().optional(),
  managementFee: z.number().optional(),
  petPolicy: z.enum(["allowed", "not_allowed", "negotiable"]).optional(),
  isActive: z.boolean().default(true)
});
var createReferralLinkSchema = z.object({
  targetCountry: z.enum(["ZW", "ZA", "JP"]),
  customSlug: z.string().min(3).max(32).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens").optional(),
  campaignName: z.string().max(64).optional()
});
var closeDealSchema = z.object({
  dealValueUsd: z.number().positive().min(100),
  dealType: z.enum(["rental", "sale", "commercial"]),
  notes: z.string().max(500).optional()
});
function validate(schema2) {
  return (req, res, next) => {
    const result = schema2.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.flatten().fieldErrors
      });
    }
    req.body = result.data;
    next();
  };
}

// server/routes.ts
init_firebase_admin();
init_schema();

// server/lib/ussd-session.ts
import { createClient as createClient2 } from "redis";
var redis2 = createClient2({
  url: process.env.REDIS_URL
  // GCP Memorystore Redis URL
});
redis2.connect().catch((err) => {
  console.warn("Redis connection failed. USSD sessions will be ephemeral.", err.message);
});
var SESSION_TTL = 300;
async function getUSSDSession(key) {
  try {
    const data = await redis2.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}
async function saveUSSDSession(key, session) {
  try {
    await redis2.setEx(key, SESSION_TTL, JSON.stringify(session));
  } catch (err) {
    console.warn("Could not save USSD session to Redis:", err.message);
  }
}
async function deleteUSSDSession(key) {
  try {
    await redis2.del(key);
  } catch {
  }
}

// server/lib/ussd-flows.ts
init_db();
init_schema();
import { eq as eq2 } from "drizzle-orm";

// server/lib/africas-talking.ts
import AfricasTalking from "africastalking";
var at = AfricasTalking({
  apiKey: process.env.AFRICAS_TALKING_API_KEY || "dummy_api_key",
  username: process.env.AFRICAS_TALKING_USERNAME || "sandbox"
});
var sms = at.SMS;
async function sendSMS(to, message) {
  const options = {
    to: [to],
    message,
    from: process.env.AT_SENDER_ID || void 0
    // Use Shortcode/Alphanumeric if available
  };
  try {
    const response = await sms.send(options);
    return response;
  } catch (err) {
    console.error("Africa's Talking SMS failed:", err);
    throw err;
  }
}

// server/lib/ussd-flows.ts
function menuFindAgent_Step1() {
  return `CON Select property type:

1. House to rent
2. House to buy
3. Flat/Apartment to rent
4. Flat/Apartment to buy
5. Stand/Plot
6. Commercial property`;
}
var PROPERTY_TYPE_MAP = {
  "1": "house_rent",
  "2": "house_buy",
  "3": "flat_rent",
  "4": "flat_buy",
  "5": "stand",
  "6": "commercial"
};
var CITY_MAP = {
  "1": "Harare",
  "2": "Bulawayo",
  "3": "Mutare",
  "4": "Gweru",
  "5": "Masvingo",
  "6": "Victoria Falls",
  "7": "Chitungwiza",
  "8": "Other"
};
var BUDGET_MAP = {
  "1": { min: 0, max: 200, label: "Under $200/mo" },
  "2": { min: 200, max: 500, label: "$200-$500/mo" },
  "3": { min: 500, max: 1e3, label: "$500-$1000/mo" },
  "4": { min: 1e3, max: 2e3, label: "$1000-$2000/mo" },
  "5": { min: 2e3, max: 999999, label: "Over $2000/mo" }
};
var BEDROOMS_MAP = {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4+",
  "5": "Any"
};
async function handleFindAgentFlow(inputs, phoneNumber, sessionKey, session) {
  const step = inputs.length;
  if (step === 2) {
    if (!PROPERTY_TYPE_MAP[inputs[1]]) {
      return menuFindAgent_Step1().replace("CON Select property type:", "CON Invalid choice. Select property type:");
    }
    session.steps.propertyType = PROPERTY_TYPE_MAP[inputs[1]];
    await saveUSSDSession(sessionKey, session);
    return `CON Select your city:

1. Harare
2. Bulawayo
3. Mutare
4. Gweru
5. Masvingo
6. Victoria Falls
7. Chitungwiza
8. Other`;
  }
  if (step === 3) {
    session.steps.city = CITY_MAP[inputs[2]] || "Other";
    await saveUSSDSession(sessionKey, session);
    const isBuy = session.steps.propertyType?.includes("buy") || session.steps.propertyType === "stand";
    if (isBuy) {
      return `CON Price range (USD):

1. Under $30,000
2. $30,000 - $80,000
3. $80,000 - $150,000
4. $150,000 - $300,000
5. Over $300,000`;
    } else {
      return `CON Monthly budget (USD):

1. Under $200
2. $200 - $500
3. $500 - $1,000
4. $1,000 - $2,000
5. Over $2,000`;
    }
  }
  if (step === 4) {
    session.steps.budget = inputs[3];
    await saveUSSDSession(sessionKey, session);
    if (["stand", "commercial"].includes(session.steps.propertyType || "")) {
      return await processPropertyRequest(inputs, phoneNumber, sessionKey, session, null);
    }
    return `CON Number of bedrooms:

1. 1 bedroom
2. 2 bedrooms
3. 3 bedrooms
4. 4+ bedrooms
5. Any`;
  }
  if (step === 5) {
    return await processPropertyRequest(inputs, phoneNumber, sessionKey, session, inputs[4]);
  }
  if (step === 6 || step === 5 && !session.steps.bedrooms) {
    return await processPropertyRequest(inputs, phoneNumber, sessionKey, session, inputs[4] || null);
  }
  return "END Session expired. Please dial again.";
}
async function processPropertyRequest(inputs, phoneNumber, sessionKey, session, bedroomsInput) {
  const budgetRange = BUDGET_MAP[session.steps.budget] || BUDGET_MAP["2"];
  const bedrooms = bedroomsInput ? BEDROOMS_MAP[bedroomsInput] : "Any";
  const isFinalConfirm = inputs.length === 6 || inputs.length === 5 && !bedroomsInput;
  if (!isFinalConfirm) {
    return `CON Confirm your request:
Type: ${session.steps.propertyType?.replace("_", " to ")}
City: ${session.steps.city}
Budget: ${budgetRange.label}
Bedrooms: ${bedrooms}

1. Confirm - Submit
2. Start again`;
  }
  const confirmInput = inputs[inputs.length - 1];
  if (confirmInput === "2") {
    return menuFindAgent_Step1();
  }
  if (confirmInput !== "1") {
    return "END Invalid option. Please dial again.";
  }
  try {
    const [customerRequest] = await db.insert(customerRequests).values({
      phoneNumber,
      propertyType: session.steps.propertyType,
      preferredCity: session.steps.city,
      budgetMin: budgetRange.min,
      budgetMax: budgetRange.max,
      currency: "USD",
      bedrooms: bedroomsInput ? BEDROOMS_MAP[bedroomsInput] : null,
      country: "ZW",
      source: "ussd",
      status: "pending"
    }).returning();
    fetch(process.env.N8N_WEBHOOK_LEAD_QUALIFY, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.N8N_API_KEY },
      body: JSON.stringify({
        customerRequestId: customerRequest.id,
        customerData: {
          budget: `${budgetRange.min}-${budgetRange.max} USD`,
          propertyType: session.steps.propertyType,
          location: session.steps.city + ", Zimbabwe",
          country: "ZW"
        }
      })
    }).catch(console.error);
    await deleteUSSDSession(sessionKey);
    return `END Request submitted!

A verified agent in ${session.steps.city} will call you within 2 hours on ${phoneNumber}.

Reference: REF-${customerRequest.id.substring(0, 8)}

Powered by Refer Property`;
  } catch (err) {
    console.error("USSD request creation failed:", err);
    return "END System error. Please try again or call 0800-REFER-ZW";
  }
}
async function handleAgentRegisterFlow(inputs, phoneNumber) {
  const step = inputs.length;
  if (step === 2) {
    return `CON Enter your ZREB license number
(e.g. ZREB/2023/1234):`;
  }
  if (step === 3) {
    return `CON Which city do you operate in?

1. Harare
2. Bulawayo
3. Mutare
4. Gweru
5. Other`;
  }
  if (step === 4) {
    const name = inputs[1];
    const licenseNumber = inputs[2];
    const city = CITY_MAP[inputs[3]] || "Other";
    const [preReg] = await db.insert(agentPreRegistrations).values({
      phoneNumber,
      name,
      licenseNumber,
      city,
      country: "ZW",
      source: "ussd",
      status: "ussd_pending"
    }).returning();
    await sendSMS(
      phoneNumber,
      `Hi ${name}, you're almost registered on Refer Property! Complete your registration and upload your ZREB certificate here: ${process.env.APP_BASE_URL}/register/agent?phone=${encodeURIComponent(phoneNumber)}&ref=${preReg.id} - Refer Property`
    );
    return `END Registration started!

Check your SMS for a link to complete your registration and upload your ZREB certificate.

Reference: AGT-${preReg.id.substring(0, 8)}

Refer Property`;
  }
  return "END Session error. Please dial again.";
}
async function handleReferrerFlow(inputs, phoneNumber) {
  const step = inputs.length;
  if (step === 1) {
    return `CON Earn money by referring people to agents!

You get $15 USD for every successful deal.

1. Get my referral code
2. How does it work?
3. Back to main menu`;
  }
  if (step === 2) {
    if (inputs[1] === "2") {
      return `CON How referrals work:

1. You get a unique code
2. Share it with someone needing a property
3. They find an agent through Refer
4. Deal closes = you earn $15 USD

1. Get my code
2. Back`;
    }
    if (inputs[1] === "3") {
      return "CON Returning...";
    }
    return `CON Enter your name to create account:`;
  }
  if (step === 3) {
    const name = inputs[2];
    const shortCode = generateShortCode();
    let user = await db.query.users.findFirst({ where: eq2(users2.phone, phoneNumber) });
    if (!user) {
      [user] = await db.insert(users2).values({
        phone: phoneNumber,
        firstName: name,
        role: "referrer",
        onboardingStatus: "phone_verified"
      }).returning();
    }
    await db.insert(referralLinks).values({
      referrerId: user.id,
      shortCode,
      targetCountry: "ZW",
      isActive: true
    });
    await sendSMS(
      phoneNumber,
      `Your Refer code is: ${shortCode}. Share this link: ${process.env.APP_BASE_URL}/r/${shortCode} - Earn $15 per deal! Refer Property`
    );
    return `END Your referral code: ${shortCode}

Share this link with anyone looking for property:
${process.env.APP_BASE_URL}/r/${shortCode}

We sent the link to your phone too.

Earn $15 per successful deal!
Refer Property`;
  }
  return "END Invalid option.";
}
async function menuCheckEarnings(phoneNumber) {
  try {
    const referrer = await db.query.users.findFirst({
      where: eq2(users2.phone, phoneNumber)
    });
    if (!referrer) {
      return `END No account found for ${phoneNumber}.

Dial again and select option 3 to register as a referrer.`;
    }
    const links = await db.query.referralLinks.findMany({
      where: eq2(referralLinks.referrerId, referrer.id)
    });
    const totalEarnings = links.reduce(
      (sum, l) => sum + parseFloat(l.totalEarningsUsd || "0"),
      0
    );
    const totalConversions = links.reduce((sum, l) => sum + (l.totalConversions || 0), 0);
    const totalClicks = links.reduce((sum, l) => sum + (l.totalClicks || 0), 0);
    const balance = await db.query.balances.findFirst({
      where: eq2(balances.userId, referrer.id)
    });
    return `END Your Refer Earnings

Total earned: $${totalEarnings.toFixed(2)} USD
Deals closed: ${totalConversions}
Link clicks: ${totalClicks}
Available balance: $${parseFloat(balance?.available || "0").toFixed(2)}

To withdraw, visit:
${process.env.APP_BASE_URL}/dashboard
Or call: 0800-REFER-ZW`;
  } catch (err) {
    return "END Unable to load earnings. Please try again.";
  }
}
function menuSupport() {
  return `END Refer Property Support

Call us: 0800-REFER-ZW (Free)
WhatsApp: +263 77 REFER 00
Email: help@refer.co.zw
Hours: Mon-Fri 8am-5pm CAT

For urgent issues:
WhatsApp is fastest.`;
}
function generateShortCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// server/lib/n8n-triggers.ts
var N8N_API_KEY = process.env.N8N_API_KEY;
var N8N_BASE_URL = process.env.N8N_WEBHOOK_URL;
async function triggerN8N(workflowPath, payload) {
  if (!N8N_BASE_URL || !N8N_API_KEY) {
    console.warn(`n8n trigger skipped: Missing configuration for ${workflowPath}`);
    return;
  }
  try {
    const response = await fetch(`${N8N_BASE_URL}/${workflowPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": N8N_API_KEY
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error(`n8n responded with ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error(`n8n trigger failed (${workflowPath}):`, err.message);
    await storage.logWorkflow({
      workflowId: workflowPath,
      status: "failed",
      payload: { error: err.message, originalPayload: payload },
      timestamp: /* @__PURE__ */ new Date()
    });
  }
}
async function triggerAgentVerification(agentId, documentUrl, country) {
  return triggerN8N("verify-agent", { agentId, documentUrl, country });
}
async function triggerPhotoAnalysis(propertyId, photos) {
  return triggerN8N("analyze-photos", { propertyId, photos });
}
async function triggerLeadMatching(requestId) {
  return triggerN8N("match-agents", { requestId });
}
async function triggerCommissionPayout(dealId) {
  return triggerN8N("payout-commission", { dealId });
}
async function triggerReviewRequest(dealId, customerId, agentId) {
  return triggerN8N("review-request", { dealId, customerId, agentId });
}

// server/routes.ts
import Stripe from "stripe";

// server/lib/firebase-storage.ts
init_firebase_admin();
import { v4 as uuidv4 } from "uuid";
async function uploadPropertyPhoto(fileBuffer, propertyId, agentId) {
  const fileName = `${uuidv4()}.jpg`;
  const storagePath = `property-photos/${agentId}/${propertyId}/${fileName}`;
  const bucket = storage2.bucket();
  const file = bucket.file(storagePath);
  await file.save(fileBuffer, {
    metadata: {
      contentType: "image/jpeg",
      metadata: { propertyId: propertyId.toString() }
    }
  });
  await file.makePublic();
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
  return { url: publicUrl, storagePath, fileName };
}
async function uploadToFirebase(fileBuffer, storagePath, mimeType) {
  const bucket = storage2.bucket();
  const file = bucket.file(storagePath);
  await file.save(fileBuffer, {
    metadata: {
      contentType: mimeType
    }
  });
  await file.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
}

// server/lib/gemini-document.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
var genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
var model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
var COUNTRY_PROMPTS = {
  ZW: `
You are verifying a Zimbabwe Estate Agents Council (ZREB) registration document.

WHAT TO LOOK FOR:
- ZREB registration number (format: ZREB/YYYY/NNNN or similar)
- Certificate of registration
- Agent's full name (must match National ID)
- Registration validity period (annual renewal)
- Issuing authority: Zimbabwe Real Estate and Business Corporation (ZREBC) or ZREB

RED FLAGS to report in issues[]:
- Expired registration (check the date carefully)
- Missing ZREB stamp or signature
- Registration number format doesn't match ZREB standards
- Document appears to be a photocopy of a photocopy (quality loss)
- Name is illegible or partially obscured

ZIMBABWE-SPECIFIC NOTES:
- ZREB certificates are often handwritten or typed on official letterhead
- Registration numbers may include branch codes (e.g. HRE for Harare, BYO for Bulawayo)
- Some agents have Estate Agents Council (EAC) certificates from before ZREB \u2014 these are still valid if not expired
`,
  ZA: `
You are verifying a South African Property Practitioners Regulatory Authority (PPRA) document.

WHAT TO LOOK FOR:
- FFC number (Fidelity Fund Certificate number \u2014 this is MANDATORY, format: varies by year)
- Full/Principal status or Intern/Candidate status
- Practitioner's full name
- FFC validity period (annual, expires December 31 each year)
- Issuing authority: PPRA (previously EAAB)

RED FLAGS to report in issues[]:
- Expired FFC \u2014 THIS IS A LEGAL DISQUALIFICATION in South Africa
- "Intern" or "Candidate" status without supervision note
- FFC number not matching PPRA format
- Old EAAB certificates expired before 2022 are not transferable
- Missing PPRA logo or security features

SOUTH AFRICA-SPECIFIC NOTES:
- Since 2022, all practitioners must have PPRA FFC not EAAB FFC
- The certificate must show the current calendar year
- FFC numbers are public \u2014 can be verified at www.ppra.org.za
- Agents without FFC are operating illegally and must be rejected
`,
  JP: `
You are verifying a Japanese Real Estate Broker license document (\u5B85\u5730\u5EFA\u7269\u53D6\u5F15\u58EB\u8A3C).

WHAT TO LOOK FOR:
- \u5B85\u5730\u5EFA\u7269\u53D6\u5F15\u58EB\u8A3C (Takuchi Tatemono Torihikishi Sho) \u2014 the physical license card
- \u767B\u9332\u756A\u53F7 (registration number) \u2014 format: prefecture code + sequential number
- \u4EA4\u4ED8\u5E74\u6708\u65E5 (issue date)
- \u6709\u52B9\u671F\u9650 (expiry date) \u2014 valid for 5 years
- \u90FD\u9053\u5E9C\u770C\u77E5\u4E8B (issuing governor \u2014 prefecture name)
- Holder's name in kanji (\u6C0F\u540D)

RED FLAGS to report in issues[]:
- \u6709\u52B9\u671F\u9650 (expiry) has passed
- Registration number format doesn't match \u90FD\u9053\u5E9C\u770C pattern
- License card shows damage or alterations
- Missing \u90FD\u9053\u5E9C\u770C\u77E5\u4E8B (prefectural governor) name
- Name in romaji only (official licenses always have kanji)

JAPAN-SPECIFIC NOTES:
- License is a physical card, about credit-card sized
- The prefecture number is important: Tokyo is \u6771\u4EAC\u90FD\u77E5\u4E8B, Osaka is \u5927\u962A\u5E9C\u77E5\u4E8B
- Licenses must be renewed every 5 years with 32 hours of continuing education
- \u5B85\u5EFA\u58EB is the abbreviation \u2014 valid alternative on documents
- Some agents have \u4E0D\u52D5\u7523\u9451\u5B9A\u58EB (real estate appraiser) \u2014 different license, note this
`
};
function buildExtractionPrompt(country) {
  const countryInstructions = COUNTRY_PROMPTS[country] || COUNTRY_PROMPTS.ZW;
  return `
${countryInstructions}

INSTRUCTIONS:
1. Carefully examine every part of the document image or PDF
2. Extract all relevant information
3. Return ONLY a valid JSON object \u2014 no markdown, no explanation, no preamble
4. If you cannot read something clearly, return null for that field
5. Be conservative with confidenceScore \u2014 only give 0.9+ if the document is crystal clear

REQUIRED JSON STRUCTURE (return exactly this, no extra fields at top level):
{
  "licenseNumber": "extracted number or null",
  "expiryDate": "YYYY-MM-DD or null",
  "issuedDate": "YYYY-MM-DD or null",
  "issuingAuthority": "exact text from document or null",
  "holderName": "full name as on document or null",
  "isExpired": true or false,
  "confidenceScore": 0.0 to 1.0,
  "issues": ["array of specific problems found, empty if none"],
  "rawExtracted": {
    "any other text you extracted": "value"
  }
}

CONFIDENCE SCORING GUIDE:
- 0.9 - 1.0: All required fields clearly readable, no issues
- 0.7 - 0.89: Most fields readable, minor quality issues
- 0.5 - 0.69: Some fields unclear, may need manual review
- 0.3 - 0.49: Major readability issues, human review recommended
- 0.0 - 0.29: Cannot reliably extract \u2014 definitely needs human review
`;
}
async function extractDocumentData(documentBuffer, mimeType, country) {
  const base64Data = documentBuffer.toString("base64");
  const prompt = buildExtractionPrompt(country);
  const imagePart = {
    inlineData: { data: base64Data, mimeType }
  };
  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await model.generateContent([prompt, imagePart]);
      const text2 = result.response.text().trim();
      const cleaned = text2.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
      const parsed = JSON.parse(cleaned);
      if (typeof parsed.confidenceScore !== "number") {
        throw new Error("Missing confidenceScore in Gemini response");
      }
      return parsed;
    } catch (err) {
      lastError = err;
      console.error(`Gemini extraction attempt ${attempt} failed:`, err);
      await new Promise((r) => setTimeout(r, 1e3 * attempt));
    }
  }
  console.error("All Gemini extraction attempts failed:", lastError);
  return {
    licenseNumber: null,
    expiryDate: null,
    issuingAuthority: null,
    holderName: null,
    issuedDate: null,
    isExpired: false,
    confidenceScore: 0,
    issues: ["AI extraction failed \u2014 manual review required"],
    rawExtracted: {}
  };
}
async function analyzeDocument(documentUrl, country) {
  try {
    const response = await fetch(documentUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch document from ${documentUrl}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const mimeType = contentType.includes("pdf") ? "application/pdf" : "image/jpeg";
    const result = await extractDocumentData(buffer, mimeType, country);
    const isVerified = result.confidenceScore > 0.7 && !result.isExpired && !!result.licenseNumber;
    let reason = "Verification successful";
    if (result.isExpired) reason = "License has expired";
    else if (!result.licenseNumber) reason = "Could not find a valid license number";
    else if (result.confidenceScore <= 0.7) reason = "Document quality too low for certain verification";
    if (result.issues.length > 0) {
      reason += `. Issues found: ${result.issues.join(", ")}`;
    }
    return {
      isVerified,
      licenseNumber: result.licenseNumber,
      confidence: result.confidenceScore,
      reason
    };
  } catch (error) {
    console.error("analyzeDocument error:", error);
    return {
      isVerified: false,
      licenseNumber: null,
      confidence: 0,
      reason: `System error during analysis: ${error.message}`
    };
  }
}

// server/lib/paynow.ts
init_db();
init_schema();
import { Paynow } from "paynow";
import { eq as eq3 } from "drizzle-orm";
var paynow = new Paynow(
  process.env.PAYNOW_INTEGRATION_ID || "dummy_id",
  process.env.PAYNOW_INTEGRATION_KEY || "dummy_key"
);
paynow.resultUrl = `${process.env.APP_BASE_URL}/api/payments/paynow/update`;
paynow.returnUrl = `${process.env.APP_BASE_URL}/dashboard/settings/payments?provider=paynow`;
async function initiateMobilePayment(userId, amount, phone, email, reason) {
  try {
    const payment = paynow.createPayment(reason, email);
    payment.add(reason, amount);
    const response = await paynow.sendMobile(payment, phone, "ecocash");
    if (response.success) {
      const [transaction] = await db.insert(paymentTransactions).values({
        userId,
        type: "subscription",
        provider: "paynow",
        providerTransactionId: response.pollUrl,
        // Store poll URL to check status later
        amountLocal: amount.toString(),
        currency: "USD",
        status: "pending",
        metadata: {
          phone,
          reason,
          paynowPollUrl: response.pollUrl
        }
      }).returning();
      return {
        success: true,
        pollUrl: response.pollUrl,
        transactionId: transaction.id
      };
    } else {
      return { success: false, error: response.error };
    }
  } catch (error) {
    console.error("Paynow mobile payment initiation error:", error);
    return { success: false, error: error.message };
  }
}
async function checkPaymentStatus(pollUrl) {
  try {
    const status = await paynow.pollTransaction(pollUrl);
    return {
      status: status.status,
      // 'Paid', 'Sent', 'Cancelled', etc.
      rawResponse: status
    };
  } catch (error) {
    console.error("Paynow status check error:", error);
    return { status: "error", rawResponse: error };
  }
}
async function updatePaynowTransaction(pollUrl, status) {
  const [transaction] = await db.select().from(paymentTransactions).where(eq3(paymentTransactions.providerTransactionId, pollUrl));
  if (!transaction) {
    console.warn(`Paynow update received for unknown transaction: ${pollUrl}`);
    return;
  }
  const isCompleted = status.toLowerCase() === "paid";
  const updatedStatus = isCompleted ? "completed" : status.toLowerCase() === "cancelled" ? "failed" : "pending";
  await db.update(paymentTransactions).set({
    status: updatedStatus,
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq3(paymentTransactions.id, transaction.id));
  if (isCompleted && transaction.type === "subscription") {
    await db.update(users2).set({
      subscriptionStatus: "active",
      subscriptionRenewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3)
      // 30 days
    }).where(eq3(users2.id, transaction.userId));
  }
}

// server/lib/agent-scoring.ts
init_db();
init_schema();
import { eq as eq4 } from "drizzle-orm";
async function calculateAgentScore(agentId) {
  try {
    const agentLeads = await db.select().from(leads).where(eq4(leads.agentId, agentId));
    const totalLeadsReceived = agentLeads.length;
    if (totalLeadsReceived === 0) return;
    const acceptedLeads = agentLeads.filter((l) => l.acceptedAt !== null);
    const totalLeadsAccepted = acceptedLeads.length;
    const closedLeads = agentLeads.filter((l) => l.status === "closed");
    const totalDealsClosed = closedLeads.length;
    const twoHoursInMs = 2 * 60 * 60 * 1e3;
    const leadsAcceptedWithinTime = acceptedLeads.filter((l) => {
      if (!l.acceptedAt || !l.createdAt) return false;
      return l.acceptedAt.getTime() - l.createdAt.getTime() <= twoHoursInMs;
    }).length;
    const responseRateScore = totalLeadsReceived > 0 ? leadsAcceptedWithinTime / totalLeadsReceived * 100 : 100;
    const conversionRate = totalLeadsAccepted > 0 ? totalDealsClosed / totalLeadsAccepted * 100 : 0;
    let totalResponseTime = 0;
    acceptedLeads.forEach((l) => {
      if (l.acceptedAt && l.createdAt) {
        totalResponseTime += l.acceptedAt.getTime() - l.createdAt.getTime();
      }
    });
    const avgResponseTimeMinutes = totalLeadsAccepted > 0 ? Math.round(totalResponseTime / (totalLeadsAccepted * 60 * 1e3)) : null;
    const [profile] = await db.select().from(agentProfiles2).where(eq4(agentProfiles2.userId, agentId));
    const customerRatingAvg = parseFloat(profile?.rating || "0");
    const weightedScore = responseRateScore * 0.4 + conversionRate * 0.4 + customerRatingAvg * 20 * 0.2;
    const reliabilityIndex = Math.min(Math.max(weightedScore, 0), 100);
    const [existingScore] = await db.select().from(agentScores).where(eq4(agentScores.agentId, agentId));
    if (existingScore) {
      await db.update(agentScores).set({
        responseRateScore: responseRateScore.toString(),
        conversionRate: conversionRate.toString(),
        avgResponseTimeMinutes,
        totalLeadsReceived,
        totalLeadsAccepted,
        totalDealsClosed,
        customerRatingAvg: customerRatingAvg.toString(),
        reliabilityIndex: reliabilityIndex.toString(),
        reliabilityLastCalculatedAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq4(agentScores.id, existingScore.id));
    } else {
      await db.insert(agentScores).values({
        agentId,
        responseRateScore: responseRateScore.toString(),
        conversionRate: conversionRate.toString(),
        avgResponseTimeMinutes,
        totalLeadsReceived,
        totalLeadsAccepted,
        totalDealsClosed,
        customerRatingAvg: customerRatingAvg.toString(),
        reliabilityIndex: reliabilityIndex.toString(),
        reliabilityLastCalculatedAt: /* @__PURE__ */ new Date()
      });
    }
    console.log(`Updated scoring for agent ${agentId}: Index ${reliabilityIndex.toFixed(1)}`);
    return reliabilityIndex;
  } catch (error) {
    console.error(`Error calculating score for agent ${agentId}:`, error);
  }
}
var triggerAgentScoringUpdate = (agentId) => {
  calculateAgentScore(agentId).catch(console.error);
};

// server/routes.ts
init_firestore_chat();
init_db();
init_schema();
import { and as and9, eq as eq11, desc as desc5, sql as sql10, inArray as inArray2 } from "drizzle-orm";

// server/lib/gemini-photos.ts
import { GoogleGenerativeAI as GoogleGenerativeAI2 } from "@google/generative-ai";
var genAI2 = new GoogleGenerativeAI2(process.env.GEMINI_API_KEY);
var model2 = genAI2.getGenerativeModel({ model: "gemini-2.0-flash" });
var PHOTO_ANALYSIS_PROMPT = `
You are a real estate photo quality analyst. Analyze this property photo and return ONLY valid JSON.

DETECT AND EXTRACT:
1. Room type (bedroom/living/kitchen/bathroom/exterior/other)
2. Visible amenities from this list:
   - aircon, heating, balcony, garden, parking, storage, internet_cable,
     washing_machine, dryer, dishwasher, furnished, flooring_wood,
     flooring_tile, natural_light, city_view, mountain_view, pool
3. Estimated room size (small <10sqm, medium 10-20sqm, large >20sqm)
4. Photo quality issues:
   - too_dark, too_bright, blurry, too_small_resolution,
     cluttered, personal_items_visible, inappropriate_content,
     not_a_room (e.g. random photo), watermarked

QUALITY SCORE GUIDE:
- 90-100: Professional quality, well-lit, clean, good angle
- 70-89: Good quality, acceptable for listing
- 50-69: Acceptable but not ideal
- 30-49: Poor quality, strongly suggest retaking
- 0-29: Reject \u2014 unusable

Return this exact JSON:
{
  "roomType": "bedroom|living|kitchen|bathroom|exterior|other",
  "detectedAmenities": ["array from the list above"],
  "estimatedSizeCategory": "small|medium|large",
  "qualityScore": 0-100,
  "qualityIssues": ["array of issues found"],
  "shouldReject": true or false,
  "rejectionReason": "specific reason or null",
  "agentAdvice": "one sentence tip to improve this photo or null"
}
`;
async function analyzePropertyPhoto(imageBuffer, mimeType = "image/jpeg") {
  const base64 = imageBuffer.toString("base64");
  const result = await model2.generateContent([
    PHOTO_ANALYSIS_PROMPT,
    { inlineData: { data: base64, mimeType } }
  ]);
  const text2 = result.response.text().trim().replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  return JSON.parse(text2);
}

// server/lib/content-moderation.ts
import { GoogleGenerativeAI as GoogleGenerativeAI3 } from "@google/generative-ai";
var genAI3 = new GoogleGenerativeAI3(process.env.GEMINI_API_KEY);
var model3 = genAI3.getGenerativeModel({ model: "gemini-2.0-flash" });
async function moderateMessage(text2) {
  const result = await model3.generateContent(`
    Analyze this real estate platform message for policy violations.
    Return ONLY valid JSON, no markdown.
    
    Message: "${text2.slice(0, 1e3)}"
    
    {
      "explicit": false,
      "violence": false,
      "harassment": false,
      "spam": false,
      "fraud": false,
      "personalInfo": false,
      "action": "allow|flag|block",
      "confidence": 0.0-1.0,
      "reason": "null or specific reason"
    }
    
    personalInfo = true if message contains phone numbers, emails, or 
    attempts to move conversation off platform (big policy concern).
    fraud = true if message requests payment outside the platform.
  `);
  const responseText = result.response.text().trim().replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  const parsed = JSON.parse(responseText);
  return {
    safe: parsed.action === "allow",
    categories: {
      explicit: parsed.explicit,
      violence: parsed.violence,
      harassment: parsed.harassment,
      spam: parsed.spam,
      fraud: parsed.fraud,
      personalInfo: parsed.personalInfo
    },
    confidence: parsed.confidence,
    action: parsed.action,
    reason: parsed.reason
  };
}

// server/lib/ai-ghostwriter.ts
import OpenAI2 from "openai";
var openai2 = new OpenAI2({ apiKey: process.env.OPENAI_API_KEY || "default_key" });
async function ghostwriteFirstContact(ctx) {
  const prompt = `
You are ghostwriting for ${ctx.agentName}, a verified property agent in ${ctx.city}.
Write a first contact message to a new lead. Be warm, professional, and specific.

LEAD CONTEXT:
- Customer: ${ctx.customerName}
- Looking for: ${ctx.propertyType} in ${ctx.city}
- Budget: ${ctx.budget} ${ctx.currency}
- Urgency: ${ctx.urgencyTag}
- AI Insight: ${ctx.geminiReasoning || "No additional context"}
${ctx.suggestedAlternatives?.length > 0 ? `- Consider mentioning: ${ctx.suggestedAlternatives[0].suggestion}` : ""}

RULES:
- Do NOT mention AI or scoring
- Do NOT be overly salesy
- Reference their specific search criteria
- For ${ctx.country === "ZW" ? "Zimbabwe" : ctx.country === "ZA" ? "South Africa" : "Japan"}: use appropriate local property terms
- Keep WhatsApp version under 160 characters
${ctx.language === "ja" ? "- Write in natural Japanese" : "- Write in natural English"}

Return ONLY valid JSON:
{
  "shortVersion": "WhatsApp message under 160 chars",
  "longVersion": "3-4 sentence in-app message",
  "callScript": "2-3 sentence phone script opening"
}`;
  const response = await openai2.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7
  });
  return JSON.parse(response.choices[0].message.content);
}

// server/lib/property-valuation.ts
init_db();
init_schema();
import { eq as eq5, and as and4, desc as desc2, sql as sql4 } from "drizzle-orm";
import { GoogleGenerativeAI as GoogleGenerativeAI4 } from "@google/generative-ai";
async function fetchMarketAverageFromGemini(propertyType, city, country, bedrooms) {
  const genAI4 = new GoogleGenerativeAI4(process.env.GEMINI_API_KEY);
  const model4 = genAI4.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model4.generateContent(`
    Estimate the current average monthly rent for a ${bedrooms || "any"} bedroom ${propertyType} in ${city}, ${country}.
    Return ONLY a number representing the local currency amount. No text.
  `);
  const text2 = result.response.text().trim();
  return parseFloat(text2.replace(/[^0-9.]/g, "")) || 0;
}
async function valuatePropertyRequest(propertyType, city, country, bedrooms, customerBudget, currency) {
  const snapshot = await db.query.marketSnapshots.findFirst({
    where: and4(
      eq5(marketSnapshots.country, country),
      eq5(marketSnapshots.city, city),
      sql4`property_type = ${propertyType} OR property_type IS NULL`
    ),
    orderBy: [desc2(marketSnapshots.snapshotDate)]
  });
  const marketAvg = snapshot ? parseFloat(snapshot.avgRentLocal || "0") : await fetchMarketAverageFromGemini(propertyType, city, country, bedrooms);
  const gapPercent = marketAvg > 0 ? (customerBudget - marketAvg) / marketAvg * 100 : 0;
  const isRealistic = gapPercent >= -20;
  const genAI4 = new GoogleGenerativeAI4(process.env.GEMINI_API_KEY);
  const model4 = genAI4.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model4.generateContent(`
    A customer in ${city}, ${country} wants a ${bedrooms || "any"} bedroom ${propertyType}.
    Their budget is ${customerBudget} ${currency}.
    Market average for this type is ${marketAvg} ${currency}.
    Gap: ${gapPercent.toFixed(1)}%.
    
    Return ONLY valid JSON:
    {
      "recommendation": "2 sentence friendly advice",
      "alternatives": [
        { "option": "description", "estimatedPrice": 0, "savingsPercent": 0 }
      ]
    }
    
    Give 3 practical alternatives if budget is below market (smaller area, 
    nearby suburb, fewer bedrooms). If on/above market, give 1 upgrade suggestion.
  `);
  const responseText = result.response.text().trim().replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  const parsed = JSON.parse(responseText);
  return {
    isRealistic,
    marketAvgPrice: marketAvg,
    marketAvgPriceFormatted: `${currency} ${marketAvg.toLocaleString()}`,
    customerBudget,
    gapPercent: parseFloat(gapPercent.toFixed(1)),
    recommendation: parsed.recommendation,
    alternatives: parsed.alternatives,
    confidence: snapshot ? "high" : "medium"
  };
}

// server/lib/analytics.ts
function trackEvent(userId, event, properties2) {
  console.log(`[Analytics] ${event} for ${userId}`, properties2);
}

// server/routes.ts
init_schema();

// server/lib/market-pulse.ts
init_db();
init_schema();
import { eq as eq6, and as and5, sql as sql5 } from "drizzle-orm";
import { GoogleGenerativeAI as GoogleGenerativeAI5 } from "@google/generative-ai";
async function computeMarketPulse(country, city) {
  const [searches, listings, closedToday] = await Promise.all([
    db.select({ count: sql5`count(*)` }).from(customerRequests).where(and5(eq6(customerRequests.country, country), eq6(customerRequests.city, city), eq6(customerRequests.status, "pending"))),
    db.select({ count: sql5`count(*)` }).from(properties).where(and5(eq6(properties.country, country), eq6(properties.city, city), eq6(properties.status, "active"))),
    db.select({ count: sql5`count(*)` }).from(customerRequests).where(and5(eq6(customerRequests.status, "closed"), sql5`updated_at::date = CURRENT_DATE`))
  ]);
  const areas = await db.select({
    area: customerRequests.preferredCity,
    count: sql5`count(*)`
  }).from(customerRequests).where(eq6(customerRequests.country, country)).groupBy(customerRequests.preferredCity).limit(5);
  const genAI4 = new GoogleGenerativeAI5(process.env.GEMINI_API_KEY);
  const model4 = genAI4.getGenerativeModel({ model: "gemini-2.0-flash" });
  const insightResult = await model4.generateContent(`
    As a real estate data scientist, give a 1-sentence punchy insight based on these numbers for ${city}, ${country}:
    Active Searches: ${searches[0].count}
    Active Listings: ${listings[0].count}
    Deals Closed Today: ${closedToday[0].count}
    Demand/Supply Ratio: ${(searches[0].count / (listings[0].count || 1)).toFixed(2)}
  `);
  return {
    country,
    city,
    lastUpdated: /* @__PURE__ */ new Date(),
    activeSearches: Number(searches[0].count),
    activeListings: Number(listings[0].count),
    dealsClosedToday: Number(closedToday[0].count),
    avgTimeToCloseHours: 48,
    // Aggregate from analytics later
    hotNeighbourhoods: areas.map((a) => ({ name: a.area || "Unknown", searchVolume: Number(a.count), trend: "up" })),
    priceMovement: [
      { propertyType: "Apartment", avgPrice: 1200, changePercent7d: 1.2 }
    ],
    demandSupplyRatio: parseFloat((searches[0].count / (listings[0].count || 1)).toFixed(2)),
    agentInsight: insightResult.response.text().trim()
  };
}

// server/lib/deal-predictor.ts
init_db();
init_schema();
import { eq as eq7, sql as sql6 } from "drizzle-orm";
import { GoogleGenerativeAI as GoogleGenerativeAI6 } from "@google/generative-ai";
async function predictDealOutcome(leadId) {
  const lead = await db.query.customerRequests.findFirst({
    where: eq7(customerRequests.id, leadId),
    with: {
      intelligence: true,
      customer: { with: { userProfile: true } }
    }
  });
  if (!lead) {
    throw new Error(`Lead ${leadId} not found`);
  }
  let agentInfo = null;
  if (lead.assignedAgentId) {
    agentInfo = await db.query.users.findFirst({
      where: eq7(users2.id, lead.assignedAgentId),
      with: { agentScores: true }
    });
  }
  const daysSinceAssigned = lead.assignedAt ? Math.floor((Date.now() - new Date(lead.assignedAt).getTime()) / 864e5) : 0;
  const messagesCount = await db.select({ count: sql6`count(*)` }).from(messages).innerJoin(conversations2, eq7(conversations2.id, messages.conversationId)).innerJoin(leads, eq7(leads.id, conversations2.leadId)).where(eq7(leads.requestId, leadId));
  const lastMessage = await db.select({ createdAt: messages.createdAt }).from(messages).innerJoin(conversations2, eq7(conversations2.id, messages.conversationId)).innerJoin(leads, eq7(leads.id, conversations2.leadId)).where(eq7(leads.requestId, leadId)).orderBy(sql6`${messages.createdAt} DESC`).limit(1);
  const genAI4 = new GoogleGenerativeAI6(process.env.GEMINI_API_KEY);
  const model4 = genAI4.getGenerativeModel({ model: "gemini-2.0-flash" });
  const hoursSinceLastMessage = lastMessage[0]?.createdAt ? Math.floor((Date.now() - new Date(lastMessage[0].createdAt).getTime()) / 36e5) : 168;
  const result = await model4.generateContent(`
    You are a real estate deal prediction AI. Analyse these signals and predict deal outcome.
    Return ONLY valid JSON.
    
    SIGNALS:
    - Days since agent assigned: ${daysSinceAssigned}
    - Total messages exchanged: ${messagesCount[0]?.count || 0}
    - Hours since last message: ${hoursSinceLastMessage}
    - Lead AI score: ${lead.intelligence?.geminiScore ?? "unknown"}
    - Agent conversion rate: ${agentInfo?.agentScores?.conversionRate ?? "unknown"}
    - Agent reliability: ${agentInfo?.agentScores?.reliabilityIndex ?? "unknown"}
    - Budget vs market: ${lead.intelligence?.budgetRealism ?? 1}
    - Customer move-in date: ${lead.moveInDate ?? "not specified"}
    - Country: ${lead.country}
    
    {
      "closeProbability": 0-100,
      "earliestCloseDays": 1-90,
      "latestCloseDays": 1-180,
      "riskFactors": ["array of specific risks"],
      "accelerators": ["actions agent can take NOW"],
      "recommendedNextAction": "single most important action",
      "confidenceLevel": "low|medium|high"
    }
  `);
  const text2 = result.response.text().trim().replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  const parsed = JSON.parse(text2);
  const now = /* @__PURE__ */ new Date();
  return {
    leadId,
    closeProbability: parsed.closeProbability,
    predictedCloseDateRange: {
      earliest: new Date(now.getTime() + parsed.earliestCloseDays * 864e5),
      latest: new Date(now.getTime() + parsed.latestCloseDays * 864e5)
    },
    riskFactors: parsed.riskFactors,
    accelerators: parsed.accelerators,
    recommendedNextAction: parsed.recommendedNextAction,
    confidenceLevel: parsed.confidenceLevel
  };
}

// server/lib/neighbourhood-intelligence.ts
init_db();
init_schema();
import { eq as eq8, and as and6, sql as sql7 } from "drizzle-orm";
import { GoogleGenerativeAI as GoogleGenerativeAI7 } from "@google/generative-ai";
async function generateNeighbourhoodProfile(area, city, country) {
  const cached = await db.query.neighbourhoodProfiles.findFirst({
    where: and6(
      eq8(neighbourhoodProfiles.area, area),
      eq8(neighbourhoodProfiles.city, city),
      eq8(neighbourhoodProfiles.country, country),
      sql7`last_updated > NOW() - INTERVAL '7 days'`
    )
  });
  if (cached) {
    return {
      ...cached,
      scores: cached.scores,
      insights: cached.insights,
      bestFor: cached.bestFor,
      avoidIf: cached.avoidIf,
      localTips: cached.localTips,
      priceDirection: cached.priceDirection,
      sources: cached.sources
    };
  }
  const genAI4 = new GoogleGenerativeAI7(process.env.GEMINI_API_KEY);
  const model4 = genAI4.getGenerativeModel({
    model: "gemini-2.0-flash",
    tools: [
      {
        //@ts-ignore - Dynamic tools check
        googleSearchRetrieval: {}
      }
    ]
  });
  const countryContext = {
    ZW: "Focus on ZESA load-shedding schedule reliability, borehole water availability, road infrastructure quality, and security (e.g., proximity to rapid response). Include USD economy context and major private schools nearby.",
    ZA: "Focus on Eskom load-shedding (stages info), water supply reliability/shedding, private security response presence (ADT/Fidelity), estate living vs open suburbs, and MyCiTi/Gautrain/Taxi access.",
    JP: "Focus on earthquake resistance ratings, proximity to convenience stores (combini), nearest train line/station distance (minutes), foreigner-friendliness (gaijin-friendly), and international schools."
  }[country];
  const result = await model4.generateContent(`
    Generate a comprehensive neighbourhood profile for ${area}, ${city}, ${country}.
    Use your search capability to find CURRENT (2025/2026), accurate information.
    ${countryContext}
    
    Return ONLY valid JSON matching this exact structure:
    {
      "scores": {
        "safety": 0-10, "transport": 0-10, "schools": 0-10,
        "shopping": 0-10, "nightlife": 0-10, "internet": 0-10,
        "powerSupply": 0-10, "waterSupply": 0-10, "expatsWelcome": 0-10
      },
      "insights": ["5-8 specific factual insights about crime rates, infrastructure, new developments etc."],
      "bestFor": ["2-4 resident types e.g. 'families', 'remote workers'"],
      "avoidIf": ["2-3 specific situations to avoid this area"],
      "localTips": ["3-5 insider tips residents know"],
      "priceDirection": "rising|stable|falling",
      "geminiSummary": "3-4 sentence honest neighbourhood summary",
      "sources": ["list of sources consulted e.g. news articles, municipal reports"]
    }
  `);
  const text2 = result.response.text().trim().replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  const parsed = JSON.parse(text2);
  const profileData = {
    area,
    city,
    country,
    scores: parsed.scores,
    insights: parsed.insights,
    bestFor: parsed.bestFor,
    avoidIf: parsed.avoidIf,
    localTips: parsed.localTips,
    priceDirection: parsed.priceDirection,
    geminiSummary: parsed.geminiSummary,
    sources: parsed.sources,
    lastUpdated: /* @__PURE__ */ new Date()
  };
  await db.insert(neighbourhoodProfiles).values(profileData).onConflictDoUpdate({
    target: [neighbourhoodProfiles.area, neighbourhoodProfiles.city, neighbourhoodProfiles.country],
    set: { ...profileData, lastUpdated: /* @__PURE__ */ new Date() }
  });
  return profileData;
}

// server/lib/trust-score.ts
init_db();
init_schema();
import { eq as eq9, and as and7, sql as sql8 } from "drizzle-orm";
function getTrustBand(score) {
  if (score < 100) return "unverified";
  if (score < 300) return "basic";
  if (score < 500) return "trusted";
  if (score < 750) return "verified";
  return "elite";
}
var TRUST_BADGES = {
  unverified: { label: "Unverified", emoji: "\u2B1C", color: "#9ca3af" },
  basic: { label: "Basic", emoji: "\u{1F535}", color: "#3b82f6" },
  trusted: { label: "Trusted", emoji: "\u2705", color: "#10b981" },
  verified: { label: "Verified Pro", emoji: "\u{1F3C5}", color: "#f59e0b" },
  elite: { label: "Elite Agent", emoji: "\u{1F48E}", color: "#6366f1" }
};
async function recalculateAgentTrustScore(agentId) {
  const [scores, disputesCount, reviewsAvg, leadsCount] = await Promise.all([
    db.query.agentScores.findFirst({ where: eq9(agentScores.agentId, agentId) }),
    db.select({ count: sql8`count(*)` }).from(disputes).where(and7(eq9(disputes.againstUserId, agentId), eq9(disputes.status, "resolved_customer_favour"))),
    db.select({ avg: sql8`avg(rating)` }).from(reviews).where(eq9(reviews.agentId, agentId)),
    db.select({ count: sql8`count(*)` }).from(customerRequests).where(eq9(customerRequests.assignedAgentId, agentId))
  ]);
  const verification = await db.query.agentVerifications.findFirst({
    where: eq9(agentVerifications.agentId, agentId)
  });
  const components = {
    verification_ai: verification?.verificationMethod === "auto_ai" ? 100 : 0,
    verification_human: verification?.verificationMethod === "manual_review" ? 150 : 0,
    response_rate: Math.min(100, Number(scores?.responseRateScore ?? 0)),
    conversion_rate: Math.min(100, Number(scores?.conversionRate ?? 0) * 100),
    customer_rating: Math.min(100, Number(reviewsAvg[0]?.avg ?? 0) * 20),
    no_disputes: disputesCount[0].count === 0 ? 100 : Math.max(0, 100 - Number(disputesCount[0].count) * 25),
    tenure: Math.min(100, Number(leadsCount[0].count) * 2)
  };
  const total = Object.values(components).reduce((a, b) => a + b, 0);
  if (scores) {
    await db.update(agentScores).set({
      reliabilityIndex: total.toString(),
      reliabilityLastCalculatedAt: /* @__PURE__ */ new Date(),
      scoreBand: getTrustBand(total)
      // Cast to enum
    }).where(eq9(agentScores.agentId, agentId));
  } else {
    await db.insert(agentScores).values({
      agentId,
      reliabilityIndex: total.toString(),
      reliabilityLastCalculatedAt: /* @__PURE__ */ new Date(),
      scoreBand: getTrustBand(total)
    });
  }
  const band = getTrustBand(total);
  return {
    total,
    band,
    components,
    badge: TRUST_BADGES[band].emoji,
    lastCalculatedAt: /* @__PURE__ */ new Date()
  };
}

// server/routes.ts
var upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images and PDFs are allowed."));
    }
  }
});
async function registerRoutes(app3) {
  await setupFirebaseAuth(app3);
  const verifyInternalSecret = (req, res, next) => {
    const secret = req.headers["x-refer-internal-secret"];
    if (secret !== process.env.INTERNAL_WEBHOOK_SECRET) {
      return res.status(401).json({ message: "Unauthorized automation attempt" });
    }
    next();
  };
  app3.post("/internal/webhooks/automation-callback", verifyInternalSecret, async (req, res) => {
    try {
      const { workflowId, status, payload } = req.body;
      await storage.logWorkflow({
        workflowId,
        status,
        payload,
        timestamp: /* @__PURE__ */ new Date()
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Automation callback error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app3.post("/internal/webhooks/lead-intelligence", verifyInternalSecret, async (req, res) => {
    try {
      const { leadId, score, analysis, classification } = req.body;
      await storage.updateLeadIntelligence({
        leadId,
        score,
        analysis,
        classification
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Lead intelligence update error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app3.get("/internal/api/system-health", verifyInternalSecret, async (req, res) => {
    res.json({
      status: "operational",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      version: "2.0.0-beta",
      region: process.env.GOOGLE_CLOUD_REGION || "local"
    });
  });
  app3.post("/public/ussd/callback", async (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text: text2 } = req.body;
    let response = "";
    const inputs = text2.split("*");
    const menuLevel = inputs[0];
    await storage.logWorkflow({
      workflowId: "ussd_session",
      status: "active",
      payload: { sessionId, phoneNumber, text: text2 },
      timestamp: /* @__PURE__ */ new Date()
    });
    const sessionKey = `ussd:${sessionId}`;
    let session = await getUSSDSession(sessionKey);
    if (!session) {
      session = { phoneNumber, steps: {}, startedAt: (/* @__PURE__ */ new Date()).toISOString() };
      await saveUSSDSession(sessionKey, session);
    }
    if (text2 === "") {
      response = `CON Welcome to Refer Property
Empowering local agents & referrers.

1. Find an Agent (Buy/Rent)
2. Agent Registration (ZREB)
3. Refer & Earn $15
4. Check My Earnings
5. Support`;
    } else if (menuLevel === "1") {
      response = await handleFindAgentFlow(inputs, phoneNumber, sessionKey, session);
    } else if (menuLevel === "2") {
      response = await handleAgentRegisterFlow(inputs, phoneNumber);
    } else if (menuLevel === "3") {
      response = await handleReferrerFlow(inputs, phoneNumber);
    } else if (menuLevel === "4") {
      response = await menuCheckEarnings(phoneNumber);
    } else if (menuLevel === "5") {
      response = menuSupport();
    } else {
      response = "END Invalid option. Please try again.";
    }
    res.set("Content-Type", "text/plain");
    res.send(response);
  });
  app3.post("/public/webhooks/stripe", express2.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const stripe2 = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_sk", { apiVersion: "2024-06-20" });
    let event;
    try {
      event = stripe2.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        break;
      case "customer.subscription.deleted":
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
  });
  app3.post("/public/webhooks/brevo/whatsapp", async (req, res) => {
    res.json({ received: true });
    const { messages: messages2 } = req.body;
    if (!messages2?.length) return;
    const { handleIncomingWhatsApp: handleIncomingWhatsApp2 } = await Promise.resolve().then(() => (init_whatsapp_handler(), whatsapp_handler_exports));
    for (const message of messages2) {
      await handleIncomingWhatsApp2(message);
    }
  });
  app3.get("/api/payments/connect/status", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const [profile] = await db.select().from(userProfiles).where(eq11(userProfiles.userId, userId));
      if (!profile?.stripeAccountId) {
        return res.json({ connected: false });
      }
      const account = await stripe.accounts.retrieve(profile.stripeAccountId);
      res.json({
        connected: true,
        isComplete: account.details_submitted,
        canReceivePayouts: account.payouts_enabled,
        disabledReason: account.requirements?.disabled_reason,
        requirements: account.requirements?.currently_due
      });
    } catch (error) {
      console.error("Error fetching Stripe Connect status:", error);
      res.status(500).json({ message: "Failed to fetch status" });
    }
  });
  app3.post("/api/payments/connect/start", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const [profile] = await db.select().from(userProfiles).where(eq11(userProfiles.userId, userId));
      let stripeAccountId = profile?.stripeAccountId;
      if (!stripeAccountId) {
        const account = await stripe.accounts.create({
          type: "express",
          country: profile?.country || "ZW",
          capabilities: {
            transfers: { requested: true }
          }
        });
        stripeAccountId = account.id;
        await db.update(userProfiles).set({ stripeAccountId }).where(eq11(userProfiles.userId, userId));
      }
      const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: `${process.env.APP_BASE_URL}/dashboard/settings/payments?stripe_return=false`,
        return_url: `${process.env.APP_BASE_URL}/dashboard/settings/payments?stripe_return=true`,
        type: "account_onboarding"
      });
      res.json({ onboardingUrl: accountLink.url });
    } catch (error) {
      console.error("Error starting Stripe onboarding:", error);
      res.status(500).json({ message: "Failed to start onboarding" });
    }
  });
  app3.get("/api/payments/connect/dashboard-link", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const [profile] = await db.select().from(userProfiles).where(eq11(userProfiles.userId, userId));
      if (!profile?.stripeAccountId) {
        return res.status(400).json({ error: "No Stripe account connected" });
      }
      const loginLink = await stripe.accounts.createLoginLink(profile.stripeAccountId);
      res.json({ url: loginLink.url });
    } catch (error) {
      console.error("Error creating dashboard link:", error);
      res.status(500).json({ message: "Failed to create dashboard link" });
    }
  });
  app3.post("/api/payments/paynow/initiate", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const { amount, phone, email, reason } = req.body;
      if (!amount || !phone || !email) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const result = await initiateMobilePayment(userId, amount, phone, email, reason || "Refer Property Subscription");
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json({ message: result.error });
      }
    } catch (error) {
      console.error("Paynow initiation route error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app3.post("/api/payments/paynow/update", async (req, res) => {
    try {
      const { pollurl, status } = req.body;
      if (pollurl && status) {
        await updatePaynowTransaction(pollurl, status);
      }
      res.sendStatus(200);
    } catch (error) {
      console.error("Paynow update webhook error:", error);
      res.sendStatus(500);
    }
  });
  app3.get("/api/payments/paynow/check/:transactionId", requireAuth, async (req, res) => {
    try {
      const { transactionId } = req.params;
      const [transaction] = await db.select().from(paymentTransactions).where(eq11(paymentTransactions.id, transactionId));
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      const pollUrl = transaction.metadata?.paynowPollUrl;
      if (!pollUrl) {
        return res.status(400).json({ message: "No poll URL found for this transaction" });
      }
      const statusResult = await checkPaymentStatus(pollUrl);
      if (statusResult.status !== transaction.status) {
        await updatePaynowTransaction(pollUrl, statusResult.status);
      }
      res.json(statusResult);
    } catch (error) {
      console.error("Paynow status check route error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app3.post("/api/auth/set-role", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const { role } = req.body;
      if (!["customer", "agent", "referrer", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      await storage.updateUserRole(userId, role);
      const updatedUser = await storage.updateUser(userId, { onboardingStatus: "role_selection" });
      const [profile] = await db.select().from(userProfiles).where(eq11(userProfiles.userId, userId));
      await setUserClaims(req.user.uid, {
        userId,
        role,
        country: profile?.country || "JP"
        // Fallback
      });
      res.json({ success: true, user: updatedUser });
    } catch (error) {
      console.error("Error setting role:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  const checkInternalAuth = (req, res, next) => {
    const key = req.headers["x-internal-api-key"];
    if (key !== process.env.INTERNAL_API_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };
  app3.post("/internal/api/update-subscription", checkInternalAuth, async (req, res) => {
    const { userId, status, stripeSubscriptionId } = req.body;
    try {
      await storage.updateUser(userId, {
        subscriptionStatus: status,
        stripeSubscriptionId
      });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "DB Error" });
    }
  });
  app3.post("/internal/api/soft-lock-agent", checkInternalAuth, async (req, res) => {
    const { agentId } = req.body;
    try {
      await storage.updateUser(agentId, { subscriptionStatus: "payment_grace" });
      await storage.createNotification({
        userId: agentId,
        title: "Payment Overdue",
        message: "Your subscription payment failed. Please update your details to keep receiving new leads.",
        type: "billing"
      });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Action failed" });
    }
  });
  app3.post("/internal/api/redistribute-leads", checkInternalAuth, async (req, res) => {
    const { agentId } = req.body;
    try {
      const activeLeads = await db.select().from(leads).where(
        and9(eq11(leads.agentId, agentId), eq11(leads.status, "pending"))
      );
      for (const lead of activeLeads) {
        await storage.updateLead(lead.id, { agentId: null, status: "pending" });
      }
      res.json({ success: true, count: activeLeads.length });
    } catch (e) {
      res.status(500).json({ error: "Redistribution failed" });
    }
  });
  app3.put("/api/auth/contact-details", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const {
        firstName,
        middleName,
        lastName,
        email,
        phone,
        phoneCountryCode,
        preferredContactMethod,
        lineId,
        whatsappNumber
      } = req.body;
      const updatedUser = await storage.updateUser(userId, {
        firstName,
        middleName,
        lastName,
        email,
        phone,
        phoneCountryCode,
        preferredContactMethod,
        lineId,
        whatsappNumber,
        onboardingStatus: "contact_details"
      });
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating contact details:", error);
      res.status(500).json({ message: "Failed to update contact details" });
    }
  });
  app3.post("/api/auth/complete-onboarding", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const updatedUser = await storage.updateUser(userId, {
        onboardingStatus: "completed",
        onboardingCompletedAt: /* @__PURE__ */ new Date()
      });
      res.json(updatedUser);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      res.status(500).json({ message: "Failed to complete onboarding" });
    }
  });
  app3.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      let profileData = null;
      if (user.role === "agent") {
        profileData = await storage.getAgentProfile(userId);
      } else if (user.role === "referrer") {
        profileData = await storage.getReferrerProfile(userId);
      }
      res.json({ ...user, profile: profileData });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app3.get("/api/auth/user", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      let profileData = null;
      if (user.role === "agent") {
        profileData = await storage.getAgentProfile(userId);
      } else if (user.role === "referrer") {
        profileData = await storage.getReferrerProfile(userId);
      }
      res.json({ ...user, profile: profileData });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app3.post("/api/customer/request/anonymous", async (req, res) => {
    try {
      const { phoneNumber, referralCode, source, propertyType, city, budgetMin, budgetMax, currency, country } = req.body;
      if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
      }
      const request = await storage.createCustomerRequest({
        phoneNumber,
        source: source || "anonymous",
        propertyType: propertyType || "other",
        preferredCity: city,
        budgetMin: budgetMin || 0,
        budgetMax: budgetMax || 0,
        currency: currency || "USD",
        country: country || "ZW",
        status: "pending"
      });
      if (referralCode) {
        const link = await db.query.referralLinks.findFirst({
          where: eq11(referralLinks.shortCode, referralCode)
        });
        if (link) {
          await db.update(referralLinks).set({ totalSubmissions: sql10`total_submissions + 1` }).where(eq11(referralLinks.id, link.id));
          firestore.collection("referralAnalytics").doc(referralCode).set(
            { totalSubmissions: admin2.firestore.FieldValue.increment(1) },
            { merge: true }
          ).catch(console.error);
        }
      }
      await triggerLeadMatching(request.id).catch((err) => {
        console.error("AI matching trigger failed for anonymous lead:", err);
      });
      res.status(201).json({
        success: true,
        requestId: request.id,
        message: "Expert match initiated. Expect a message on WhatsApp shortly."
      });
    } catch (error) {
      console.error("Anonymous request error:", error);
      res.status(500).json({ message: "Failed to process request" });
    }
  });
  app3.post("/api/customer/request", requireAuth, validate(insertCustomerRequestSchema), async (req, res) => {
    try {
      const userId = req.user.id;
      const request = await storage.createCustomerRequest({
        ...req.body,
        customerId: userId
      });
      await triggerLeadMatching(request.id);
      res.json({
        success: true,
        request,
        message: "Matching process initiated. You will receive notifications as agents are matched."
      });
    } catch (error) {
      console.error("Error creating customer request:", error);
      res.status(500).json({ message: "Failed to create request" });
    }
  });
  app3.get("/api/customer/requests", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const requests = await storage.getCustomerRequestsByUser(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });
  app3.get("/api/customer/leads", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const leads2 = await storage.getLeadsByCustomer(userId);
      res.json(leads2);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });
  app3.post("/api/customer/submit-feedback", requireAuth, async (req, res) => {
    try {
      const { leadId, rating, feedback } = req.body;
      const [lead] = await db.select().from(leads).where(eq11(leads.id, leadId));
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      const [profile] = await db.select().from(agentProfiles).where(eq11(agentProfiles.userId, lead.agentId));
      if (profile) {
        const totalReviews = (profile.totalReviews || 0) + 1;
        const currentRating = parseFloat(profile.rating || "0");
        const newRating = (currentRating * (totalReviews - 1) + rating) / totalReviews;
        await db.update(agentProfiles).set({
          rating: newRating.toFixed(1).toString(),
          totalReviews,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq11(agentProfiles.userId, lead.agentId));
        triggerAgentScoringUpdate(lead.agentId);
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app3.post("/api/agent/profile", requireAuth, validate(insertAgentProfileSchema), async (req, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.createAgentProfile({
        ...req.body,
        userId
      });
      await storage.updateUser(userId, { onboardingStatus: "role_specific" });
      res.json(profile);
    } catch (error) {
      console.error("Error creating agent profile:", error);
      res.status(500).json({ message: "Failed to create agent profile" });
    }
  });
  app3.get("/api/agent/leads", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const leads2 = await storage.getLeadsByAgent(userId);
      res.json(leads2);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });
  app3.patch("/api/agent/lead/:leadId", requireAuth, requireFeature("accept_leads"), async (req, res) => {
    try {
      const { leadId } = req.params;
      const updates = req.body;
      const statusUpdates = { ...updates };
      if (updates.status === "contacted") {
        statusUpdates.acceptedAt = /* @__PURE__ */ new Date();
      } else if (updates.status === "closed") {
        statusUpdates.closedAt = /* @__PURE__ */ new Date();
      }
      const lead = await storage.updateLead(leadId, statusUpdates);
      if (updates.status === "contacted" || updates.status === "closed") {
        triggerAgentScoringUpdate(lead.agentId);
      }
      if (updates.status === "closed") {
        triggerReviewRequest(lead.id, lead.customerId, lead.agentId).catch(console.error);
        triggerCommissionPayout(lead.id).catch(console.error);
      }
      if (updates.status === "contacted") {
      }
      if (updates.status === "contacted") {
        const conversation = await storage.createConversation({
          leadId,
          customerId: lead.customerId,
          agentId: lead.agentId
        });
        await storage.createNotification({
          userId: lead.customerId,
          title: "Agent Interested",
          message: "An agent has accepted your request and wants to chat!",
          type: "message",
          metadata: { conversationId: conversation.id }
        });
      }
      res.json(lead);
    } catch (error) {
      console.error("Error updating lead:", error);
      res.status(500).json({ message: "Failed to update lead" });
    }
  });
  app3.post("/api/agent/verify-document", requireAuth, upload.single("document"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No document uploaded" });
      }
      const userId = req.user.id;
      const fileBuffer = await fs.promises.readFile(req.file.path);
      const result = await verifyIdentityDocument(userId, fileBuffer, req.file.mimetype);
      if (result.isAuthentic && result.confidence > 0.8) {
        await storage.updateUser(userId, {
          isVerified: true,
          onboardingStatus: "completed"
        });
        await storage.logWorkflow({
          workflowId: "agent_verification_success",
          status: "verified",
          payload: {
            userId,
            docType: result.extractedData.documentType,
            confidence: result.confidence
          },
          timestamp: /* @__PURE__ */ new Date()
        });
      }
      await fs.promises.unlink(req.file.path);
      res.json(result);
    } catch (error) {
      console.error("Verification endpoint error:", error);
      res.status(500).json({ message: "Identity verification failed" });
    }
  });
  app3.post("/api/agent/property", requireAuth, requireFeature("manage_listings"), async (req, res) => {
    try {
      const userId = req.user.id;
      const propertyData = insertPropertySchema.parse({
        ...req.body,
        agentId: userId
      });
      const property = await storage.createProperty(propertyData);
      res.json(property);
    } catch (error) {
      console.error("Error creating property:", error);
      res.status(500).json({ message: "Failed to create property" });
    }
  });
  app3.post("/api/properties/:id/photos", requireAuth, upload.array("photos", 5), async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No photos uploaded" });
      }
      const uploadResults = [];
      const analysisResults = [];
      for (const file of files) {
        const fileBuffer = await fs.promises.readFile(file.path);
        const analysis = await analyzePropertyPhoto(fileBuffer);
        analysisResults.push(analysis);
        if (analysis.shouldReject) {
          await fs.promises.unlink(file.path);
          return res.status(400).json({
            message: `Photo rejected: ${analysis.rejectionReason}`,
            advice: analysis.agentAdvice
          });
        }
        const result = await uploadPropertyPhoto(fileBuffer, id, userId);
        uploadResults.push(result.url);
        await fs.promises.unlink(file.path);
      }
      const property = await storage.getProperty(id);
      if (property) {
        const currentUrls = property.imageUrls ? JSON.parse(property.imageUrls) : [];
        await storage.updateProperty(id, {
          imageUrls: JSON.stringify([...currentUrls, ...uploadResults])
        });
      }
      await triggerPhotoAnalysis(id, uploadResults);
      res.json({ urls: uploadResults, analysis: analysisResults });
    } catch (error) {
      console.error("Property photo upload error:", error);
      res.status(500).json({ message: "Failed to upload property photos" });
    }
  });
  app3.get("/api/agent/properties", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const properties2 = await storage.getPropertiesByAgent(userId);
      res.json(properties2);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });
  app3.post("/api/referrers/profile", requireAuth, validate(insertReferrerProfileSchema), async (req, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.createReferrerProfile({
        ...req.body,
        userId
      });
      await storage.updateUser(userId, { onboardingStatus: "role_specific" });
      res.json(profile);
    } catch (error) {
      console.error("Error creating referrer profile:", error);
      res.status(500).json({ message: "Failed to create referrer profile" });
    }
  });
  app3.post("/api/referrer/link", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const { requestType, targetArea, apartmentType, notes } = req.body;
      const aiContent = await generateReferralContent({
        requestType,
        targetArea,
        apartmentType,
        notes
      });
      const linkData = insertReferralLinkSchema.parse({
        referrerId: userId,
        shortCode: aiContent.shortCode,
        requestType,
        targetArea,
        apartmentType,
        notes
      });
      const link = await storage.createReferralLink(linkData);
      res.json({ ...link, ...aiContent });
    } catch (error) {
      console.error("Error creating referral link:", error);
      res.status(500).json({ message: "Failed to create referral link" });
    }
  });
  app3.get("/api/referrer/links", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const links = await storage.getReferralLinksByReferrer(userId);
      res.json(links);
    } catch (error) {
      console.error("Error fetching referral links:", error);
      res.status(500).json({ message: "Failed to fetch referral links" });
    }
  });
  app3.get("/api/conversations", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const conversations3 = await storage.getConversationsByUser(userId);
      res.json(conversations3);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });
  app3.get("/api/conversation/:id/messages", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const messages2 = await storage.getMessagesByConversation(id);
      res.json(messages2);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });
  app3.post("/api/conversation/:id/message", requireAuth, requireFeature("send_messages"), async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { content, messageType } = req.body;
      const moderation = await moderateMessage(content);
      if (moderation.action === "block") {
        return res.status(400).json({
          error: "Message blocked by content policy",
          reason: moderation.reason
        });
      }
      if (moderation.action === "flag") {
        await db.insert(flaggedContent).values({
          contentType: "message",
          contentId: id,
          // Associated conversation
          flaggedBy: "ai_moderation",
          reason: moderation.reason,
          confidence: moderation.confidence.toString()
        });
      }
      const messageData = insertMessageSchema.parse({
        conversationId: id,
        senderId: userId,
        content,
        messageType: messageType || "text"
      });
      const message = await storage.createMessage(messageData);
      await db.update(conversations).set({ lastMessageAt: /* @__PURE__ */ new Date() }).where(eq11(conversations.id, id));
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.conversationId === id) {
          client.send(JSON.stringify({
            type: "new_message",
            data: message
          }));
        }
      });
      trackEvent(userId, "message_sent", { conversationId: id, messageType });
      res.json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  app3.post("/api/ai/response-suggestion", requireAuth, async (req, res) => {
    try {
      const { type, context } = req.body;
      const suggestion = await generateResponseSuggestion({ type, ...context });
      res.json(suggestion);
    } catch (error) {
      console.error("Error generating AI suggestion:", error);
      res.status(500).json({ message: "Failed to generate suggestion" });
    }
  });
  app3.get("/api/ai/market-insights", async (req, res) => {
    try {
      const { area, propertyType } = req.query;
      const insights = await generateMarketInsights(area, propertyType);
      res.json(insights);
    } catch (error) {
      console.error("Error generating market insights:", error);
      res.status(500).json({ message: "Failed to generate insights" });
    }
  });
  app3.post("/api/upload/license", requireAuth, upload.single("license"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });
  app3.get("/api/notifications", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const notifications2 = await storage.getNotificationsByUser(userId);
      res.json(notifications2);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });
  app3.patch("/api/notifications/:id/read", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const notification = await storage.markNotificationAsRead(id);
      res.json(notification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });
  app3.get("/api/r/:shortCode", async (req, res) => {
    try {
      const { shortCode } = req.params;
      const link = await storage.getReferralLinkByShortCode(shortCode);
      if (!link) {
        return res.status(404).json({ message: "Referral link not found" });
      }
      await storage.updateReferralLink(link.id, {
        clickCount: (link.clickCount || 0) + 1
      });
      res.json(link);
    } catch (error) {
      console.error("Error tracking referral:", error);
      res.status(500).json({ message: "Failed to track referral" });
    }
  });
  app3.post("/api/agent/verify-license", requireAuth, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No license document uploaded" });
      }
      const userId = req.user.uid;
      const country = req.body.country || "ZW";
      const fileBuffer = await fs.promises.readFile(req.file.path);
      const storagePath = `verification/${userId}/${Date.now()}_${req.file.originalname}`;
      const publicUrl = await uploadToFirebase(fileBuffer, storagePath, req.file.mimetype);
      await fs.promises.unlink(req.file.path);
      const analysisResult = await analyzeDocument(publicUrl, country);
      await dbStorage.updateAgentProfile(userId, {
        isVerified: analysisResult.isVerified,
        licenseNumber: analysisResult.licenseNumber,
        updatedAt: /* @__PURE__ */ new Date()
      });
      await dbStorage.logWorkflow({
        workflowId: "agent_verification",
        status: analysisResult.isVerified ? "verified" : "rejected",
        payload: {
          userId,
          country,
          licenseNumber: analysisResult.licenseNumber,
          confidence: analysisResult.confidence
        },
        timestamp: /* @__PURE__ */ new Date()
      });
      await triggerAgentVerification(userId, publicUrl, country);
      res.json({
        matched: analysisResult.isVerified,
        licenseNumber: analysisResult.licenseNumber,
        reason: analysisResult.reason
      });
    } catch (error) {
      console.error("Verification endpoint error:", error);
      res.status(500).json({ message: error.message || "License verification failed" });
    }
  });
  app3.post(
    "/api/properties",
    requireAuth,
    requireRole("agent"),
    requireFeature("manage_listings"),
    validate(propertyListingSchema),
    async (req, res) => {
      const property = await db.insert(properties).values({ ...req.body, agentId: req.user.userId }).returning();
      const docRef = await firestore.collection("propertyListings").add({
        ...req.body,
        agentId: req.user.userId,
        createdAt: /* @__PURE__ */ new Date()
      });
      await db.update(properties).set({ firestoreId: docRef.id }).where(eq11(properties.id, property[0].id));
      if (req.body.photoUrls?.length) {
        fetch(process.env.N8N_WEBHOOK_PHOTO_ANALYSIS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId: property[0].id, photoUrls: req.body.photoUrls })
        }).catch(console.error);
      }
      res.status(201).json({ success: true, data: property[0] });
    }
  );
  app3.get("/api/properties/mine", requireAuth, requireRole("agent"), async (req, res) => {
    const { status = "active", page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      db.query.properties.findMany({
        where: and9(
          eq11(properties.agentId, req.user.userId),
          status !== "all" ? eq11(properties.status, status) : void 0
        ),
        orderBy: [desc5(properties.createdAt)],
        limit: Number(limit),
        offset
      }),
      db.select({ count: sql10`count(*)` }).from(properties).where(eq11(properties.agentId, req.user.userId))
    ]);
    res.json({ data, total: total[0].count, page: Number(page), limit: Number(limit) });
  });
  app3.get("/api/notifications", requireAuth, async (req, res) => {
    const { page = 1, unreadOnly = false } = req.query;
    const offset = (Number(page) - 1) * 20;
    const where = and9(
      eq11(notifications.userId, req.user.userId),
      unreadOnly === "true" ? eq11(notifications.isRead, false) : void 0
    );
    const [data, unreadCount] = await Promise.all([
      db.query.notifications.findMany({
        where,
        orderBy: [desc5(notifications.createdAt)],
        limit: 20,
        offset
      }),
      db.select({ count: sql10`count(*)` }).from(notifications).where(and9(
        eq11(notifications.userId, req.user.userId),
        eq11(notifications.isRead, false)
      ))
    ]);
    res.json({ data, unreadCount: unreadCount[0].count });
  });
  app3.post("/api/notifications/mark-read", requireAuth, async (req, res) => {
    const { ids, markAll = false } = req.body;
    if (markAll) {
      await db.update(notifications).set({ isRead: true, readAt: /* @__PURE__ */ new Date() }).where(eq11(notifications.userId, req.user.userId));
    } else {
      await db.update(notifications).set({ isRead: true, readAt: /* @__PURE__ */ new Date() }).where(and9(
        eq11(notifications.userId, req.user.userId),
        inArray2(notifications.id, ids)
      ));
    }
    res.json({ success: true });
  });
  app3.post(
    "/api/referral-links",
    requireAuth,
    requireRole("referrer"),
    validate(createReferralLinkSchema),
    async (req, res) => {
      const { targetCountry, customSlug } = req.body;
      if (customSlug) {
        const existing = await db.query.referralLinks.findFirst({
          where: eq11(referralLinks.customSlug, customSlug)
        });
        if (existing) {
          return res.status(409).json({ error: "That slug is already taken" });
        }
      }
      let shortCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      let exists = true;
      let attempts = 0;
      while (exists && attempts < 5) {
        const check = await db.query.referralLinks.findFirst({
          where: eq11(referralLinks.shortCode, shortCode)
        });
        if (!check) {
          exists = false;
        } else {
          shortCode = Math.random().toString(36).substring(2, 8).toUpperCase();
          attempts++;
        }
      }
      const [link] = await db.insert(referralLinks).values({
        referrerId: req.user.userId,
        shortCode,
        customSlug,
        targetCountry,
        isActive: true
      }).returning();
      fetch(process.env.N8N_WEBHOOK_REFERRAL_CREATED, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referralLinkId: link.id,
          referrerId: req.user.userId,
          shortCode,
          customSlug,
          targetCountry
        })
      }).catch(console.error);
      res.status(201).json({ success: true, data: link });
    }
  );
  app3.get("/r/:shortCode", async (req, res) => {
    const { shortCode } = req.params;
    const link = await db.query.referralLinks.findFirst({
      where: and9(
        eq11(referralLinks.shortCode, shortCode),
        eq11(referralLinks.isActive, true)
      )
    });
    if (!link) return res.redirect("/not-found");
    db.update(referralLinks).set({ totalClicks: sql10`total_clicks + 1` }).where(eq11(referralLinks.id, link.id)).catch(console.error);
    firestore.collection("referralAnalytics").doc(shortCode).set(
      { totalClicks: admin2.firestore.FieldValue.increment(1), referrerId: link.referrerId.toString() },
      { merge: true }
    ).catch(console.error);
    res.redirect(`${process.env.APP_BASE_URL}/register?ref=${shortCode}&country=${link.targetCountry}`);
  });
  app3.post("/api/leads/:id/accept", requireAuth, requireRole("agent"), requireFeature("accept_leads"), async (req, res) => {
    const leadId = req.params.id;
    const lead = await db.query.customerRequests.findFirst({
      where: and9(
        eq11(customerRequests.id, leadId),
        eq11(customerRequests.status, "pending")
      )
    });
    if (!lead) return res.status(404).json({ error: "Lead not found or already accepted" });
    const conversationId = await createConversation(
      leadId,
      req.user.userId,
      lead.customerId,
      lead.country
    );
    await db.update(customerRequests).set({
      assignedAgentId: req.user.userId,
      status: "agent_assigned",
      conversationId,
      assignedAt: /* @__PURE__ */ new Date()
    }).where(eq11(customerRequests.id, leadId));
    await db.update(agentScores).set({
      totalLeadsAccepted: sql10`total_leads_accepted + 1`
    }).where(eq11(agentScores.agentId, req.user.userId));
    fetch(process.env.N8N_WEBHOOK_LEAD_ACCEPTED, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, agentId: req.user.userId })
    }).catch(console.error);
    res.json({ success: true, conversationId });
  });
  app3.post("/api/reviews", requireAuth, requireRole("customer"), async (req, res) => {
    const { agentId, customerRequestId, rating, comment } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be 1-5" });
    }
    const [review] = await db.insert(reviews).values({
      agentId,
      customerId: req.user.userId,
      customerRequestId,
      rating,
      comment
    }).returning();
    const avgResult = await db.execute(sql10`
      SELECT AVG(rating)::numeric(3,2) as avg_rating
      FROM reviews WHERE agent_id = ${agentId}
    `);
    await db.update(agentScores).set({ customerRatingAvg: avgResult.rows[0].avg_rating }).where(eq11(agentScores.agentId, agentId));
    res.status(201).json({ success: true, data: review });
  });
  app3.get("/api/reviews/agent/:agentId", async (req, res) => {
    const { agentId } = req.params;
    try {
      const agentReviews = await db.select().from(reviews).where(eq11(reviews.agentId, agentId)).orderBy(desc5(reviews.createdAt));
      res.json(agentReviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });
  app3.patch("/api/properties/:id", requireAuth, requireRole("agent"), requireFeature("manage_listings"), validate(propertyListingSchema.partial()), async (req, res) => {
    const { id } = req.params;
    try {
      const existing = await storage.getProperty(id);
      if (!existing || existing.agentId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to update this property" });
      }
      const updated = await storage.updateProperty(id, req.body);
      if (updated.firestoreId) {
        await firestore.collection("propertyListings").doc(updated.firestoreId).update({
          ...req.body,
          updatedAt: /* @__PURE__ */ new Date()
        });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update property" });
    }
  });
  app3.delete("/api/properties/:id", requireAuth, requireRole("agent"), requireFeature("manage_listings"), async (req, res) => {
    const { id } = req.params;
    try {
      const existing = await storage.getProperty(id);
      if (!existing || existing.agentId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to delete this property" });
      }
      await storage.updateProperty(id, { isAvailable: false });
      if (existing.firestoreId) {
        await firestore.collection("propertyListings").doc(existing.firestoreId).delete();
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete property" });
    }
  });
  app3.get("/api/analytics/agent-dashboard", requireAuth, requireRole("agent"), async (req, res) => {
    const agentId = req.user.userId;
    const [scores, recentLeads, recentPayments, balance] = await Promise.all([
      db.query.agentScores.findFirst({ where: eq11(agentScores.agentId, agentId) }),
      db.execute(sql10`
        SELECT status, COUNT(*) as count
        FROM customer_requests
        WHERE assigned_agent_id = ${agentId}
          AND created_at > NOW() - INTERVAL '30 days'
        GROUP BY status
      `),
      db.query.paymentTransactions.findMany({
        where: and9(
          eq11(paymentTransactions.userId, agentId),
          eq11(paymentTransactions.status, "completed")
        ),
        orderBy: [desc5(paymentTransactions.createdAt)],
        limit: 5
      }),
      db.query.balances.findFirst({ where: eq11(balances.userId, agentId) })
    ]);
    res.json({ scores, leadsByStatus: recentLeads.rows, recentPayments, balance });
  });
  app3.post("/api/leads/:id/ghostwrite", requireAuth, requireRole("agent"), async (req, res) => {
    try {
      const { id } = req.params;
      const request = await storage.getCustomerRequest(id);
      const user = await storage.getUser(req.user.id);
      const profile = await storage.getAgentProfile(req.user.id);
      if (!request || !user) return res.status(404).json({ error: "Not found" });
      const result = await ghostwriteFirstContact({
        agentName: `${user.firstName} ${user.lastName}`,
        agentSpecializations: profile?.specializations || [],
        customerName: request.phoneNumber || "there",
        propertyType: request.propertyType,
        city: request.preferredCity,
        budget: `${request.budgetMin}-${request.budgetMax}`,
        currency: request.currency,
        urgencyTag: "medium",
        // Default
        geminiReasoning: null,
        suggestedAlternatives: [],
        country: request.country,
        language: request.country === "JP" ? "ja" : "en"
      });
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate ghostwritten message" });
    }
  });
  app3.post("/api/properties/valuate", requireAuth, async (req, res) => {
    try {
      const { propertyType, city, country, bedrooms, budget, currency } = req.body;
      const result = await valuatePropertyRequest(propertyType, city, country, bedrooms, budget, currency);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Valuation failed" });
    }
  });
  app3.get("/api/privacy/my-data", requireAuth, async (req, res) => {
    const userId = req.user.id;
    const datasets = await Promise.all([
      db.select().from(users).where(eq11(users.id, userId)),
      db.select().from(userProfiles).where(eq11(userProfiles.userId, userId)),
      db.select().from(customerRequests).where(eq11(customerRequests.customerId, userId)),
      db.select().from(paymentTransactions).where(eq11(paymentTransactions.userId, userId))
    ]);
    res.json({ exportedAt: /* @__PURE__ */ new Date(), data: datasets });
  });
  app3.post("/api/privacy/delete-my-data", requireAuth, async (req, res) => {
    const userId = req.user.id;
    await db.update(users).set({
      firstName: "Deleted",
      lastName: "User",
      email: `deleted_${userId}@deleted.com`,
      phone: null
    }).where(eq11(users.id, userId));
    res.json({ success: true });
  });
  app3.get("/health/live", (req, res) => res.json({ status: "ok" }));
  app3.get("/health/ready", async (req, res) => {
    try {
      await db.execute(sql10`SELECT 1`);
      res.json({ status: "ready", database: "ok" });
    } catch (e) {
      res.status(503).json({ status: "error", database: "down" });
    }
  });
  app3.get("/api/market-pulse/:country/:city", requireAuth, async (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    const sendPulse = async () => {
      try {
        const pulse = await computeMarketPulse(
          req.params.country,
          req.params.city
        );
        res.write(`data: ${JSON.stringify(pulse)}

`);
      } catch (err) {
        console.error("Market pulse SSE error:", err);
      }
    };
    await sendPulse();
    const interval = setInterval(sendPulse, 6e4);
    req.on("close", () => clearInterval(interval));
  });
  app3.get("/api/leads/:id/prediction", requireAuth, requireRole("agent"), async (req, res) => {
    try {
      const prediction = await predictDealOutcome(req.params.id);
      res.json(prediction);
    } catch (err) {
      res.status(500).json({ error: "Prediction failed" });
    }
  });
  app3.get("/api/neighbourhood/:country/:city/:area", async (req, res) => {
    try {
      const profile = await generateNeighbourhoodProfile(
        req.params.area,
        req.params.city,
        req.params.country
      );
      res.json(profile);
    } catch (err) {
      res.status(500).json({ error: "Neighbourhood profile generation failed" });
    }
  });
  app3.get("/api/admin/metrics", requireAuth, requireRole("admin"), async (req, res) => {
    try {
      const [
        activeUsers,
        openConvs,
        pendingVerifications,
        disputesCount,
        leadsToday,
        dealsToday,
        revenueToday
      ] = await Promise.all([
        db.select({ count: sql10`count(*)` }).from(users).where(sql10`last_active_at > NOW() - INTERVAL '5 min'`),
        db.select({ count: sql10`count(*)` }).from(customerRequests).where(eq11(customerRequests.status, "in_progress")),
        db.select({ count: sql10`count(*)` }).from(schema.agentVerifications).where(eq11(schema.agentVerifications.verificationStatus, "pending")),
        db.select({ count: sql10`count(*)` }).from(schema.disputes).where(eq11(schema.disputes.status, "open")),
        db.select({ count: sql10`count(*)` }).from(customerRequests).where(sql10`created_at::date = CURRENT_DATE`),
        db.select({ count: sql10`count(*)` }).from(customerRequests).where(and9(eq11(customerRequests.status, "closed"), sql10`updated_at::date = CURRENT_DATE`)),
        db.select({ sum: sql10`sum(amount_usd)` }).from(paymentTransactions).where(sql10`created_at::date = CURRENT_DATE`)
      ]);
      res.json({
        activeUsersNow: Number(activeUsers[0].count),
        openConversations: Number(openConvs[0].count),
        pendingVerifications: Number(pendingVerifications[0].count),
        openDisputes: Number(disputesCount[0].count),
        newLeadsToday: Number(leadsToday[0].count),
        dealsClosedToday: Number(dealsToday[0].count),
        revenueToday: Number(revenueToday[0].sum || 0),
        health: {
          n8nStatus: "healthy",
          failedWorkflows: 0,
          unreadMessages: 156
        }
      });
    } catch (err) {
      console.error("Admin metrics error:", err);
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });
  app3.post("/api/agent/:id/recalculate-trust", requireAuth, requireRole("admin"), async (req, res) => {
    try {
      const score = await recalculateAgentTrustScore(req.params.id);
      res.json(score);
    } catch (err) {
      res.status(500).json({ error: "Trust score recalculation failed" });
    }
  });
  const httpServer = createServer(app3);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  wss.on("connection", (ws2, req) => {
    console.log("New WebSocket connection");
    ws2.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === "join_conversation") {
          ws2.conversationId = message.conversationId;
        }
        if (message.type === "typing") {
          wss.clients.forEach((client) => {
            if (client !== ws2 && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: "user_typing",
                conversationId: message.conversationId,
                userId: message.userId
              }));
            }
          });
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });
    ws2.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });
  return httpServer;
}

// server/vite.ts
import express3 from "express";
import fs2 from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  base: "/",
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid as nanoid2 } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app3, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app3.use(vite.middlewares);
  app3.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid2()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app3) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app3.use(express3.static(distPath));
  app3.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
if (process.env.SENTRY_DSN) {
  try {
    const Sentry2 = await import("@sentry/node");
    Sentry2.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1
    });
    log("Sentry initialised");
  } catch {
    log("@sentry/node not installed \u2013 skipping Sentry");
  }
}
(async () => {
  const server = await registerRoutes(app_default);
  app_default.use(errorHandler);
  if (app_default.get("env") === "development") {
    await setupVite(app_default, server);
  } else {
    serveStatic(app_default);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
