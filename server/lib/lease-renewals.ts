import { db } from "../db";
import * as schema from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import { sendWhatsApp } from "./brevo-whatsapp";

export async function checkLeaseRenewals() {
  // Find leases expiring in 60, 30, and 14 days
  const expiringLeases = await db.execute(sql`
    SELECT tr.*, 
           u_customer.first_name as customer_name,
           u_customer.phone as customer_phone,
           u_agent.first_name as agent_name,
           u_agent.phone as agent_phone,
           EXTRACT(DAY FROM lease_end_date - NOW()) as days_remaining
    FROM tenancy_records tr
    JOIN users u_customer ON u_customer.id = tr.customer_id
    JOIN users u_agent ON u_agent.id = tr.agent_id
    WHERE tr.lease_end_date > NOW()
      AND tr.lease_end_date < NOW() + INTERVAL '61 days'
      AND tr.renewed_at IS NULL
  `);

  for (const lease of expiringLeases.rows as any[]) {
    const days = Math.round(lease.days_remaining);

    if ([60, 30, 14].includes(days)) {
      // Notify customer with renewal options
      if (lease.customer_phone) {
        await sendWhatsApp({
          type: "interactive_buttons",
          to: lease.customer_phone,
          header: `🏠 Lease ending in ${days} days`,
          body: `Hi ${lease.customer_name}, your lease at your current property ends in ${days} days.\n\nWould you like to renew, or would you like us to find you a new property?`,
          buttons: [
            { id: `renew_lease_${lease.id}`, title: "Renew Lease" },
            { id: `find_new_${lease.id}`, title: "Find New Property" },
          ],
          footer: "Paid Refer Property Management"
        });
      }

      // Notify agent too
      if (lease.agent_phone) {
        await sendWhatsApp({
          type: "text",
          to: lease.agent_phone,
          body: `📋 Reminder: ${lease.customer_name}'s lease ends in ${days} days. Consider reaching out about renewal for property ${lease.property_id || 'N/A'}.`,
        });
      }

      // Update lease record to show reminder sent
      await db.update(schema.tenancyRecords)
        .set({ renewalReminderSentAt: new Date() })
        .where(eq(schema.tenancyRecords.id, lease.id));
    }
  }
}
