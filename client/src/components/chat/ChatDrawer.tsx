import { type Lead } from "../../hooks/useLeads";
import { ChatInterface } from "./chat-interface";
import { X, MessageSquare, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  lead: Lead;
  onClose: () => void;
}

export function ChatDrawer({ lead, onClose }: Props) {
  const conversation = lead.conversationId ? {
    id: lead.conversationId,
    leadId: lead.id.toString(),
    customerId: lead.customerId,
    agentId: "me", // Will be resolved by user context in ChatInterface
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } : null;

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col"
    >
      <div className="p-4 border-b flex items-center justify-between bg-white border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center font-bold text-indigo-600">
            {lead.customerName.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-neutral-900">{lead.customerName}</h3>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              {lead.country} • {lead.propertyType}
            </p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-neutral-50 rounded-xl transition-colors text-neutral-400 hover:text-neutral-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 min-h-0">
        {conversation ? (
          <ChatInterface conversation={conversation as any} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-neutral-50 flex items-center justify-center">
              <Lock className="w-10 h-10 text-neutral-200" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-neutral-900">Chat is Locked</h4>
              <p className="text-sm text-neutral-500 leading-relaxed">
                You need to accept this lead before you can start a conversation with {lead.customerName}.
              </p>
            </div>
            <button
               onClick={onClose}
               className="btn-premium px-8 py-3 text-sm flex items-center gap-2"
            >
              Back to Pipeline <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
