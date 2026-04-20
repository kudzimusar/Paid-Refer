import { storage } from "./firebase-admin.ts";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";

interface UploadResult {
  url: string;
  storagePath: string;
  fileName: string;
}

// Upload agent verification document
export async function uploadAgentDocument(
  fileBuffer: Buffer,
  originalName: string,
  agentId: string, // Changed to string for UUID support
  country: string
): Promise<UploadResult> {
  const ext = path.extname(originalName);
  const fileName = `${uuidv4()}${ext}`;
  const storagePath = `agent-documents/${country}/${agentId}/${fileName}`;

  const bucket = storage.bucket();
  const file = bucket.file(storagePath);

  await file.save(fileBuffer, {
    metadata: {
      contentType: ext === ".pdf" ? "application/pdf" : "image/jpeg",
      metadata: {
        agentId: agentId.toString(),
        country,
        uploadedAt: new Date().toISOString(),
      },
    },
  });

  // Generate signed URL valid for 7 days (n8n needs to download it)
  const [signedUrl] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  return { url: signedUrl, storagePath, fileName };
}

// Upload property photo (auto-compress via Firebase Extension)
export async function uploadPropertyPhoto(
  fileBuffer: Buffer,
  propertyId: string,
  agentId: string
): Promise<UploadResult> {
  const fileName = `${uuidv4()}.jpg`;
  const storagePath = `property-photos/${agentId}/${propertyId}/${fileName}`;

  const bucket = storage.bucket();
  const file = bucket.file(storagePath);

  await file.save(fileBuffer, {
    metadata: {
      contentType: "image/jpeg",
      metadata: { propertyId: propertyId.toString() },
    },
  });

  // Public URL (photos are public)
  await file.makePublic();
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

  return { url: publicUrl, storagePath, fileName };
}

// Generate QR code and store it
export async function uploadQRCode(
  qrBuffer: Buffer,
  referrerId: string,
  shortCode: string
): Promise<string> {
  const storagePath = `qr-codes/${referrerId}/${shortCode}.png`;
  const bucket = storage.bucket();
  const file = bucket.file(storagePath);

  await file.save(qrBuffer, { metadata: { contentType: "image/png" } });
  await file.makePublic();

  return `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
}

// Upload PDF receipt
export async function uploadReceiptPDF(
  pdfBuffer: Buffer,
  referrerId: string,
  dealId: string
): Promise<string> {
  const storagePath = `receipts/${referrerId}/deal-${dealId}-${Date.now()}.pdf`;
  const bucket = storage.bucket();
  const file = bucket.file(storagePath);

  await file.save(pdfBuffer, { metadata: { contentType: "application/pdf" } });

  const [signedUrl] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
  });

  return signedUrl;
}

// Generic file upload helper
export async function uploadToFirebase(
  fileBuffer: Buffer,
  storagePath: string,
  mimeType: string
): Promise<string> {
  const bucket = storage.bucket();
  const file = bucket.file(storagePath);

  await file.save(fileBuffer, {
    metadata: {
      contentType: mimeType,
    },
  });

  // For verification docs, we usually want signed URLs or make them public if the workflow allows
  // Given the route expects a publicUrl for analyzeDocument (which might be an external service or cloud function)
  // we'll make it public for now or return a signed URL. 
  // Gemini analyzeDocument in gemini-document.ts takes a publicUrl string? 
  // Wait, gemini-document.ts:extractDocumentData takes a Buffer.
  // But routes.ts calls analyzeDocument(publicUrl, country).
  
  await file.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
}
