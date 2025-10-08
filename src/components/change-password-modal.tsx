import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

// Password change form schema
const passwordChangeSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ChangePasswordModal({
  isOpen,
  onClose,
  onSuccess,
}: ChangePasswordModalProps) {
  const { data: session } = authClient.useSession();
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const togglePasswordVisibility = (field: "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePasswordChange = async (data: PasswordChangeFormData) => {
    setIsSubmitting(true);
    try {
      const { data: response, error } = await authClient.changePassword({
        newPassword: data.newPassword,
        currentPassword: session?.user?.phoneNumber || "", // For first-time users, they might not have a current password
        revokeOtherSessions: true,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (response) {
        toast.success("Password set successfully!");
        onSuccess?.(); // Call the success callback to clear state
        onClose();
      }
    } catch (error) {
      toast.error("Failed to set password. Please try again.");
      console.error("Password change error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-blue-500" />
            <DialogTitle>Set Your Password</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            For security reasons, please set a strong password for your account.
            This is required to complete your account setup.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handlePasswordChange)}
          className="space-y-4"
        >
          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                placeholder="Enter your new password"
                {...form.register("newPassword")}
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("new")}
                disabled={isSubmitting}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {form.watch("newPassword") && (
              <div className="text-xs text-muted-foreground">
                <p>Password must contain:</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li
                    className={
                      form.watch("newPassword")?.length >= 8
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    At least 8 characters
                  </li>
                  <li
                    className={
                      /[A-Z]/.test(form.watch("newPassword") || "")
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    One uppercase letter
                  </li>
                  <li
                    className={
                      /[a-z]/.test(form.watch("newPassword") || "")
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    One lowercase letter
                  </li>
                  <li
                    className={
                      /\d/.test(form.watch("newPassword") || "")
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    One number
                  </li>
                  <li
                    className={
                      /[!@#$%^&*(),.?":{}|<>]/.test(
                        form.watch("newPassword") || ""
                      )
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    One special character
                  </li>
                </ul>
              </div>
            )}
            {form.formState.errors.newPassword && (
              <p className="text-sm text-red-600">
                {form.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                placeholder="Confirm your new password"
                {...form.register("confirmPassword")}
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("confirm")}
                disabled={isSubmitting}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {form.watch("confirmPassword") && (
              <div className="text-xs">
                {form.watch("newPassword") === form.watch("confirmPassword") ? (
                  <span className="text-green-600">✓ Passwords match</span>
                ) : (
                  <span className="text-red-600">✗ Passwords do not match</span>
                )}
              </div>
            )}
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-600">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Skip for Now
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !form.formState.isValid}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Setting Password..." : "Set Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
