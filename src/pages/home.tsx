import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import RecentReferrals from "@/components/recent-referrals";
// import ReferralLink from "@/components/referral-link";
// import HolidayDeals from "@/components/holiday-deals";
import CreateReferralModal from "@/components/create-referral-modal";
import { useQuery } from "@tanstack/react-query";
import QRCodeModal from "@/components/qr-code-modal";
import { QrCode } from "lucide-react";
import type { Referral, ReferralStatus, User } from "@/types/schema";
import ReferralProgress from "@/components/referral-progress";
import DashboardStats from "@/components/dashboard-stats";
import RecentReferrals from "@/components/recent-referrals";
import HolidayDeals from "@/components/holiday-deals";
import ReferralLink from "@/components/referral-link";


function ReferralProgressSection() {
  const { data: referrals } = useQuery<Referral[]>({
    queryKey: ['/api/referrals'],
  });

  // Find the most recent active referral (not booked or lost)
  const activeReferral = referrals?.find(referral => 
    referral.status !== 'booked' && referral.status !== 'lost'
  ) || referrals?.[0]; // Fallback to most recent referral

  if (!activeReferral) {
    return null;
  }

  return <ReferralProgress currentStatus={activeReferral.status as ReferralStatus} />;
}

export default function Home() {
  // const { user, isLoading } = useAuth();
  // const { toast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  // const [showRegistrationWizard, setShowRegistrationWizard] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  
  // QR Code modal state
  const [showQRModal, setShowQRModal] = useState(false);
  
  // Navigation
  // const navigate = useNavigate();
  
  const referralUrl = `${window.location.origin}/ref/123456`;
  
  const getWhatsAppQRUrl = () => {
    const message = `Hi! 👋\n\nI wanted to share Travana with you - they provide amazing travel services and I think you'd love what they offer!\n\nUse my referral link to get started: ${referralUrl}\n\nLet me know if you have any questions! ✈️`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  // useEffect(() => {
  //   if (!isLoading && !user) {
  //     toast({
  //       title: "Unauthorized",
  //       description: "You are logged out. Logging in again...",
  //       variant: "destructive",
  //     });
  //     setTimeout(() => {
  //       window.location.href = "/api/login";
  //     }, 500);
  //     return;
  //   }

  //   // Show registration wizard if user profile is incomplete
  //   if (user && (!user.firstName || !user.lastName || !user.phone)) {
  //     setShowRegistrationWizard(true);
  //   }
  // }, [user, isLoading, toast]);

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-background">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
  //         <p className="text-muted-foreground">Loading your dashboard...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!user) {
  //   return null;
  // }

  // if (showRegistrationWizard) {
  //   return (
  //     <RegistrationWizard 
  //       onComplete={() => setShowRegistrationWizard(false)}
  //       onClose={() => setShowRegistrationWizard(false)}
  //     />
  //   );
  // }

  return (
    <div className="min-h-screen w-full">
      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl sm:text-2xl font-bold text-primary" data-testid="text-brand-nav">Travana</h1>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-6 ml-8">
                <Button variant="ghost" className="text-foreground hover:text-primary font-medium" data-testid="button-nav-dashboard">
                  Dashboard
                </Button>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-medium" data-testid="button-nav-referrals">
                  Referrals
                </Button>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-medium" data-testid="button-nav-commissions">
                  Commissions
                </Button>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-medium" data-testid="button-nav-profile">
                  Profile
                </Button>
                {/* {user?.isAdmin && (
                  <Button 
                    variant="ghost" 
                    className="text-muted-foreground hover:text-foreground font-medium" 
                    data-testid="button-nav-admin"
                    onClick={() => navigate('/admin')}
                  >
                    Admin
                  </Button>
                )} */}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Create Button */}
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 sm:px-4"
                size="sm"
                onClick={() => setShowCreateModal(true)}
                data-testid="button-create-referral"
              >
                <span className="mr-1 sm:mr-2">+</span>
                <span className="hidden sm:inline">New Referral</span>
                <span className="sm:hidden">New</span>
              </Button>
              
              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="md:hidden p-2"
                    data-testid="button-mobile-menu"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-8">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Menu</h2>
                    
                    <Button 
                      variant="ghost" 
                      className="justify-start text-foreground hover:text-primary font-medium h-12"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      📊 Dashboard
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="justify-start text-muted-foreground hover:text-foreground font-medium h-12"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      👥 Referrals
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="justify-start text-muted-foreground hover:text-foreground font-medium h-12"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      💰 Commissions
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="justify-start text-muted-foreground hover:text-foreground font-medium h-12"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      👤 Profile
                    </Button>
                    
                    {/* {user?.isAdmin && (
                      <Button 
                        variant="ghost" 
                        className="justify-start text-muted-foreground hover:text-foreground font-medium h-12"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/admin');
                        }}
                        data-testid="button-mobile-admin"
                      >
                        🛡️ Admin
                      </Button>
                    )} */}
                    
                    <div className="border-t border-border pt-4 mt-6">
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <span className="text-sm font-medium">
                           Jhon Doe
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                           Jhon Doe
                          </p>
                          <p className="text-xs text-muted-foreground">jhon.doe@example.com</p>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start mt-4 text-muted-foreground hover:text-foreground h-12"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          window.location.href = '/api/logout';
                        }}
                      >
                        🚪 Sign Out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              
              {/* Desktop User Menu */}
              <div className="hidden md:block">
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
                  onClick={() => window.location.href = '/api/logout'}
                  data-testid="button-user-menu"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <span className="text-sm font-medium" data-testid="text-user-initials">
                      JD
                    </span>
                  </div>
                  <span className="text-xs">▼</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile QR Code Button - Top of page */}
      <div className="md:hidden bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Button
            onClick={() => setShowQRModal(true)}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-semibold"
            data-testid="button-mobile-qr-top"
          >
            <QrCode className="h-5 w-5 mr-2" />
            Show QR Code
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Dashboard Stats */}
        <DashboardStats />
        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mt-6 sm:mt-8">
          {/* Recent Referrals - Full width on mobile */}
          <div className="lg:col-span-2 order-2 lg:order-1 space-y-6 sm:space-y-8">
            <RecentReferrals />
            <HolidayDeals />
          </div>

          {/* Referral Link & Progress - Show first on mobile */}
          <div className="space-y-6 order-1 lg:order-2">
            <ReferralLink user={{ firstName: "Jhon", lastName: "Doe", referralCode: "123456" } as User} />
            <ReferralProgressSection />
          </div>
        </div>
      </div>

      {/* Create Referral Modal */}
      {showCreateModal && (
        <CreateReferralModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            // Refresh the page to show updated data
            window.location.reload();
          }}
        />
      )}
      
      
      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        whatsappUrl={getWhatsAppQRUrl()}
        userName={"Jhon Doe"}
      />
    </div>
  );
}
