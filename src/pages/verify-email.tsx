import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Mail, AlertTriangle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const isNewUser = searchParams.get("isNewUser") === "true" ? true : false;

  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error" | "expired"
  >("loading");
  const [showResendModal, setShowResendModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [countdown, setCountdown] = useState(5);



  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: async (token: string) => {
      await authClient.verifyEmail({ query: { token } });
    },
    onSuccess: () => {
      setVerificationStatus("success");
      toast.success("Email verified successfully!");
      
      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/dashboard", { state: { isNewUser } });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to verify email");
    },
  });

  // Resend verification mutation
  const resendVerificationMutation = useMutation({
    mutationFn: async (email: string) => {
      await authClient.sendVerificationEmail({ email });
    },
    onSuccess: () => {
      toast.success("Verification email sent! Please check your inbox.");
      setShowResendModal(false);
    },
    onError: (error) => {
      toast.error("Failed to send verification email. Please try again.");
      console.error("Resend verification error:", error);
    },
  });

  useEffect(() => {
    if (token) {
      verifyEmailMutation.mutate(token);
    } else {
      setVerificationStatus("error");
    }
  }, [token]);

  const handleResendVerification = () => {
    if (userEmail) {
      resendVerificationMutation.mutate(userEmail);
    }
  };

  const handleGoToLogin = () => {
    navigate("/");
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard", { state: { isNewUser } });
  };

  if (verificationStatus === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Verifying Email...
              </h2>
              <p className="text-muted-foreground">
                Please wait while we verify your email address.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Email Verified!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your email has been successfully verified. You can now access
                your account.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 text-sm">
                  Redirecting to dashboard in <span className="font-bold text-lg">{countdown}</span> seconds...
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleGoToLogin}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Go to Login
                </Button>
                <Button
                  onClick={handleGoToDashboard}
                  className="w-full sm:w-auto"
                >
                  Go to Dashboard Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === "expired") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Verification Link Expired
              </h2>
              <p className="text-muted-foreground mb-6">
                This verification link has expired. Please request a new
                verification email.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setShowResendModal(true)}
                  className="w-full sm:w-auto"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Request New Verification Email
                </Button>
                <Button
                  onClick={handleGoToLogin}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Go to Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Verification Failed
            </h2>
            <p className="text-muted-foreground mb-6">
              There was an error verifying your email. Please try again or
              contact support.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setShowResendModal(true)}
                className="w-full sm:w-auto"
              >
                <Mail className="h-4 w-4 mr-2" />
                Request New Verification Email
              </Button>
              <Button
                onClick={handleGoToLogin}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Go to Login
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resend Verification Modal */}
      <Dialog open={showResendModal} onOpenChange={setShowResendModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-500" />
              <DialogTitle>Request New Verification Email</DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              Enter your email address to receive a new verification link.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowResendModal(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleResendVerification}
              disabled={resendVerificationMutation.isPending || !userEmail}
              className="w-full sm:w-auto"
            >
              {resendVerificationMutation.isPending ? (
                "Sending..."
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Verification Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
