import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

export default function InvitationPage() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const [showAccountMismatchDialog, setShowAccountMismatchDialog] =
    useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const session = authClient.useSession();
  const { mutate: acceptInvitation, isPending } = useMutation({
    mutationFn: async () => {
      await authClient.organization.acceptInvitation({ invitationId: token || "" ,
      });
    },
  });

  const startAutoSignOut = useCallback(() => {
    setIsSigningOut(true);
    setCountdown(5);

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    timeoutRef.current = setTimeout(async () => {
      await authClient.signOut();
      setShowAccountMismatchDialog(false);
      navigate("/", {
        state: {
          from: {
            pathname: window.location.pathname,
            search: window.location.search,
          },
        },
      });
    }, 5000);
  }, [navigate]);
console.log(email,session?.data?.user?.email)
  useEffect(() => {
    if (email === session?.data?.user?.email && token) {
      console.log("accepting invitation")
      acceptInvitation();
    } else if (
      session?.data?.user?.email &&
      email &&
      email !== session?.data?.user?.email
    ) {
      setShowAccountMismatchDialog(true);
      startAutoSignOut();
    }
  }, [
    token,
    email,
    session?.data?.user?.email,
    acceptInvitation,
    startAutoSignOut,
  ]);

  const handleSignOutAndRetry = async () => {
    // Pass the current location object as state for redirect after sign in (matching private route pattern)
    navigate("/", {
      state: {
        from: {
          pathname: window.location.pathname,
          search: window.location.search,
        },
      },
    });

    startAutoSignOut();
  };

  const handleContinueWithCurrentAccount = () => {
    setShowAccountMismatchDialog(false);
    // You might want to show a different message or redirect
    navigate("/dashboard");
  };

  // Cleanup intervals and timeouts
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reset state when dialog is closed
  const handleDialogClose = (open: boolean) => {
    if (!open && isSigningOut) {
      // Cancel the sign out process if dialog is closed during countdown
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsSigningOut(false);
      setCountdown(0);
    }
    setShowAccountMismatchDialog(open);
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Invitation Accepted!
              </h2>
              <p className="text-muted-foreground">
                You have successfully joined the team. Welcome aboard!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Mismatch Dialog */}
      <Dialog open={showAccountMismatchDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <DialogTitle>Account Mismatch</DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              The invitation was sent to a different account than the one you're
              currently signed in with. You will be automatically signed out in{" "}
              {countdown} seconds to allow you to sign in with the correct
              account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleContinueWithCurrentAccount}
              disabled={isSigningOut}
              className="w-full sm:w-auto"
            >
              Continue with current account
            </Button>
            <Button
              onClick={handleSignOutAndRetry}
              disabled={isSigningOut}
              className="w-full sm:w-auto"
            >
              {isSigningOut
                ? `Signing out in ${countdown}s...`
                : "Sign out now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
