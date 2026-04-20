// lib/document-generator.ts
// Note: Requires 'puppeteer' package: npm install puppeteer
import { uploadToFirebase } from "./firebase-storage";

const TEMPLATES: Record<string, string> = {
  ZW_TENANCY: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { text-align: center; border-bottom: 2px solid #000; }
        .party { margin: 20px 0; padding: 15px; border: 1px solid #ccc; }
        .clause { margin: 15px 0; }
        .signature-block { margin-top: 60px; display: flex; justify-content: space-between; }
        .signature-line { border-top: 1px solid #000; width: 200px; padding-top: 5px; }
      </style>
    </head>
    <body>
      <h1>RESIDENTIAL TENANCY AGREEMENT</h1>
      <p style="text-align:center">Made pursuant to the Rent Regulations Act [Chapter 10:17] of Zimbabwe</p>
      
      <div class="party">
        <strong>LANDLORD:</strong> {{landlordName}}<br>
        ID Number: {{landlordId}}<br>
        Address: {{landlordAddress}}
      </div>
      
      <div class="party">
        <strong>TENANT:</strong> {{tenantName}}<br>
        ID/Passport: {{tenantId}}<br>
        Phone: {{tenantPhone}}
      </div>
      
      <div class="clause">
        <strong>1. PROPERTY:</strong> {{propertyAddress}}, {{city}}, Zimbabwe
      </div>
      <div class="clause">
        <strong>2. TERM:</strong> {{startDate}} to {{endDate}} ({{months}} months)
      </div>
      <div class="clause">
        <strong>3. RENT:</strong> USD {{rentAmount}} per month, payable on or before the {{rentDay}}st of each month.
      </div>
      <div class="clause">
        <strong>4. DEPOSIT:</strong> USD {{depositAmount}} refundable security deposit held by the Landlord.
      </div>
      <div class="clause">
        <strong>5. UTILITIES:</strong> {{utilitiesClause}}
      </div>
      <div class="clause">
        <strong>6. PETS:</strong> {{petsClause}}
      </div>
      
      <div class="signature-block">
        <div>
          <div class="signature-line">Landlord Signature</div>
          <p>Date: {{date}}</p>
        </div>
        <div>
          <div class="signature-line">Tenant Signature</div>
          <p>Date: {{date}}</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

export async function generateTenancyAgreement(
  data: Record<string, string>,
  country: "ZW" | "ZA" | "JP",
  agentId: string,
  requestId: string
): Promise<string> {
  const templateKey = `${country}_TENANCY`;
  let html = TEMPLATES[templateKey] || TEMPLATES.ZW_TENANCY;

  // Replace all placeholders
  for (const [key, value] of Object.entries(data)) {
    html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
  }

  // Dynamic import of puppeteer to avoid crash if not installed
  let puppeteer;
  try {
    puppeteer = await import("puppeteer");
  } catch (e) {
    throw new Error("Puppeteer is required for PDF generation. Please install it.");
  }

  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4", margin: { top: "20mm", bottom: "20mm" } });
  await browser.close();

  const storagePath = `documents/agreements/${agentId}/${requestId}_${Date.now()}.pdf`;
  const url = await uploadToFirebase(pdfBuffer, storagePath, "application/pdf");
  return url;
}
