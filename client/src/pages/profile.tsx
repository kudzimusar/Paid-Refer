import { useAuthContext } from "@/contexts/AuthContext";
import { User, Settings, ShieldCheck, CreditCard, LogOut, ChevronRight, MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user, logout } = useAuthContext();

  if (!user) return null;

  const stats = [
    { label: "Active Inquiries", value: "3" },
    { label: "Agents Matched", value: "12" },
    { label: "Viewings", value: "2" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-24">
      {/* Profile Header */}
      <div className="bg-white border-b border-neutral-100 px-6 pt-12 pb-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              <User className="w-12 h-12 text-primary" />
            </div>
            <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mt-4">{user.name}</h2>
          <Badge variant="secondary" className="mt-1 bg-blue-50 text-blue-600 border-none font-semibold px-3 py-0.5">
            Verified Customer
          </Badge>
          
          <div className="grid grid-cols-3 gap-8 mt-8 w-full max-w-md">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-xl font-bold text-neutral-900">{stat.value}</div>
                <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-lg mx-auto space-y-6">
        {/* Contact Info */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            <div className="divide-y divide-neutral-50">
              <div className="p-4 flex items-center space-x-4">
                <div className="p-2 bg-neutral-100 rounded-lg">
                  <Mail className="w-4 h-4 text-neutral-500" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-neutral-400 font-bold uppercase">Email</div>
                  <div className="text-sm font-medium text-neutral-900">{user.email}</div>
                </div>
              </div>
              <div className="p-4 flex items-center space-x-4">
                <div className="p-2 bg-neutral-100 rounded-lg">
                  <Phone className="w-4 h-4 text-neutral-500" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-neutral-400 font-bold uppercase">Phone</div>
                  <div className="text-sm font-medium text-neutral-900">{user.phone || "Not provided"}</div>
                </div>
              </div>
              <div className="p-4 flex items-center space-x-4">
                <div className="p-2 bg-neutral-100 rounded-lg">
                  <MapPin className="w-4 h-4 text-neutral-500" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-neutral-400 font-bold uppercase">Market</div>
                  <div className="text-sm font-medium text-neutral-900">{user.country === 'ZW' ? 'Zimbabwe' : user.country === 'ZA' ? 'South Africa' : 'Japan'}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-semibold text-neutral-900">Verification Center</span>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-300" />
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-semibold text-neutral-900">Payment Methods</span>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-300" />
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-neutral-100 rounded-xl group-hover:bg-neutral-200 transition-colors">
                <Settings className="w-5 h-5 text-neutral-600" />
              </div>
              <span className="font-semibold text-neutral-900">Settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-300" />
          </button>
        </div>

        {/* Logout */}
        <button 
          onClick={() => logout()}
          className="w-full flex items-center justify-center space-x-2 p-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
