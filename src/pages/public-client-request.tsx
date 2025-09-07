import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useReferral } from "@/hooks/useReferral";
import {
  referralRequestMutate,
  type ReferralRequestMutate,
} from "@/types/schema";

// Form validation schema

export const PublicClientRequest = () => {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref");
  console.log(ref);
  const { createReferral, isPending } = useReferral();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReferralRequestMutate>({
    resolver: zodResolver(referralRequestMutate),
    defaultValues: {
      referredName: "",
      referredEmail: "",
      referredPhoneNumber: "",
      notes: "",
      referrerId: ref || "",
    },
  });

  const onSubmit = (data: ReferralRequestMutate) => {
    // Add referral code to the data
    if (!ref) {
      toast.error("Referral code is required");
      return;
    }
    createReferral({ ...data, referrerId: ref });
  };
  const onError = () => {
    console.log(errors);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              Travel Request Form
            </CardTitle>
            <CardDescription>
              {ref ? (
                <span className="text-primary font-medium">
                  Referred by: {ref}
                </span>
              ) : (
                "Tell us about your dream trip and we'll help make it happen!"
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="space-y-4 sm:space-y-5"
            >
              {/* Client Name */}
              <div>
                <Label
                  htmlFor="referredName"
                  className="text-sm font-medium text-foreground"
                >
                  Full Name *
                </Label>
                <Input
                  id="referredName"
                  type="text"
                  placeholder="Enter your full name"
                  className="mt-2 h-12 text-base"
                  {...register("referredName")}
                />
                {errors.referredName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.referredName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label
                  htmlFor="referredEmail"
                  className="text-sm font-medium text-foreground"
                >
                  Email Address *
                </Label>
                <Input
                  id="referredEmail"
                  type="email"
                  placeholder="Enter your email address"
                  className="mt-2 h-12 text-base"
                  {...register("referredEmail")}
                />
                {errors.referredEmail && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.referredEmail.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <Label
                  htmlFor="referredPhoneNumber"
                  className="text-sm font-medium text-foreground"
                >
                  Phone Number
                </Label>
                <Input
                  id="referredPhoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="mt-2 h-12 text-base"
                  {...register("referredPhoneNumber")}
                />
                {errors.referredPhoneNumber && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.referredPhoneNumber.message}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div>
                <Label
                  htmlFor="notes"
                  className="text-sm font-medium text-foreground"
                >
                  Additional Details
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Tell us more about your travel preferences, interests, or special requirements..."
                  className="mt-2 h-24 resize-none text-base"
                  {...register("notes")}
                />
                {errors.notes && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.notes.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold"
                  disabled={isPending}
                  onClick={() => {}}
                >
                  {isPending ? "Submitting..." : "Submit Travel Request"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
