import {
  users,
  customerRequests,
  agentProfiles,
  referrerProfiles,
  referralLinks,
  leads,
  conversations,
  messages,
  properties,
  payments,
  notifications,
  type User,
  type UpsertUser,
  type CustomerRequest,
  type InsertCustomerRequest,
  type AgentProfile,
  type InsertAgentProfile,
  type ReferrerProfile,
  type InsertReferrerProfile,
  type ReferralLink,
  type InsertReferralLink,
  type Lead,
  type InsertLead,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type Property,
  type InsertProperty,
  type Payment,
  type InsertPayment,
  type Notification,
  type InsertNotification,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, count, sql, or, like, gte, lte, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Customer operations
  createCustomerRequest(request: InsertCustomerRequest): Promise<CustomerRequest>;
  getCustomerRequest(id: string): Promise<CustomerRequest | undefined>;
  getCustomerRequestsByUser(userId: string): Promise<CustomerRequest[]>;
  updateCustomerRequest(id: string, updates: Partial<CustomerRequest>): Promise<CustomerRequest>;
  
  // Agent operations
  createAgentProfile(profile: InsertAgentProfile): Promise<AgentProfile>;
  getAgentProfile(userId: string): Promise<AgentProfile | undefined>;
  getAgentProfiles(filters?: { areas?: string[], propertyTypes?: string[] }): Promise<AgentProfile[]>;
  updateAgentProfile(userId: string, updates: Partial<AgentProfile>): Promise<AgentProfile>;
  
  // Referrer operations
  createReferrerProfile(profile: InsertReferrerProfile): Promise<ReferrerProfile>;
  getReferrerProfile(userId: string): Promise<ReferrerProfile | undefined>;
  updateReferrerProfile(userId: string, updates: Partial<ReferrerProfile>): Promise<ReferrerProfile>;
  
  // Referral link operations
  createReferralLink(link: InsertReferralLink): Promise<ReferralLink>;
  getReferralLink(id: string): Promise<ReferralLink | undefined>;
  getReferralLinkByShortCode(shortCode: string): Promise<ReferralLink | undefined>;
  getReferralLinksByReferrer(referrerId: string): Promise<ReferralLink[]>;
  updateReferralLink(id: string, updates: Partial<ReferralLink>): Promise<ReferralLink>;
  
  // Lead operations
  createLead(lead: InsertLead): Promise<Lead>;
  getLead(id: string): Promise<Lead | undefined>;
  getLeadsByAgent(agentId: string): Promise<Lead[]>;
  getLeadsByCustomer(customerId: string): Promise<Lead[]>;
  updateLead(id: string, updates: Partial<Lead>): Promise<Lead>;
  
  // Conversation operations
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | undefined>;
  getConversationsByUser(userId: string): Promise<Conversation[]>;
  updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByConversation(conversationId: string): Promise<Message[]>;
  markMessageAsRead(id: string): Promise<Message>;
  
  // Property operations
  createProperty(property: InsertProperty): Promise<Property>;
  getProperty(id: string): Promise<Property | undefined>;
  getPropertiesByAgent(agentId: string): Promise<Property[]>;
  searchProperties(filters: { 
    areas?: string[], 
    propertyTypes?: string[], 
    minPrice?: number, 
    maxPrice?: number 
  }): Promise<Property[]>;
  updateProperty(id: string, updates: Partial<Property>): Promise<Property>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentsByUser(userId: string): Promise<Payment[]>;
  updatePayment(id: string, updates: Partial<Payment>): Promise<Payment>;
  
  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<Notification>;
  markAllNotificationsAsRead(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Customer operations
  async createCustomerRequest(request: InsertCustomerRequest): Promise<CustomerRequest> {
    const [created] = await db.insert(customerRequests).values(request).returning();
    return created;
  }

  async getCustomerRequest(id: string): Promise<CustomerRequest | undefined> {
    const [request] = await db.select().from(customerRequests).where(eq(customerRequests.id, id));
    return request;
  }

  async getCustomerRequestsByUser(userId: string): Promise<CustomerRequest[]> {
    return await db.select().from(customerRequests)
      .where(eq(customerRequests.customerId, userId))
      .orderBy(desc(customerRequests.createdAt));
  }

  async updateCustomerRequest(id: string, updates: Partial<CustomerRequest>): Promise<CustomerRequest> {
    const [updated] = await db.update(customerRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(customerRequests.id, id))
      .returning();
    return updated;
  }

  // Agent operations
  async createAgentProfile(profile: InsertAgentProfile): Promise<AgentProfile> {
    const [created] = await db.insert(agentProfiles).values(profile).returning();
    return created;
  }

  async getAgentProfile(userId: string): Promise<AgentProfile | undefined> {
    const [profile] = await db.select().from(agentProfiles).where(eq(agentProfiles.userId, userId));
    return profile;
  }

  async getAgentProfiles(filters?: { areas?: string[], propertyTypes?: string[] }): Promise<AgentProfile[]> {
    // Simplified for testing - just return all active agents
    return await db.select().from(agentProfiles)
      .where(eq(agentProfiles.isActive, true))
      .orderBy(desc(agentProfiles.rating));
  }

  async updateAgentProfile(userId: string, updates: Partial<AgentProfile>): Promise<AgentProfile> {
    const [updated] = await db.update(agentProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(agentProfiles.userId, userId))
      .returning();
    return updated;
  }

  // Referrer operations
  async createReferrerProfile(profile: InsertReferrerProfile): Promise<ReferrerProfile> {
    const [created] = await db.insert(referrerProfiles).values(profile).returning();
    return created;
  }

  async getReferrerProfile(userId: string): Promise<ReferrerProfile | undefined> {
    const [profile] = await db.select().from(referrerProfiles).where(eq(referrerProfiles.userId, userId));
    return profile;
  }

  async updateReferrerProfile(userId: string, updates: Partial<ReferrerProfile>): Promise<ReferrerProfile> {
    const [updated] = await db.update(referrerProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(referrerProfiles.userId, userId))
      .returning();
    return updated;
  }

  // Referral link operations
  async createReferralLink(link: InsertReferralLink): Promise<ReferralLink> {
    const [created] = await db.insert(referralLinks).values(link).returning();
    return created;
  }

  async getReferralLink(id: string): Promise<ReferralLink | undefined> {
    const [link] = await db.select().from(referralLinks).where(eq(referralLinks.id, id));
    return link;
  }

  async getReferralLinkByShortCode(shortCode: string): Promise<ReferralLink | undefined> {
    const [link] = await db.select().from(referralLinks).where(eq(referralLinks.shortCode, shortCode));
    return link;
  }

  async getReferralLinksByReferrer(referrerId: string): Promise<ReferralLink[]> {
    return await db.select().from(referralLinks)
      .where(eq(referralLinks.referrerId, referrerId))
      .orderBy(desc(referralLinks.createdAt));
  }

  async updateReferralLink(id: string, updates: Partial<ReferralLink>): Promise<ReferralLink> {
    const [updated] = await db.update(referralLinks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(referralLinks.id, id))
      .returning();
    return updated;
  }

  // Lead operations
  async createLead(lead: InsertLead): Promise<Lead> {
    const [created] = await db.insert(leads).values(lead).returning();
    return created;
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async getLeadsByAgent(agentId: string): Promise<Lead[]> {
    return await db.select().from(leads)
      .where(eq(leads.agentId, agentId))
      .orderBy(desc(leads.createdAt));
  }

  async getLeadsByCustomer(customerId: string): Promise<Lead[]> {
    return await db.select().from(leads)
      .where(eq(leads.customerId, customerId))
      .orderBy(desc(leads.createdAt));
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const [updated] = await db.update(leads)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return updated;
  }

  // Conversation operations
  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const [created] = await db.insert(conversations).values(conversation).returning();
    return created;
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  }

  async getConversationsByUser(userId: string): Promise<Conversation[]> {
    return await db.select().from(conversations)
      .where(or(eq(conversations.customerId, userId), eq(conversations.agentId, userId)))
      .orderBy(desc(conversations.lastMessageAt));
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation> {
    const [updated] = await db.update(conversations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(conversations.id, id))
      .returning();
    return updated;
  }

  // Message operations
  async createMessage(message: InsertMessage): Promise<Message> {
    const [created] = await db.insert(messages).values(message).returning();
    
    // Update conversation's last message timestamp
    await db.update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, message.conversationId));
    
    return created;
  }

  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    return await db.select().from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt));
  }

  async markMessageAsRead(id: string): Promise<Message> {
    const [updated] = await db.update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id))
      .returning();
    return updated;
  }

  // Property operations
  async createProperty(property: InsertProperty): Promise<Property> {
    const [created] = await db.insert(properties).values(property).returning();
    return created;
  }

  async getProperty(id: string): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async getPropertiesByAgent(agentId: string): Promise<Property[]> {
    return await db.select().from(properties)
      .where(and(eq(properties.agentId, agentId), eq(properties.isAvailable, true)))
      .orderBy(desc(properties.createdAt));
  }

  async searchProperties(filters: { 
    areas?: string[], 
    propertyTypes?: string[], 
    minPrice?: number, 
    maxPrice?: number 
  }): Promise<Property[]> {
    // Simplified for testing - just return all available properties
    return await db.select().from(properties)
      .where(eq(properties.isAvailable, true))
      .orderBy(asc(properties.price));
  }

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    const [updated] = await db.update(properties)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return updated;
  }

  // Payment operations
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [created] = await db.insert(payments).values(payment).returning();
    return created;
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  async getPaymentsByUser(userId: string): Promise<Payment[]> {
    return await db.select().from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt));
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
    const [updated] = await db.update(payments)
      .set(updates)
      .where(eq(payments.id, id))
      .returning();
    return updated;
  }

  // Notification operations
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [created] = await db.insert(notifications).values(notification).returning();
    return created;
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: string): Promise<Notification> {
    const [updated] = await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return updated;
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, userId));
  }
}

export const storage = new DatabaseStorage();
