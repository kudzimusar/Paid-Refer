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
export const propertyTypeEnum = pgEnum('property_type', ['1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3K+']);
export const contactMethodEnum = pgEnum('contact_method', ['whatsapp', 'line', 'email', 'phone']);
export const messageTypeEnum = pgEnum('message_type', ['text', 'image', 'file', 'property_share']);
export const leadStatusEnum = pgEnum('lead_status', ['pending', 'viewed', 'contacted', 'in_progress', 'closed']);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default('customer'),
  phone: varchar("phone"),
  preferredContactMethod: contactMethodEnum("preferred_contact_method"),
  isVerified: boolean("is_verified").default(false),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer requests
export const customerRequests = pgTable("customer_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => users.id).notNull(),
  budgetMin: integer("budget_min"),
  budgetMax: integer("budget_max"),
  preferredAreas: text("preferred_areas").array(),
  propertyType: propertyTypeEnum("property_type"),
  moveInDate: varchar("move_in_date"), // Changed to varchar to handle string dates
  occupants: integer("occupants").default(1),
  mustHaveFeatures: text("must_have_features").array(),
  jobVisaType: varchar("job_visa_type"),
  additionalNotes: text("additional_notes"),
  status: requestStatusEnum("status").default('active'),
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
  shortCode: varchar("short_code").unique().notNull(),
  requestType: varchar("request_type"),
  targetArea: varchar("target_area"),
  apartmentType: varchar("apartment_type"),
  notes: text("notes"),
  clickCount: integer("click_count").default(0),
  submissionCount: integer("submission_count").default(0),
  conversionCount: integer("conversion_count").default(0),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
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
  customerRequests: many(customerRequests),
  sentMessages: many(messages),
  notifications: many(notifications),
  payments: many(payments),
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
