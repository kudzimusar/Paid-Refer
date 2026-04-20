import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProofOfIntroduction } from "@/contexts/ProofOfIntroductionContext";
import { Camera, CheckCircle, AlertCircle } from "lucide-react";

interface ReferralCodeInputProps {
  onCodeValidated?: (referrerId: string) => void;
}

export function ReferralCodeInput({ onCodeValidated }: ReferralCodeInputProps) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const { validateCode } = useProofOfIntroduction();

  const handleValidate = () => {
    const result = validateCode(code.toUpperCase());
    if (result.valid) {
      setStatus("valid");
      onCodeValidated?.(result.code!.referrerId);
    } else {
      setStatus("invalid");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="referral-code" className="text-sm font-medium">
          Do you have a referral code? <span className="text-muted-foreground">(optional)</span>
        </Label>
        <div className="flex gap-2 mt-2">
          <Input
            id="referral-code"
            placeholder="Enter 6-digit code (e.g., H7K2M9)"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setStatus("idle");
            }}
            maxLength={6}
            className="font-mono text-center text-lg tracking-widest"
          />
          <Button
            variant="outline"
            className="whitespace-nowrap gap-2"
            onClick={() => {
              // In a real app, this would open a QR scanner
              alert("QR Scanner: In a production app, this would open the device camera to scan QR codes.");
            }}
          >
            <Camera className="h-4 w-4" />
            Scan QR
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleValidate}
          disabled={code.length !== 6}
          className="flex-1"
        >
          Verify Code
        </Button>
      </div>

      {status === "valid" && (
        <Alert className="border-emerald-200 bg-emerald-50">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-800">
            ✅ Valid code! Your referrer will earn commission from this deal when it closes.
          </AlertDescription>
        </Alert>
      )}

      {status === "invalid" && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            ❌ Invalid code. Please check and try again. If you were referred, ask your referrer for their code.
          </AlertDescription>
        </Alert>
      )}

      {status === "valid" && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-800">
            💡 <strong>Pro tip:</strong> Your referrer and you will both receive rewards once your lease is confirmed.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
