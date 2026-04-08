import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/dashboard/stats-card";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Bell, Check, Eye, Settings } from "lucide-react";
import { Link } from "wouter";
import type { Lead } from "@/types";

export default function AgentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['/api/agent/leads'],
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['/api/notifications'],
  });

  const acceptLeadMutation = useMutation({
    mutationFn: async ({ leadId, status }: { leadId: string; status: string }) => {
      const response = await apiRequest('PATCH', `/api/agent/lead/${leadId}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agent/leads'] });
      toast({
        title: "Lead Updated",
        description: "Lead status updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update lead. Please try again.",
        variant: "destructive",
      });
    },
  });

  const newLeads = leads.filter((lead: Lead) => lead.status === 'pending');
  const activeLeads = leads.filter((lead: Lead) => ['contacted', 'in_progress'].includes(lead.status));
  const unreadNotifications = notifications.filter((n: any) => !n.isRead);

  const getUrgencyColor = (score?: number) => {
    if (!score) return 'secondary';
    if (score >= 0.8) return 'accent';
    if (score >= 0.6) return 'primary';
    return 'secondary';
  };

  const getUrgencyLabel = (score?: number) => {
    if (!score) return 'Medium Match';
    if (score >= 0.8) return 'High Match';
    if (score >= 0.6) return 'Good Match';
    return 'Low Match';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-safe-top pb-20">
      {/* Header */}
      <div className="px-6 py-4 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">Agent Portal</h1>
            <p className="text-sm text-neutral-600">Manage leads and clients</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <span className="text-sm text-secondary font-medium">Online</span>
            </div>
            <button className="p-2 rounded-full bg-neutral-100">
              <Settings className="w-5 h-5 text-neutral-700" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Today's Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatsCard
            title="New Leads"
            value={newLeads.length}
            color="primary"
          />
          <StatsCard
            title="Active Chats"
            value={activeLeads.length}
            color="secondary"
          />
          <StatsCard
            title="Notifications"
            value={unreadNotifications.length}
            color="accent"
          />
        </div>

        {/* Verification Warning */}
        {user?.role === 'agent' && !user?.isVerified && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-amber-600" />
                <div>
                  <h4 className="font-semibold text-amber-900">Verification Required</h4>
                  <p className="text-sm text-amber-700">Complete identity verification to receive high-priority leads.</p>
                </div>
              </div>
              <Link href="/dashboard/verify">
                <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                  Verify Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* New Leads Alert */}
        {newLeads.length > 0 && (
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-l-4 border-primary">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <h4 className="font-semibold text-neutral-900">
                    {newLeads.length} New Matching Lead{newLeads.length > 1 ? 's' : ''}
                  </h4>
                  <p className="text-sm text-neutral-600">High-priority customers in your areas</p>
                </div>
                <Button size="sm" className="bg-primary text-white">
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Priority Leads */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Priority Leads</h3>
          {newLeads.length > 0 ? (
            <div className="space-y-3">
              {newLeads.slice(0, 3).map((lead: Lead) => (
                <Card key={lead.id} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-neutral-900">
                          Customer {lead.customerId.slice(-4)}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-neutral-600 mt-1">
                          <span>New Request</span>
                          <span>•</span>
                          <span>Score: {Math.round((lead.matchScore || 0) * 100)}%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="secondary" 
                          className={`
                            ${getUrgencyColor(lead.matchScore) === 'primary' ? 'bg-primary/10 text-primary' :
                              getUrgencyColor(lead.matchScore) === 'accent' ? 'bg-accent/10 text-accent' :
                              'bg-secondary/10 text-secondary'}
                          `}
                        >
                          {getUrgencyLabel(lead.matchScore)}
                        </Badge>
                        <p className="text-xs text-neutral-500 mt-1">
                          {new Date(lead.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                    {lead.aiSummary && (
                      <Card className="bg-neutral-50 mb-3">
                        <CardContent className="p-3">
                          <p className="text-sm text-neutral-700">
                            <strong>AI Summary:</strong> {lead.aiSummary}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1 bg-primary text-white"
                        onClick={() => acceptLeadMutation.mutate({ 
                          leadId: lead.id, 
                          status: 'contacted' 
                        })}
                        disabled={acceptLeadMutation.isPending}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Accept Lead
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-neutral-600">No new leads at the moment</p>
                <p className="text-sm text-neutral-500 mt-1">
                  We'll notify you when new matching requests come in
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Active Deals */}
        {activeLeads.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Active Deals</h3>
            <div className="space-y-3">
              {activeLeads.map((lead: Lead) => (
                <Card key={lead.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-neutral-900">
                        Customer {lead.customerId.slice(-4)} - Request #{lead.requestId.slice(-4)}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={
                          lead.status === 'in_progress' 
                            ? 'bg-accent/10 text-accent' 
                            : 'bg-secondary/10 text-secondary'
                        }
                      >
                        {lead.status === 'contacted' ? 'Contact Made' : 'In Progress'}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">
                      Last contact: {lead.lastContactAt 
                        ? new Date(lead.lastContactAt).toLocaleDateString()
                        : 'Recently'
                      }
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1">
                        View Details
                      </Button>
                      <Link href={`/chat/${lead.id}`}>
                        <Button className="bg-primary text-white">
                          Chat
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
