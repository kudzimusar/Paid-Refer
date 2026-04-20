import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useProofOfIntroduction } from "@/contexts/ProofOfIntroductionContext";
import { Copy, Share2, MessageCircle } from "lucide-react";
import { useMarketContext } from "@/contexts/MarketContext";

interface ReferralLinkCardProps {
  referrerId: string;
  propertyType?: string;
  location?: string;
}

export function ReferralLinkCard({
  referrerId,
  propertyType,
  location,
}: ReferralLinkCardProps) {
  const { generateCode } = useProofOfIntroduction();
  const { config } = useMarketContext();
  const [code, setCode] = useState(() =>
    generateCode(referrerId, propertyType, location)
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.shortCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: "whatsapp" | "line") => {
    const message =
      platform === "whatsapp"
        ? `Check out this ${propertyType || "property"} in ${location || "our listings"}! Use code: ${code.shortCode}`
        : `💚 Property match found! Code: ${code.shortCode}`;
    const url = `https://example.com/r/${code.shortCode}`;
    const fullMessage = `${message} ${url}`;
    const encoded = encodeURIComponent(fullMessage);
    const shareUrl =
      platform === "whatsapp"
        ? `https://wa.me/?text=${encoded}`
        : `https://line.me/R/msg/text/${encoded}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <Card className="border-2 border-emerald-500/30">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
        <CardTitle className="flex items-center gap-2">
          <span>🔗</span> Your Referral Link
        </CardTitle>
        <CardDescription>
          Share this code or QR to earn commission on every successful referral
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* QR Code Display */}
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-lg border-2 border-emerald-200 flex items-center justify-center w-32 h-32">
            <div className="bg-gradient-to-br from-emerald-100 to-green-100 p-2 rounded flex items-center justify-center w-full h-full">
              <div className="text-center">
                <div className="text-2xl">📱</div>
                <div className="text-xs mt-1 text-muted-foreground">
                  Scan to verify
                </div>
              </div>
            </div>
          </div>

          {/* Code Display */}
          <div className="flex-1">
            <div className="bg-muted p-4 rounded-lg mb-3">
              <p className="text-xs text-muted-foreground mb-1">Your Code</p>
              <div className="font-mono text-3xl tracking-widest font-bold text-emerald-600">
                {code.shortCode}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Or enter manually at checkout
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="w-full gap-2"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy Code"}
            </Button>
          </div>
        </div>

        {/* Status Badge */}
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 w-full justify-center py-2">
          🟢 Active - Ready to share
        </Badge>

        {/* Share Options */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => handleShare("whatsapp")}
            className="gap-2"
            variant="outline"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
          <Button
            onClick={() => handleShare("line")}
            className="gap-2"
            variant="outline"
          >
            <span>💚</span>
            LINE
          </Button>
        </div>

        {/* Property Details */}
        {(propertyType || location) && (
          <div className="bg-muted p-3 rounded-lg text-sm">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Targeting
            </p>
            <div className="space-y-1">
              {propertyType && (
                <div className="flex justify-between">
                  <span>Property Type:</span>
                  <span className="font-medium">{propertyType}</span>
                </div>
              )}
              {location && (
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-medium">{location}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Earnings Info */}
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
          <p className="text-xs font-medium text-emerald-900 mb-1">
            💰 Commission Structure
          </p>
          <ul className="text-xs text-emerald-800 space-y-1">
            <li>
              <strong>You earn:</strong> ${config.market === "ZW" ? "120" : config.market === "ZA" ? "1,800" : "12,000"} per successful referral
            </li>
            <li>
              <strong>Customer cashback:</strong> ${config.market === "ZW" ? "20" : config.market === "ZA" ? "300" : "2,000"}
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
