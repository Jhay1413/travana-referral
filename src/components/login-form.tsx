import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface LoginFormProps {
  onLogin?: (email: string, password: string) => void;
  onSwitchToSignup?: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showEmailVerificationModal, setShowEmailVerificationModal] =
    useState(false);
  const [userEmail, setUserEmail] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { signin } = useAuth();

  // Mutation for resending verification email
  const resendVerificationMutation = useMutation({
    mutationFn: async (email: string) => {
      await authClient.sendVerificationEmail({
        email,
      });
    },
    onSuccess: () => {
      toast.success("Verification email sent! Please check your inbox.");
      setShowEmailVerificationModal(false);
    },
    onError: (error) => {
      toast.error("Failed to send verification email. Please try again.");
      console.error("Resend verification error:", error);
    },
  });

  const signinMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      let loadingToastId: string | number | undefined;

      const result = await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onRequest: () => {
            loadingToastId = toast.loading("Signing in...");
          },
          onSuccess: () => {
            if (loadingToastId) {
              toast.dismiss(loadingToastId);
            }
            toast.success("Signed in successfully");

            // Check for redirect parameter in URL and navigate to it
            const redirectPath = searchParams.get('redirect');
            if (redirectPath) {
              navigate(decodeURIComponent(redirectPath));
            } else {
              navigate('/dashboard'); // Default redirect
            }
          },
          onError: (ctx) => {
            if (loadingToastId) {
              toast.dismiss(loadingToastId);
            }
            if (ctx.error.code == "EMAIL_NOT_VERIFIED") {
              setUserEmail(formData.email);
              setShowEmailVerificationModal(true);
            }

            toast.error(ctx.error.message);
          },
        }
      );
      return result;
    },
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    signinMutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  const handleResendVerification = () => {
    resendVerificationMutation.mutate(userEmail);
  };
  // Remove the automatic navigation - let AuthPage handle it
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              <img src="/logo2.png" alt="Logo" className="object-contain mx-auto" />
            </CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={signin.isPending}
              >
                {signin.isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?
                <Button
                  variant="link"
                  onClick={onSwitchToSignup}
                  className="p-0 h-auto ml-1"
                >
                  Sign up
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Verification Modal */}
      <Dialog
        open={showEmailVerificationModal}
        onOpenChange={setShowEmailVerificationModal}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-500" />
              <DialogTitle>Email Verification Required</DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              Your email address <strong>{userEmail}</strong> has not been
              verified yet. Please check your inbox and click the verification
              link, or request a new verification email.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowEmailVerificationModal(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            <Button
              onClick={handleResendVerification}
              disabled={resendVerificationMutation.isPending}
              className="w-full sm:w-auto"
            >
              {resendVerificationMutation.isPending ? (
                "Sending..."
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Resend Verification Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
