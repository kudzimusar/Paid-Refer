import { type Lead } from "../../hooks/useLeads";

interface Props {
  lead: Lead;
  onClose: () => void;
}

export function ChatDrawer({ lead, onClose }: Props) {
  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col">
      <div className="p-4 border-b flex items-center justify-between bg-indigo-600 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
            {lead.customerName.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold">{lead.customerName}</h3>
            <p className="text-xs text-white/80">Active Chat</p>
          </div>
        </div>
        <button onClick={onClose} className="text-2xl">×</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        <div className="text-center py-10">
          <p className="text-gray-400 text-sm italic">Starting conversation with {lead.customerName}...</p>
        </div>
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold">Send</button>
        </div>
      </div>
    </div>
  );
}
