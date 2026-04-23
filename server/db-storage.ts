import {
  type User,
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
  type CommissionSettlement,
  type InsertCommissionSettlement,
  type HouseOwnerProfile,
  type InsertHouseOwnerProfile,
  users,
  customerRequests,
  agentProfiles,
  referrerProfiles,
  referralLinks,
  leads,
  conversations,
  messages,
  commissionSettlements,
  properties,
  payments,
  notifications,
  workflowLogs,
  agentPreRegistrations,
  balances,
  houseOwnerProfiles,
} from "@shared/schema";
import { db } from "./db.ts";
import { eq, or, and, sql } from "drizzle-orm";
import { IStorage } from "./storage.ts";

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user;
  }

  async createUser(insertUser: any): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async upsertUser(userData: any): Promise<User> {
    const existing = await this.getUser(userData.id!);
    if (existing) {
        return this.updateUser(existing.id, userData);
    }
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set({ ...updates, updatedAt: new Date() }).where(eq(users.id, userId)).returning();
    return user;
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const [user] = await db.update(users).set({ role: role as any, updatedAt: new Date() }).where(eq(users.id, userId)).returning();
    return user;
  }

  async createCustomerRequest(request: InsertCustomerRequest): Promise<CustomerRequest> {
    const [created] = await db.insert(customerRequests).values(request).returning();
    return created;
  }

  async getCustomerRequest(id: string): Promise<CustomerRequest | undefined> {
    const [request] = await db.select().from(customerRequests).where(eq(customerRequests.id, id));
    return request;
  }

  async getCustomerRequestsByUser(userId: string): Promise<CustomerRequest[]> {
    return db.select().from(customerRequests).where(eq(customerRequests.customerId, userId));
  }

  async updateCustomerRequest(id: string, updates: Partial<CustomerRequest>): Promise<CustomerRequest> {
    const [updated] = await db.update(customerRequests).set({ ...updates, updatedAt: new Date() }).where(eq(customerRequests.id, id)).returning();
    return updated;
  }

  async createAgentProfile(profile: InsertAgentProfile): Promise<AgentProfile> {
    const [created] = await db.insert(agentProfiles).values(profile).returning();
    return created;
  }

  async getAgentProfile(userId: string): Promise<AgentProfile | undefined> {
    const [profile] = await db.select().from(agentProfiles).where(eq(agentProfiles.userId, userId));
    return profile;
  }

  async getAgentProfiles(filters?: { areas?: string[], propertyTypes?: string[] }): Promise<AgentProfile[]> {
    // Basic filter implementation
    return db.select().from(agentProfiles).where(eq(agentProfiles.isActive, true));
  }

  async updateAgentProfile(userId: string, updates: Partial<AgentProfile>): Promise<AgentProfile> {
    const [updated] = await db.update(agentProfiles).set({ ...updates, updatedAt: new Date() }).where(eq(agentProfiles.userId, userId)).returning();
    return updated;
  }

  async createAgentPreRegistration(data: any): Promise<any> {
    const [created] = await db.insert(agentPreRegistrations).values(data).returning();
    return created;
  }

  async getAgentPreRegistration(id: string): Promise<any> {
    const [reg] = await db.select().from(agentPreRegistrations).where(eq(agentPreRegistrations.id, id));
    return reg;
  }

  async updateAgentPreRegistration(id: string, updates: any): Promise<any> {
    const [updated] = await db.update(agentPreRegistrations).set(updates).where(eq(agentPreRegistrations.id, id)).returning();
    return updated;
  }

  async createReferrerProfile(profile: InsertReferrerProfile): Promise<ReferrerProfile> {
    const [created] = await db.insert(referrerProfiles).values(profile).returning();
    return created;
  }

  async getReferrerProfile(userId: string): Promise<ReferrerProfile | undefined> {
    const [profile] = await db.select().from(referrerProfiles).where(eq(referrerProfiles.userId, userId));
    return profile;
  }

  async updateReferrerProfile(userId: string, updates: Partial<ReferrerProfile>): Promise<ReferrerProfile> {
    const [updated] = await db.update(referrerProfiles).set({ ...updates, updatedAt: new Date() }).where(eq(referrerProfiles.userId, userId)).returning();
    return updated;
  }

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
    return db.select().from(referralLinks).where(eq(referralLinks.referrerId, referrerId));
  }

  async updateReferralLink(id: string, updates: Partial<ReferralLink>): Promise<ReferralLink> {
    const [updated] = await db.update(referralLinks).set({ ...updates, updatedAt: new Date() }).where(eq(referralLinks.id, id)).returning();
    return updated;
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const [created] = await db.insert(leads).values(lead).returning();
    return created;
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const [obj] = await db.select().from(leads).where(eq(leads.id, id));
    return obj;
  }

  async getLeadsByAgent(agentId: string): Promise<Lead[]> {
    return db.select().from(leads).where(eq(leads.agentId, agentId));
  }

  async getLeadsByCustomer(customerId: string): Promise<Lead[]> {
    return db.select().from(leads).where(eq(leads.customerId, customerId));
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const [updated] = await db.update(leads).set({ ...updates, updatedAt: new Date() }).where(eq(leads.id, id)).returning();
    return updated;
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const [created] = await db.insert(conversations).values(conversation).returning();
    return created;
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    const [obj] = await db.select().from(conversations).where(eq(conversations.id, id));
    return obj;
  }

  async getConversationsByUser(userId: string): Promise<Conversation[]> {
    return db.select().from(conversations).where(or(eq(conversations.customerId, userId), eq(conversations.agentId, userId)));
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation> {
    const [updated] = await db.update(conversations).set({ ...updates, updatedAt: new Date() }).where(eq(conversations.id, id)).returning();
    return updated;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [created] = await db.insert(messages).values(message).returning();
    return created;
  }

  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    return db.select().from(messages).where(eq(messages.conversationId, conversationId));
  }

  async markMessageAsRead(id: string): Promise<Message> {
    const [updated] = await db.update(messages).set({ isRead: true }).where(eq(messages.id, id)).returning();
    return updated;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [created] = await db.insert(properties).values(property).returning();
    return created;
  }

  async getProperty(id: string): Promise<Property | undefined> {
    const [obj] = await db.select().from(properties).where(eq(properties.id, id));
    return obj;
  }

  async getPropertiesByAgent(agentId: string): Promise<Property[]> {
    return db.select().from(properties).where(eq(properties.agentId, agentId));
  }

  async searchProperties(filters: any): Promise<Property[]> {
    return db.select().from(properties);
  }

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    const [updated] = await db.update(properties).set({ ...updates, updatedAt: new Date() }).where(eq(properties.id, id)).returning();
    return updated;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [created] = await db.insert(payments).values(payment).returning();
    return created;
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const [obj] = await db.select().from(payments).where(eq(payments.id, id));
    return obj;
  }

  async getPaymentsByUser(userId: string): Promise<Payment[]> {
    return db.select().from(payments).where(eq(payments.userId, userId));
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
    const [updated] = await db.update(payments).set(updates).where(eq(payments.id, id)).returning();
    return updated;
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [created] = await db.insert(notifications).values(notification).returning();
    return created;
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return db.select().from(notifications).where(eq(notifications.userId, userId));
  }

  async markNotificationAsRead(id: string): Promise<Notification> {
    const [updated] = await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id)).returning();
    return updated;
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
  }

  // Automation
  async logWorkflow(log: any): Promise<void> {
    await db.insert(workflowLogs).values(log);
  }

  async updateLeadIntelligence(intel: any): Promise<void> {
    const { leadId, ...rest } = intel;
    await db.update(leads).set({ aiSummary: JSON.stringify(rest), updatedAt: new Date() }).where(eq(leads.id, leadId));
  }

  async updateAgentScore(score: any): Promise<void> {
    await db.update(agentProfiles).set({ rating: score.rating.toString(), updatedAt: new Date() }).where(eq(agentProfiles.userId, score.agentId));
  }

  async createVerification(verification: any): Promise<void> {
    // Implementation for verification tracking
  }

  async logCommunication(log: any): Promise<void> {
    // Implementation for comms logging
  }

  // Tiered Referral Methods
  async getReferralChain(userId: string, depth: number = 3): Promise<User[]> {
    const chain: User[] = [];
    let currentUserId = userId;
    
    for (let i = 0; i < depth; i++) {
      const [user] = await db.select().from(users).where(eq(users.id, currentUserId));
      if (!user || !user.referredByUserId) break;
      
      const [referrer] = await db.select().from(users).where(eq(users.id, user.referredByUserId));
      if (!referrer) break;
      
      chain.push(referrer);
      currentUserId = referrer.id;
    }
    
    return chain;
  }

  async createCommissionSettlement(settlement: any): Promise<CommissionSettlement> {
    const [created] = await db.insert(commissionSettlements).values(settlement).returning();
    return created;
  }

  async getSettlementsByPayer(payerId: string): Promise<CommissionSettlement[]> {
    return db.select().from(commissionSettlements).where(eq(commissionSettlements.payerId, payerId));
  }

  async getSettlementsByPayee(payeeId: string): Promise<CommissionSettlement[]> {
    return db.select().from(commissionSettlements).where(eq(commissionSettlements.payeeId, payeeId));
  }

  async updateSettlementStatus(id: string, status: string, evidenceUrl?: string): Promise<CommissionSettlement> {
    const updates: any = { status, updatedAt: new Date() };
    if (evidenceUrl) updates.evidenceUrl = evidenceUrl;
    if (status === 'paid') updates.paidAt = new Date();
    
    const [updated] = await db.update(commissionSettlements).set(updates).where(eq(commissionSettlements.id, id)).returning();
    return updated;
  }

  // House Owner
  async createHouseOwnerProfile(profile: InsertHouseOwnerProfile): Promise<HouseOwnerProfile> {
    const [created] = await db.insert(houseOwnerProfiles).values(profile).returning();
    return created;
  }

  async getHouseOwnerProfile(userId: string): Promise<HouseOwnerProfile | undefined> {
    const [profile] = await db.select().from(houseOwnerProfiles).where(eq(houseOwnerProfiles.userId, userId));
    return profile;
  }

  async updateHouseOwnerProfile(userId: string, updates: Partial<HouseOwnerProfile>): Promise<HouseOwnerProfile> {
    const [updated] = await db.update(houseOwnerProfiles).set({ ...updates, updatedAt: new Date() }).where(eq(houseOwnerProfiles.userId, userId)).returning();
    return updated;
  }

  async getPropertiesByHouseOwner(ownerId: string): Promise<Property[]> {
    return db.select().from(properties).where(eq(properties.houseOwnerId, ownerId));
  }
}

export const dbStorage = new DatabaseStorage();
