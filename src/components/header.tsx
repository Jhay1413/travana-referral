import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUser } from "@/hooks/useUser";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getInitials } = useUser();

  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };
  return (
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
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground font-medium"
                data-testid="button-nav-referrals"
                onClick={() => navigate("/dashboard/referrals")}
              >
                Referrals
              </Button>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground font-medium"
                data-testid="button-nav-commissions"
                onClick={() => navigate("/dashboard/commissions")}
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
            {/* <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 sm:px-4"
              size="sm"
              onClick={() => setShowCreateModal(true)}
              data-testid="button-create-referral"
            >
              <span className="mr-1 sm:mr-2">+</span>
              <span className="hidden sm:inline">New Referral</span>
              <span className="sm:hidden">New</span>
            </Button> */}

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
  );
};
