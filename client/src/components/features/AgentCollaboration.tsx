import { useState } from "react";
import { Users, UserPlus, MessageCircle, Split, ShieldCheck, ChevronRight, MoreHorizontal, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AvatarInitials } from "@/components/ui/shared";

interface Partner {
  id: string;
  name: string;
  split: number;
  role: string;
  isVerified: boolean;
}

export function AgentCollaboration() {
  const [partners, setPartners] = useState<Partner[]>([
    { id: "p1", name: "Sarah Botha", split: 30, role: "Closing Specialist", isVerified: true },
  ]);
  const [showInvite, setShowInvite] = useState(false);

  const totalSplit = partners.reduce((acc, p) => acc + p.split, 0);
  const mySplit = 100 - totalSplit;

  return (
    <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
      <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-xl">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Deal Collaboration</h3>
            <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">Co-Working & Split Management</p>
          </div>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="rounded-full border-purple-100 text-purple-600 hover:bg-purple-50"
          onClick={() => setShowInvite(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Partner
        </Button>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Split Visualization */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span className="text-neutral-400">Commission Distribution</span>
            <span className="text-purple-600">Total 100%</span>
          </div>
          <div className="h-6 w-full flex rounded-full overflow-hidden border border-neutral-100 p-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${mySplit}%` }}
              className="h-full bg-primary rounded-full flex items-center justify-center text-[8px] font-black text-white"
            >
              YOU {mySplit}%
            </motion.div>
            {partners.map((p, i) => (
              <motion.div 
                key={p.id}
                initial={{ width: 0 }}
                animate={{ width: `${p.split}%` }}
                className={`h-full flex items-center justify-center text-[8px] font-black text-white ${
                  i === 0 ? 'bg-purple-500' : 'bg-indigo-500'
                } rounded-full -ml-2 border-2 border-white`}
              >
                {p.split}%
              </motion.div>
            ))}
          </div>
        </div>

        {/* Partners List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100 group">
            <div className="flex items-center gap-3">
              <AvatarInitials name="Me" size="sm" />
              <div>
                <p className="text-sm font-bold text-neutral-900">You (Lead Owner)</p>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Primary Agent</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-primary">{mySplit}%</p>
              <Badge variant="outline" className="text-[8px] uppercase tracking-tighter">Owner</Badge>
            </div>
          </div>

          {partners.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-100 hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <AvatarInitials name={p.name} size="sm" />
                  {p.isVerified && (
                    <div className="absolute -right-1 -bottom-1 bg-emerald-500 rounded-full p-0.5 border-2 border-white">
                      <UserCheck className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900">{p.name}</p>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{p.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-black text-purple-600">{p.split}%</p>
                  <button className="text-[10px] font-bold text-neutral-400 hover:text-primary transition-colors">Edit Split</button>
                </div>
                <button className="p-2 hover:bg-neutral-50 rounded-xl text-neutral-400">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <p className="text-[10px] font-bold text-emerald-700">Commission split contract is AI-Secured & Immutable</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
