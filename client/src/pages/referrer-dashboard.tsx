import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/dashboard/stats-card";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link2, Copy, Share, Banknote, Settings } from "lucide-react";
import type { ReferralLink } from "@/types";

export default function ReferrerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showLinkForm, setShowLinkForm] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['/api/auth/user'],
    select: (data: any) => data.profile,
  });

  const { data: links = [] } = useQuery({
    queryKey: ['/api/referrer/links'],
  });

  const createLinkMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/referrer/link', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/referrer/links'] });
      setShowLinkForm(false);
      toast({
        title: "Link Created",
        description: "Your referral link has been generated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create referral link. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateLink = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createLinkMutation.mutate({
      requestType: formData.get('requestType'),
      targetArea: formData.get('targetArea'),
      apartmentType: formData.get('apartmentType'),
      notes: formData.get('notes'),
    });
  };

  const copyLink = (shortCode: string) => {
    const url = `${window.location.origin}/r/${shortCode}`;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
    });
  };

  const shareLink = (shortCode: string, title?: string) => {
    const url = `${window.location.origin}/r/${shortCode}`;
    if (navigator.share) {
      navigator.share({
        title: title || 'Find Your Perfect Apartment',
        url: url,
      });
    } else {
      copyLink(shortCode);
    }
  };

  const activeLinks = links.filter((link: ReferralLink) => link.isActive);
  const totalClicks = links.reduce((sum: number, link: ReferralLink) => sum + (link.clickCount || 0), 0);
  const totalConversions = links.reduce((sum: number, link: ReferralLink) => sum + (link.conversionCount || 0), 0);

  return (
    <div className="min-h-screen pt-safe-top pb-20">
      {/* Header */}
      <div className="px-6 py-4 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">Referrer Hub</h1>
            <p className="text-sm text-neutral-600">Share links, earn rewards</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-secondary">
              ¥{(profile?.availableBalance || 0).toLocaleString()}
            </div>
            <div className="text-xs text-neutral-600">Available Balance</div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatsCard
            title="Active Links"
            value={activeLinks.length}
            color="primary"
          />
          <StatsCard
            title="Total Clicks"
            value={totalClicks}
            color="secondary"
          />
          <StatsCard
            title="Conversions"
            value={totalConversions}
            color="accent"
          />
        </div>

        {/* Generate New Link */}
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Generate Referral Link</h3>
              <Button
                onClick={() => setShowLinkForm(!showLinkForm)}
                variant={showLinkForm ? "outline" : "default"}
                className={showLinkForm ? "" : "bg-primary text-white"}
              >
                <Link2 className="w-4 h-4 mr-2" />
                {showLinkForm ? 'Cancel' : 'New Link'}
              </Button>
            </div>
            
            {showLinkForm && (
              <form onSubmit={handleCreateLink} className="space-y-4">
                <div>
                  <Label htmlFor="requestType">Request Type</Label>
                  <Select name="requestType" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select request type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment_rental">Apartment Rental</SelectItem>
                      <SelectItem value="house_purchase">House Purchase</SelectItem>
                      <SelectItem value="commercial_property">Commercial Property</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="targetArea">Target Area</Label>
                  <Input
                    name="targetArea"
                    placeholder="e.g., Shibuya, Shinjuku"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="apartmentType">Apartment Type (Optional)</Label>
                  <Select name="apartmentType">
                    <SelectTrigger>
                      <SelectValue placeholder="Select apartment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1K">1K</SelectItem>
                      <SelectItem value="1DK">1DK</SelectItem>
                      <SelectItem value="1LDK">1LDK</SelectItem>
                      <SelectItem value="2K">2K</SelectItem>
                      <SelectItem value="2DK">2DK</SelectItem>
                      <SelectItem value="2LDK">2LDK</SelectItem>
                      <SelectItem value="3K+">3K+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    name="notes"
                    placeholder="Any specific details about this referral..."
                    rows={2}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-white"
                  disabled={createLinkMutation.isPending}
                >
                  {createLinkMutation.isPending ? 'Generating...' : 'Generate AI Link'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Recent Links */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Links</h3>
          {links.length > 0 ? (
            <div className="space-y-3">
              {links.slice(0, 5).map((link: ReferralLink) => (
                <Card key={link.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-900">
                        {link.targetArea} {link.apartmentType} Search
                      </span>
                      <Badge 
                        variant="secondary"
                        className={
                          link.isActive 
                            ? 'bg-secondary/10 text-secondary' 
                            : 'bg-neutral/10 text-neutral-500'
                        }
                      >
                        {link.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-neutral-600 mb-3">
                      <span>Created: {new Date(link.createdAt).toLocaleDateString()}</span>
                      <span>Clicks: {link.clickCount || 0}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-neutral-100 p-2 rounded text-xs text-neutral-600 font-mono">
                        refer.app/r/{link.shortCode}
                      </div>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => copyLink(link.shortCode)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-secondary text-white"
                        onClick={() => shareLink(link.shortCode)}
                      >
                        <Share className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-neutral-600 mb-2">No referral links yet</p>
                <p className="text-sm text-neutral-500">Create your first link to start earning!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Earnings & Rewards */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Earnings & Rewards</h3>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-neutral-900">Available Balance</span>
                <span className="text-xl font-bold text-secondary">
                  ¥{(profile?.availableBalance || 0).toLocaleString()}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Pending</span>
                  <span className="text-accent">
                    ¥{((profile?.totalEarnings || 0) - (profile?.availableBalance || 0)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Total Earnings</span>
                  <span className="text-secondary">
                    ¥{(profile?.totalEarnings || 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <Button 
                className="w-full bg-secondary text-white"
                disabled={(profile?.availableBalance || 0) < 1000}
              >
                <Banknote className="w-4 h-4 mr-2" />
                Request Payout
              </Button>
              {(profile?.availableBalance || 0) < 1000 && (
                <p className="text-xs text-neutral-500 text-center mt-2">
                  Minimum payout: ¥1,000
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
