import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    contactNumber: z.string().min(1, "Contact number is required"),
    password: z
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
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const { mutate: signUp } = useMutation({
    mutationFn: async (data: SignupForm) => {
      const response = await authClient.signUp.email({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phoneNumber: data.contactNumber,
        role: "member",
        name: `${data.firstName} ${data.lastName}`,
        percentageCommission: 25,
      });
      return {
        verifyToken: response.data?.token,
      };
    },
    onSuccess: () => {
      if (token) {
        acceptInvitation({
          inviteToken: token,
        });
      }
    },
    onError: (error) => {
      toast.error("Failed to create account. Please try again.");
      console.error("Signup error:", error);
      setIsLoading(false);
    },
  });

  const { mutate: acceptInvitation, isPending } = useMutation({
    mutationFn: async ({ inviteToken }: { inviteToken: string }) => {
      await authClient.organization.acceptInvitation({
        invitationId: inviteToken,
      });
    },
    onSuccess: () => {
      setIsLoading(false);
      toast.success("Account created and invitation accepted!");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error("Failed to accept invitation. Please try again.");
      console.error("Invitation acceptance error:", error);
    },
  });

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: email || "",
      contactNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    signUp(data);
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Enter your details to create a new account and start referring
            clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        disabled
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPasswords.password ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility("password")}
                        >
                          {showPasswords.password ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    {form.watch("password") && (
                      <div className="text-xs text-muted-foreground">
                        <p>Password must contain:</p>
                        <ul className="list-disc list-inside space-y-1 mt-1">
                          <li
                            className={
                              form.watch("password")?.length >= 8
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            At least 8 characters
                          </li>
                          <li
                            className={
                              /[A-Z]/.test(form.watch("password") || "")
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            One uppercase letter
                          </li>
                          <li
                            className={
                              /[a-z]/.test(form.watch("password") || "")
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            One lowercase letter
                          </li>
                          <li
                            className={
                              /\d/.test(form.watch("password") || "")
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            One number
                          </li>
                          <li
                            className={
                              /[!@#$%^&*(),.?":{}|<>]/.test(
                                form.watch("password") || ""
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={
                            showPasswords.confirmPassword ? "text" : "password"
                          }
                          placeholder="Confirm your password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            togglePasswordVisibility("confirmPassword")
                          }
                        >
                          {showPasswords.confirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    {form.watch("confirmPassword") && (
                      <div className="text-xs">
                        {form.watch("password") ===
                        form.watch("confirmPassword") ? (
                          <span className="text-green-600">
                            ✓ Passwords match
                          </span>
                        ) : (
                          <span className="text-red-600">
                            ✗ Passwords do not match
                          </span>
                        )}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading || isPending}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
