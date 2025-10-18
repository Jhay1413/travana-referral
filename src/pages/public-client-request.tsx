import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useReferral } from "@/hooks/useReferral";
import {
  referralRequestMutate,
  type ReferralRequestMutate,
} from "@/types/schema";
import { CheckCircle } from "lucide-react";

// Form validation schema

export const PublicClientRequest = () => {
  const [searchParams] = useSearchParams();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const ref = searchParams.get("ref");
  console.log(ref);
  const { createReferral, isPending } = useReferral();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReferralRequestMutate>({
    resolver: zodResolver(referralRequestMutate),
    defaultValues: {
      referredFirstName: "",
      referredLastName: "",
      referredEmail: null,
      referredPhoneNumber: null,
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
    createReferral(
      { ...data, referrerId: ref },
      {
        onSuccess: () => {
          setShowSuccessModal(true);
          reset();
        },
      }
    );
    // Show success modal and reset form
  };

  const onError = () => {
    console.log(errors);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center ">
            <CardTitle className="text-2xl flex  items-center justify-center font-bold text-foreground">
              <img
              src="/logo2.png"
                alt="Logo"
                className="h-18 w-auto object-contain bg-black"
              />
            </CardTitle>
            <CardDescription className="text-lg font-bold  mt-6">
              Tell us about your dream trip and we'll help make it happen!
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
                  htmlFor="referredFirstName"
                  className="text-sm font-medium text-foreground"
                >
                  First Name *
                </Label>
                <Input
                  id="referredFirstName"
                  type="text"
                  placeholder="Enter your first name"
                  className="mt-2 h-12 text-base"
                  {...register("referredFirstName")}
                />
                {errors.referredFirstName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.referredFirstName.message}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="referredLastName"
                  className="text-sm font-medium text-foreground"
                >
                  Last Name *
                </Label>
                <Input
                  id="referredLastName"
                  type="text"
                  placeholder="Enter your full name"
                  className="mt-2 h-12 text-base"
                  {...register("referredLastName")}
                />
                {errors.referredLastName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.referredLastName.message}
                  </p>
                )}
              </div>

              {/* Email */}


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
                  Additional Details (Optional)
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
                  onClick={() => { }}
                >
                  {isPending ? "Submitting..." : "Submit Travel Request"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-xl font-semibold text-center">
              Thank you for your inquiry!
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground text-center">
              Your request has been successfully submitted. Our team will review
              the details and get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button onClick={handleCloseModal} className="px-8">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
