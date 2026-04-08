import { storage } from "../storage.ts";

const N8N_API_KEY = process.env.N8N_API_KEY;
const N8N_BASE_URL = process.env.N8N_WEBHOOK_URL; // e.g. https://n8n.yourdomain.com/webhook/

async function triggerN8N(workflowPath: string, payload: any) {
  if (!N8N_BASE_URL || !N8N_API_KEY) {
    console.warn(`n8n trigger skipped: Missing configuration for ${workflowPath}`);
    return;
  }

  try {
    const response = await fetch(`${N8N_BASE_URL}/${workflowPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": N8N_API_KEY,
      },
      body: JSON.stringify(payload),
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
      timestamp: new Date(),
    });
  }
}

// 1. Triggered when agent uploads license
export async function triggerAgentVerification(agentId: string, documentUrl: string, country: string) {
  return triggerN8N("verify-agent", { agentId, documentUrl, country });
}

// 2. Triggered when property photo uploaded
export async function triggerPhotoAnalysis(propertyId: string, photos: string[]) {
  return triggerN8N("analyze-photos", { propertyId, photos });
}

// 3. Triggered when lead is created (Agent Matching)
export async function triggerLeadMatching(requestId: string) {
  return triggerN8N("match-agents", { requestId });
}

// 4. Triggered when deal status changes to 'closed'
export async function triggerCommissionPayout(dealId: string) {
  return triggerN8N("payout-commission", { dealId });
}
