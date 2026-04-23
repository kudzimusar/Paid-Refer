import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Search, 
  Globe, 
  Plus, 
  Zap, 
  Database, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Filter,
  MapPin,
  Star,
  Send,
  Loader2
} from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";
import { NavLogo } from "@/components/ui/Logo";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GlobalAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  agencyName: string;
  licenseNumber: string;
  country: string;
  city: string;
  externalRating: string;
  sourceUrl: string;
  lastSeenAt: string;
  isPlatformUser: boolean;
}

export default function AdminAgentRegistryPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const [discoveryHtml, setDiscoveryHtml] = useState("");
  const [discoveryUrl, setDiscoveryUrl] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("ZW");

  const { data: registry = [], isLoading } = useQuery<GlobalAgent[]>({
    queryKey: ["/api/admin/agent-registry"],
    queryFn: () => apiRequest("GET", "/api/admin/agent-registry"),
  });

  const discoveryMutation = useMutation({
    mutationFn: async (data: { html: string; sourceUrl: string; country: string }) => {
      return apiRequest("POST", "/api/admin/agent-registry/discover", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Discovery Successful",
        description: `Found and imported ${data.count} agents.`,
      });
      setIsDiscoveryOpen(false);
      setDiscoveryHtml("");
      setDiscoveryUrl("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/agent-registry"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Discovery Failed",
        description: error.message || "Failed to process HTML.",
      });
    },
  });

  const filteredRegistry = registry.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.agencyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-20 selection:bg-primary/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <NavLogo />
            <div className="h-6 w-px bg-neutral-800" />
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-400">
              <Database className="w-4 h-4" />
              Global Agent Registry
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isDiscoveryOpen} onOpenChange={setIsDiscoveryOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold gap-2 rounded-xl h-10 px-4 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]">
                  <Zap className="w-4 h-4 fill-current" />
                  AI Discovery
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-neutral-900 border-neutral-800 text-white sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <Zap className="text-primary w-5 h-5" />
                    AI Agent Discovery
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Target Country</label>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger className="bg-neutral-800 border-neutral-700">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-700">
                        <SelectItem value="ZW">Zimbabwe</SelectItem>
                        <SelectItem value="ZA">South Africa</SelectItem>
                        <SelectItem value="JP">Japan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Source URL</label>
                    <Input 
                      placeholder="https://www.property24.com/agents/..." 
                      className="bg-neutral-800 border-neutral-700"
                      value={discoveryUrl}
                      onChange={(e) => setDiscoveryUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Portal HTML Snippet</label>
                    <textarea 
                      placeholder="Paste the HTML content containing agent listings here..." 
                      className="w-full h-40 bg-neutral-800 border border-neutral-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                      value={discoveryHtml}
                      onChange={(e) => setDiscoveryHtml(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl"
                    onClick={() => discoveryMutation.mutate({ html: discoveryHtml, sourceUrl: discoveryUrl, country: selectedCountry })}
                    disabled={discoveryMutation.isPending || !discoveryHtml || !discoveryUrl}
                  >
                    {discoveryMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Run AI Extraction"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="border-neutral-800 bg-neutral-900 hover:bg-neutral-800 gap-2 rounded-xl h-10">
              <Plus className="w-4 h-4" />
              Manual Add
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-neutral-900/40 p-4 rounded-2xl border border-neutral-800 backdrop-blur-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <Input 
              placeholder="Search by name, agency, or city..." 
              className="pl-10 bg-neutral-950 border-neutral-800 h-11 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Button variant="outline" className="border-neutral-800 bg-neutral-950 h-11 rounded-xl gap-2 flex-1 md:flex-none">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <div className="h-11 px-4 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center gap-3 text-xs font-bold">
              <span className="text-neutral-500 uppercase tracking-widest">Total:</span>
              <span className="text-primary">{filteredRegistry.length} Agents</span>
            </div>
          </div>
        </div>

        {/* Registry Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-64 bg-neutral-900/40 rounded-3xl animate-pulse border border-neutral-800" />
            ))}
          </div>
        ) : filteredRegistry.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-neutral-900/20 rounded-3xl border border-dashed border-neutral-800">
            <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-neutral-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">No agents found</h3>
              <p className="text-neutral-500">Try adjusting your search or use AI Discovery to find new agents.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredRegistry.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PremiumCard className="h-full border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/60 transition-all hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] group">
                    <div className="p-6 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center font-black text-lg text-primary border border-primary/20">
                            {agent.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{agent.name}</h3>
                            <p className="text-xs text-neutral-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {agent.city}, {agent.country}
                            </p>
                          </div>
                        </div>
                        {agent.isPlatformUser ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Registered
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-neutral-500 border-neutral-800">
                            External
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-neutral-950/50 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Agency</span>
                          <span className="text-xs font-bold text-neutral-300">{agent.agencyName || "Independent"}</span>
                        </div>
                        <div className="flex items-center justify-between bg-neutral-950/50 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">License</span>
                          <span className="text-xs font-bold text-neutral-300">{agent.licenseNumber || "Pending"}</span>
                        </div>
                        <div className="flex items-center justify-between bg-neutral-950/50 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Ext. Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-black text-amber-500">{agent.externalRating || "N/A"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex gap-2">
                        {!agent.isPlatformUser && (
                          <Button className="flex-1 bg-white/5 hover:bg-primary hover:text-white border-neutral-800 rounded-xl h-10 text-xs font-bold gap-2 transition-all">
                            <Send className="w-3 h-3" />
                            Invite Agent
                          </Button>
                        )}
                        <Button variant="outline" className="flex-1 border-neutral-800 bg-neutral-950 hover:bg-neutral-800 rounded-xl h-10 text-xs font-bold gap-2">
                          <ExternalLink className="w-3 h-3" />
                          View Source
                        </Button>
                      </div>
                    </div>
                  </PremiumCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
