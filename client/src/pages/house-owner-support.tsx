import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function HouseOwnerSupportPage() {
  const [message, setMessage] = useState("");
  return (
    <div className="min-h-screen bg-neutral-50 p-6 pb-24">
      <div className="max-w-lg mx-auto premium-card p-6 space-y-3">
        <h1 className="text-xl font-bold">Help & Support</h1>
        <Input placeholder="Subject" />
        <textarea className="w-full min-h-32 border rounded-xl p-3" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue" />
        <button className="btn-premium w-full" disabled={!message}>Submit Ticket</button>
      </div>
    </div>
  );
}
