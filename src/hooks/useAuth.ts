import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import type { RegistrationMutationSchema } from "@/lib/schemas";
import http from "@/lib/http-client";
import { useNavigate } from "react-router-dom";

type SignupData = RegistrationMutationSchema;

interface SigninData {
  email: string;
  password: string;
}

export function useAuth() {
  const navigate = useNavigate();
  const signupMutation = useMutation({
    mutationFn: async (data: SignupData) => {
      return await http.post("/api/signin/signup", data);
    },
    onSuccess: () => {
      toast.success("Account created successfully");
    },
    onError: (error) => {
      console.error("Signup error:", error);
      toast.error("Failed to create account");
    },
  });

  const signinMutation = useMutation({
    mutationFn: async (data: SigninData) => {
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
            navigate("/dashboard");
          },
          onError: (ctx) => {
            if (loadingToastId) {
              toast.dismiss(loadingToastId);
            }
            toast.error(ctx.error.message);
          },
        }
      );
      return result;
    },
  });

  const signoutMutation = useMutation({
    mutationFn: async () => {
      const loadingToastId = toast.loading("Signing out...");
      try {
        const result = await authClient.signOut();
        toast.dismiss(loadingToastId);
        toast.success("Signed out successfully");
        return result;
      } catch (error) {
        toast.dismiss(loadingToastId);
        throw error;
      }
    },
    onSuccess: () => {
      // Additional success handling if needed
    },
    onError: (error) => {
      console.error("Signout error:", error);
      toast.error("Failed to sign out");
    },
  });

  return {
    signup: signupMutation,
    signin: signinMutation,
    signout: signoutMutation,
    isLoading:
      signupMutation.isPending ||
      signinMutation.isPending ||
      signoutMutation.isPending,
  };
}
