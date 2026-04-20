import AfricasTalking from "africastalking";

const at = AfricasTalking({
  apiKey: process.env.AFRICAS_TALKING_API_KEY || "dummy_api_key",
  username: process.env.AFRICAS_TALKING_USERNAME || "sandbox",
});

const sms = at.SMS;

export async function sendSMS(to: string, message: string): Promise<any> {
  const options = {
    to: [to],
    message,
    from: process.env.AT_SENDER_ID || undefined, // Use Shortcode/Alphanumeric if available
  };

  try {
    const response = await sms.send(options);
    return response;
  } catch (err) {
    console.error("Africa's Talking SMS failed:", err);
    throw err;
  }
}

export async function sendMulticastSMS(recipients: string[], message: string): Promise<any> {
    const options = {
        to: recipients,
        message,
        from: process.env.AT_SENDER_ID || undefined,
    };
    
    try {
        const response = await sms.send(options);
        return response;
    } catch (err) {
        console.error("Africa's Talking Multicast SMS failed:", err);
        throw err;
    }
}
