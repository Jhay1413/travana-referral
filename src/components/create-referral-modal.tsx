import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useReferral } from "@/hooks/useReferral";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";

interface CreateReferralModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateReferralModal({
  onClose,
}: CreateReferralModalProps) {
  const { userId } = useUser();
  const [formData, setFormData] = useState({
    referredName: "",
    referredEmail: "",
    referredPhoneNumber: "",
    notes: "",
  });

  const { createReferral, isPending } = useReferral();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.referredName.trim() || !formData.referredEmail.trim()) {
      toast.error("Name and email are required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.referredEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    createReferral({ ...formData, referrerId: userId || "" });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!userId) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      data-testid="modal-create-referral"
    >
      <Card className="w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3
              className="text-lg sm:text-xl font-semibold text-foreground"
              data-testid="text-modal-title"
            >
              Create New Referral
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground h-10 w-10 p-0 touch-manipulation"
              data-testid="button-close-modal"
            >
              ✕
            </Button>
          </div>
        </div>

        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <Label
                htmlFor="referredName"
                className="text-sm font-medium text-foreground"
              >
                Contact Name
              </Label>
              <Input
                id="referredName"
                type="text"
                placeholder="Enter full name"
                value={formData.referredName}
                onChange={(e) =>
                  handleInputChange("referredName", e.target.value)
                }
                className="mt-2 h-12 text-base touch-manipulation"
                data-testid="input-referred-name"
                required
              />
            </div>

            <div>
              <Label
                htmlFor="referredEmail"
                className="text-sm font-medium text-foreground"
              >
                Email Address
              </Label>
              <Input
                id="referredEmail"
                type="email"
                placeholder="Enter email address"
                value={formData.referredEmail}
                onChange={(e) =>
                  handleInputChange("referredEmail", e.target.value)
                }
                className="mt-2 h-12 text-base touch-manipulation"
                data-testid="input-referred-email"
                required
              />
            </div>

            <div>
              <Label
                htmlFor="referredPhoneNumber"
                className="text-sm font-medium text-foreground"
              >
                Phone Number (Optional)
              </Label>
              <Input
                id="referredPhoneNumber"
                type="tel"
                placeholder="Enter phone number"
                value={formData.referredPhoneNumber}
                onChange={(e) =>
                  handleInputChange("referredPhoneNumber", e.target.value)
                }
                className="mt-2 h-12 text-base touch-manipulation"
                data-testid="input-referred-phone"
              />
            </div>

            <div>
              <Label
                htmlFor="notes"
                className="text-sm font-medium text-foreground"
              >
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any relevant notes..."
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="mt-2 h-24 resize-none text-base touch-manipulation"
                data-testid="textarea-notes"
              />
            </div>
          </form>
        </CardContent>

        <div className="p-4 sm:p-6 border-t border-border flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isPending}
            className="h-12 touch-manipulation order-2 sm:order-1"
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 touch-manipulation order-1 sm:order-2"
            data-testid="button-send-referral"
          >
            {isPending ? "Sending..." : "Send Referral"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
