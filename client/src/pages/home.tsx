import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { useAuth } from "@/hooks/useAuth";
import { Home as HomeIcon, UserCheck, Share2, Bell } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <GradientBackground className="min-h-screen pt-safe-top pb-20">
      <div className="px-6 pt-4 pb-2">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-neutral-900">Refer</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full bg-white/50">
              <Bell className="w-5 h-5 text-neutral-700" />
            </button>
            <button 
              onClick={handleLogout}
              className="text-sm text-neutral-600 hover:text-neutral-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 text-center">
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
          Welcome back, {user?.firstName || 'User'}!
        </h2>
        <p className="text-neutral-600 text-sm mb-8">
          {user?.role === 'customer' && "Ready to find your perfect apartment?"}
          {user?.role === 'agent' && "Manage your leads and connect with customers"}
          {user?.role === 'referrer' && "Create referral links and earn rewards"}
          {!user?.role && "Complete your profile to get started"}
        </p>
        
        <div className="space-y-4 mb-8">
          {(!user?.role || user?.role === 'customer') && (
            <Link href="/search?action=new-request">
              <Button className="w-full bg-primary text-white py-4 rounded-xl font-semibold shadow-lg">
                <HomeIcon className="w-5 h-5 mr-2" />
                Find an Apartment
              </Button>
            </Link>
          )}
          
          {(!user?.role || user?.role === 'agent') && !user?.profile && (
            <Button className="w-full bg-secondary text-white py-4 rounded-xl font-semibold shadow-lg">
              <UserCheck className="w-5 h-5 mr-2" />
              I'm an Agent
            </Button>
          )}
          
          {(!user?.role || user?.role === 'referrer') && !user?.profile && (
            <Button className="w-full bg-accent text-white py-4 rounded-xl font-semibold shadow-lg">
              <Share2 className="w-5 h-5 mr-2" />
              I'm a Referrer
            </Button>
          )}
        </div>
      </div>

      <div className="px-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          {user?.role === 'customer' && (
            <Link href="/customer-dashboard">
              <Card className="bg-white/70 hover:bg-white/90 transition-colors cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <HomeIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-sm font-medium text-neutral-900">My Requests</div>
                </CardContent>
              </Card>
            </Link>
          )}
          
          {user?.role === 'agent' && (
            <Link href="/agent-dashboard">
              <Card className="bg-white/70 hover:bg-white/90 transition-colors cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <UserCheck className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="text-sm font-medium text-neutral-900">My Leads</div>
                </CardContent>
              </Card>
            </Link>
          )}
          
          {user?.role === 'referrer' && (
            <Link href="/referrer-dashboard">
              <Card className="bg-white/70 hover:bg-white/90 transition-colors cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Share2 className="w-4 h-4 text-accent" />
                  </div>
                  <div className="text-sm font-medium text-neutral-900">My Links</div>
                </CardContent>
              </Card>
            </Link>
          )}
          
          <Link href="/chat">
            <Card className="bg-white/70 hover:bg-white/90 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
                <div className="text-sm font-medium text-neutral-900">Messages</div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </GradientBackground>
  );
}
