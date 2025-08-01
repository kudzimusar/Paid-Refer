import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ArrowLeft, Settings, Edit3, Heart, MessageCircle, Phone } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function CustomerDashboard() {
  const [, setLocation] = useLocation();

  const { data: requests = [] } = useQuery({
    queryKey: ['/api/customer/requests'],
  });

  const { data: leads = [] } = useQuery({
    queryKey: ['/api/customer/leads'],
  });

  const activeRequest = requests.find((req: any) => req.status === 'active');
  const interestedAgents = leads.filter((lead: any) => lead.status === 'contacted');

  return (
    <div className="min-h-screen pt-safe-top pb-20">
      {/* Header */}
      <div className="px-6 py-4 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">My Request</h1>
            <p className="text-sm text-neutral-600">Track your apartment search</p>
          </div>
          <button className="p-2 rounded-full bg-neutral-100">
            <Settings className="w-5 h-5 text-neutral-700" />
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {activeRequest ? (
          <>
            {/* Status Card */}
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                    ACTIVE REQUEST
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {activeRequest.propertyType} in {activeRequest.preferredAreas?.join(', ')}
                </h3>
                <p className="text-neutral-600 text-sm mb-4">
                  ¥{activeRequest.budgetMin?.toLocaleString()} - ¥{activeRequest.budgetMax?.toLocaleString()}/month
                  {activeRequest.moveInDate && ` • Move-in: ${new Date(activeRequest.moveInDate).toLocaleDateString()}`}
                </p>
                
                {/* Progress Stats */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <StatsCard
                    title="Agents notified"
                    value={leads.length}
                    color="primary"
                  />
                  <StatsCard
                    title="Viewed request"
                    value={leads.filter((l: any) => l.status !== 'pending').length}
                    color="secondary"
                  />
                  <StatsCard
                    title="Interested agents"
                    value={interestedAgents.length}
                    color="accent"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Interested Agents */}
            {interestedAgents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Interested Agents</h3>
                <div className="space-y-3">
                  {interestedAgents.map((lead: any) => (
                    <Card key={lead.id} className="shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center">
                            <span className="text-neutral-600 font-medium">
                              {lead.agentId.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-neutral-900">Agent {lead.agentId.slice(-4)}</h4>
                              <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                                Verified
                              </Badge>
                            </div>
                            <p className="text-sm text-neutral-600">Match Score: {Math.round((lead.matchScore || 0) * 100)}%</p>
                            {lead.aiSummary && (
                              <p className="text-xs text-neutral-500 mt-1">{lead.aiSummary}</p>
                            )}
                            <p className="text-xs text-neutral-500 mt-1">
                              Responded {new Date(lead.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Link href={`/chat/${lead.conversationId || lead.id}`} className="flex-1">
                            <Button className="w-full bg-primary text-white">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Chat
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            <Phone className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-neutral-600 mb-4">No active requests found</p>
              <Link href="/customer-form">
                <Button className="bg-primary text-white">
                  Create New Request
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="p-4 h-auto flex-col">
              <Edit3 className="w-5 h-5 text-primary mb-2" />
              <span className="text-sm font-medium text-neutral-900">Edit Request</span>
            </Button>
            <Button variant="outline" className="p-4 h-auto flex-col">
              <Heart className="w-5 h-5 text-accent mb-2" />
              <span className="text-sm font-medium text-neutral-900">Saved Properties</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
