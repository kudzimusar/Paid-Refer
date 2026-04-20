import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

// AI-powered smart matching for customers to agents
export async function generateAgentMatching(customerRequest: any, agentProfiles: any[]): Promise<{
  matches: Array<{ agentId: string, score: number, reasoning: string }>
}> {
  try {
    const prompt = `
You are an AI real estate matching expert. Analyze the customer request and agent profiles to find the best matches.

Customer Request:
- Budget: ¥${customerRequest.budgetMin}-${customerRequest.budgetMax}
- Areas: ${customerRequest.preferredAreas?.join(', ') || 'Any'}
- Property Type: ${customerRequest.propertyType || 'Any'}
- Move-in Date: ${customerRequest.moveInDate || 'Flexible'}
- Features: ${customerRequest.mustHaveFeatures?.join(', ') || 'None specified'}
- Notes: ${customerRequest.additionalNotes || 'None'}

Agent Profiles:
${agentProfiles.map((agent, i) => `
Agent ${i + 1} (ID: ${agent.userId}):
- Areas: ${agent.areasCovered?.join(', ') || 'Not specified'}
- Property Types: ${agent.propertyTypes?.join(', ') || 'All types'}
- Languages: ${agent.languagesSpoken?.join(', ') || 'Not specified'}
- Specializations: ${agent.specializations?.join(', ') || 'General'}
- Rating: ${agent.rating || 0}/5 (${agent.totalReviews || 0} reviews)
`).join('\n')}

Score each agent from 0-100 based on how well they match the customer's needs. Consider area coverage, property type expertise, budget alignment, and specializations. Return the top 5 matches.

Respond with JSON in this format:
{
  "matches": [
    {
      "agentId": "agent_user_id",
      "score": 95,
      "reasoning": "Perfect area match in Shibuya, specializes in 1LDK properties, excellent rating"
    }
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{"matches": []}');
  } catch (error) {
    console.error("AI matching error:", error);
    return { matches: [] };
  }
}

// AI-driven lead qualification and scoring
export async function qualifyLead(customerRequest: any): Promise<{
  score: number,
  urgency: 'low' | 'medium' | 'high',
  summary: string,
  recommendations: string[]
}> {
  try {
    const prompt = `
Analyze this customer request and provide a lead qualification score and summary.

Customer Request:
- Budget: ¥${customerRequest.budgetMin}-${customerRequest.budgetMax}
- Areas: ${customerRequest.preferredAreas?.join(', ') || 'Any'}
- Property Type: ${customerRequest.propertyType || 'Any'}
- Move-in Date: ${customerRequest.moveInDate || 'Flexible'}
- Occupants: ${customerRequest.occupants || 1}
- Features: ${customerRequest.mustHaveFeatures?.join(', ') || 'None specified'}
- Job/Visa: ${customerRequest.jobVisaType || 'Not specified'}
- Notes: ${customerRequest.additionalNotes || 'None'}

Score the lead from 0-100 based on:
- Budget clarity and realism
- Timeline urgency  
- Specificity of requirements
- Likelihood to convert

Respond with JSON in this format:
{
  "score": 85,
  "urgency": "high",
  "summary": "Well-qualified lead with clear budget and immediate timeline",
  "recommendations": ["Prioritize this lead", "Focus on Shibuya properties", "Highlight pet-friendly options"]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{"score": 50, "urgency": "medium", "summary": "", "recommendations": []}');
  } catch (error) {
    console.error("AI lead qualification error:", error);
    return { score: 50, urgency: 'medium', summary: 'Unable to analyze', recommendations: [] };
  }
}

// AI-generated communication suggestions
export async function generateResponseSuggestion(context: {
  type: 'agent_first_contact' | 'customer_follow_up' | 'property_share',
  customerName?: string,
  customerRequest?: any,
  agentName?: string,
  property?: any
}): Promise<{ suggestion: string }> {
  try {
    let prompt = '';
    
    switch (context.type) {
      case 'agent_first_contact':
        prompt = `
Generate a professional first contact message from an agent to a customer.

Customer: ${context.customerName}
Agent: ${context.agentName}
Customer looking for: ${context.customerRequest?.propertyType} in ${context.customerRequest?.preferredAreas?.join(' or ')}
Budget: ¥${context.customerRequest?.budgetMin}-${context.customerRequest?.budgetMax}

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

      case 'property_share':
        prompt = `
Generate a message for an agent sharing a property with a customer.

Property: ${context.property?.title}
Price: ¥${context.property?.price}
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
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{"suggestion": ""}');
  } catch (error) {
    console.error("AI response suggestion error:", error);
    return { suggestion: "Thank you for your message. I'll get back to you soon!" };
  }
}

// AI-powered referral link generation
export async function generateReferralContent(referralData: {
  requestType: string,
  targetArea: string,
  apartmentType?: string,
  notes?: string
}): Promise<{
  shortCode: string,
  title: string,
  description: string
}> {
  try {
    const prompt = `
Generate a unique referral link and content for this real estate referral:

Request Type: ${referralData.requestType}
Target Area: ${referralData.targetArea}
Apartment Type: ${referralData.apartmentType || 'Any'}
Notes: ${referralData.notes || 'None'}

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
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Ensure we have a valid short code
    if (!result.shortCode) {
      result.shortCode = Math.random().toString(36).substr(2, 8);
    }

    return result;
  } catch (error) {
    console.error("AI referral generation error:", error);
    return {
      shortCode: Math.random().toString(36).substr(2, 8),
      title: `${referralData.targetArea} ${referralData.apartmentType || 'Apartment'} Search`,
      description: `Find great ${referralData.apartmentType || 'apartments'} in ${referralData.targetArea} with trusted agents.`
    };
  }
}

// AI market insights
export async function generateMarketInsights(area: string, propertyType?: string): Promise<{
  insights: string[],
  trends: string[],
  recommendations: string[]
}> {
  try {
    const prompt = `
Generate market insights for real estate in ${area}, Japan${propertyType ? ` for ${propertyType} properties` : ''}.

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
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
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
