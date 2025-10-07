import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import type {
  UpdateUserProfile,
  AccountRequestSchema,
} from "@/lib/schemas";
import http from "@/lib/http-client";


interface SigninData {
  email: string;
  password: string;
}

export function useAuth() {
  const signupMutation = useMutation({
    mutationFn: async (data: AccountRequestSchema) => {
      return await http.post("/api/users/account-request", data);
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
            // Don't navigate here - let the AuthPage handle the redirect
          },
          onError: (ctx) => {
            console.log(ctx);
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

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      return await authClient.changePassword({
        newPassword: data.newPassword,
        currentPassword: data.oldPassword,
        revokeOtherSessions: true,
      });
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
    },
    onError: (error) => {
      console.error("Update password error:", error);
      toast.error("Failed to update password");
    },
  });
  const updateUserMutation = useMutation({
    mutationFn: async (data: UpdateUserProfile) => {
      return await authClient.updateUser({
        name: data.firstName + " " + data.lastName,
        phoneNumber: data.phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    },
    onSuccess: () => {
      toast.success("User updated successfully");
    },
    
    onError: (error) => {
      console.error("Update user error:", error);
      toast.error("Failed to update user");
    },
  });

  return {
    signup: signupMutation,
    signin: signinMutation,
    signout: signoutMutation,
    updatePassword: updatePasswordMutation,
    isLoading:
      signupMutation.isPending ||
      signinMutation.isPending ||
      signoutMutation.isPending ||
      updatePasswordMutation.isPending ||
      updateUserMutation.isPending,
    updateUser: updateUserMutation,
  };
}
