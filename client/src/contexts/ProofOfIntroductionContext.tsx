import { createContext, useContext, useState, type ReactNode, useCallback } from "react";

export interface ReferralCode {
  id: string;
  shortCode: string;
  qrCode: string;
  referrerId: string;
  propertyType?: string;
  location?: string;
  createdAt: Date;
  expiresAt: Date;
  status: "active" | "used" | "expired";
  validatedBy?: string;
  validatedAt?: Date;
}

interface ProofOfIntroductionContextType {
  codes: Map<string, ReferralCode>;
  generateCode: (
    referrerId: string,
    propertyType?: string,
    location?: string
  ) => ReferralCode;
  validateCode: (
    shortCode: string
  ) => { valid: boolean; code?: ReferralCode; message: string };
  confirmDeal: (shortCode: string) => boolean;
  getCodeByShort: (shortCode: string) => ReferralCode | undefined;
}

const ProofOfIntroductionContext = createContext<ProofOfIntroductionContextType | null>(
  null
);

// Helper to generate alphanumeric code
function generateShortCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Helper to generate simple QR code (in real app, use qr code library)
function generateMockQR(data: string): string {
  // Return a data URL for a simple placeholder
  // In production, use qrcode.react or similar
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='white' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='monospace' font-size='12' fill='black'%3E${encodeURIComponent(data.substring(0, 20))}`;
}

export function ProofOfIntroductionProvider({ children }: { children: ReactNode }) {
  const [codes, setCodes] = useState<Map<string, ReferralCode>>(new Map());

  const generateCode = useCallback(
    (referrerId: string, propertyType?: string, location?: string): ReferralCode => {
      const shortCode = generateShortCode();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

      const code: ReferralCode = {
        id: `code_${Date.now()}`,
        shortCode,
        qrCode: generateMockQR(shortCode),
        referrerId,
        propertyType,
        location,
        createdAt: now,
        expiresAt,
        status: "active",
      };

      setCodes((prev) => new Map(prev).set(shortCode, code));
      localStorage.setItem(
        `poi_codes_${referrerId}`,
        JSON.stringify(Array.from(codes.values()))
      );

      return code;
    },
    [codes]
  );

  const validateCode = useCallback(
    (shortCode: string) => {
      const code = codes.get(shortCode);

      if (!code) {
        return { valid: false, message: "Invalid code" };
      }

      if (code.status === "expired") {
        return { valid: false, message: "Code has expired" };
      }

      if (code.status === "used") {
        return { valid: false, message: "Code already used" };
      }

      return { valid: true, code, message: "Valid code" };
    },
    [codes]
  );

  const confirmDeal = useCallback((shortCode: string) => {
    setCodes((prev) => {
      const newCodes = new Map(prev);
      const code = newCodes.get(shortCode);
      if (code) {
        newCodes.set(shortCode, {
          ...code,
          status: "used",
          validatedAt: new Date(),
        });
      }
      return newCodes;
    });
    return true;
  }, []);

  const getCodeByShort = useCallback(
    (shortCode: string) => codes.get(shortCode),
    [codes]
  );

  return (
    <ProofOfIntroductionContext.Provider
      value={{
        codes,
        generateCode,
        validateCode,
        confirmDeal,
        getCodeByShort,
      }}
    >
      {children}
    </ProofOfIntroductionContext.Provider>
  );
}

export function useProofOfIntroduction() {
  const ctx = useContext(ProofOfIntroductionContext);
  if (!ctx)
    throw new Error(
      "useProofOfIntroduction must be inside ProofOfIntroductionProvider"
    );
  return ctx;
}
