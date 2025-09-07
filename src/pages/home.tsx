import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CreateReferralModal from "@/components/create-referral-modal";
import QRCodeModal from "@/components/qr-code-modal";
import { QrCode } from "lucide-react";
import type { User } from "@/types/schema";
import DashboardStats from "@/components/dashboard-stats";
import RecentReferrals from "@/components/recent-referrals";
import HolidayDeals from "@/components/holiday-deals";
import ReferralLink from "@/components/referral-link";
import { ReferralRequests } from "@/components/referral-requests";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getInitials, userId } = useUser();

  const [showQRModal, setShowQRModal] = useState(false);

  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const referralUrl = `${window.location.origin}/ref/123456`;

  const getWhatsAppQRUrl = () => {
    const message = `Hi! 👋\n\nI wanted to share Travana with you - they provide amazing travel services and I think you'd love what they offer!\n\nUse my referral link to get started: ${referralUrl}\n\nLet me know if you have any questions! ✈️`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen w-full">
      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1
                className="text-xl sm:text-2xl font-bold text-primary"
                data-testid="text-brand-nav"
              >
                Travana
              </h1>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-6 ml-8">
                <Button
                  variant="ghost"
                  className="text-foreground hover:text-primary font-medium"
                  data-testid="button-nav-dashboard"
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground font-medium"
                  data-testid="button-nav-referrals"
                >
                  Referrals
                </Button>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground font-medium"
                  data-testid="button-nav-commissions"
                >
                  Commissions
                </Button>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground font-medium"
                  data-testid="button-nav-profile"
                >
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
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-8">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      Menu
                    </h2>

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
                          <span className="text-sm font-medium">Jhon Doe</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            Jhon Doe
                          </p>
                          <p className="text-xs text-muted-foreground">
                            jhon.doe@example.com
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        className="w-full justify-start mt-4 text-muted-foreground hover:text-foreground h-12"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleSignOut();
                        }}
                      >
                        🚪 Sign Out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop User Menu */}
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
                  data-testid="button-user-menu"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <span
                      className="text-sm font-medium"
                      data-testid="text-user-initials"
                    >
                      {getInitials()}
                    </span>
                  </div>
                  <span className="text-xs">▼</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign Out
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
        <DashboardStats userId={userId || ""} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mt-6 sm:mt-8">
          <div className="lg:col-span-2 order-2 lg:order-1 space-y-6 sm:space-y-8">
            <RecentReferrals />
            <ReferralRequests />
            <HolidayDeals />
          </div>

          <div className="space-y-6 order-1 lg:order-2">
            <ReferralLink
              user={
                {
                  firstName: "Jhon",
                  lastName: "Doe",
                  referralCode: "123456",
                } as User
              }
            />
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
