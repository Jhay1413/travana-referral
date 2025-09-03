import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { referralStatusLabels, type ReferralStatus } from "@/types/schema";
import { toast } from "sonner";

interface CreateReferralModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateReferralModal({ onClose, onSuccess }: CreateReferralModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    refereeName: "",
    refereeEmail: "",
    refereePhone: "",
    notes: "",
    status: "enquiry" as ReferralStatus,
  });

  const createReferralMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("/api/referrals", "POST", data);
    },
    onSuccess: () => {
      toast.success("Referral created successfully");
       
      queryClient.invalidateQueries({ queryKey: ["/api/referrals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      onSuccess();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast.error("Unauthorized");
        toast.error("You are logged out. Logging in again...");
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast.error("Failed to create referral. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.refereeName.trim() || !formData.refereeEmail.trim()) {
      toast.error("Name and email are required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.refereeEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    createReferralMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" data-testid="modal-create-referral">
      <Card className="w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground" data-testid="text-modal-title">
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
              <Label htmlFor="refereeName" className="text-sm font-medium text-foreground">
                Contact Name
              </Label>
              <Input
                id="refereeName"
                type="text"
                placeholder="Enter full name"
                value={formData.refereeName}
                onChange={(e) => handleInputChange("refereeName", e.target.value)}
                className="mt-2 h-12 text-base touch-manipulation"
                data-testid="input-referee-name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="refereeEmail" className="text-sm font-medium text-foreground">
                Email Address
              </Label>
              <Input
                id="refereeEmail"
                type="email"
                placeholder="Enter email address"
                value={formData.refereeEmail}
                onChange={(e) => handleInputChange("refereeEmail", e.target.value)}
                className="mt-2 h-12 text-base touch-manipulation"
                data-testid="input-referee-email"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="refereePhone" className="text-sm font-medium text-foreground">
                Phone Number (Optional)
              </Label>
              <Input
                id="refereePhone"
                type="tel"
                placeholder="Enter phone number"
                value={formData.refereePhone}
                onChange={(e) => handleInputChange("refereePhone", e.target.value)}
                className="mt-2 h-12 text-base touch-manipulation"
                data-testid="input-referee-phone"
              />
            </div>
            
            <div>
              <Label htmlFor="status" className="text-sm font-medium text-foreground">
                Initial Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger className="mt-2 h-12 text-base touch-manipulation" data-testid="select-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(referralStatusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-foreground">
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
            disabled={createReferralMutation.isPending}
            className="h-12 touch-manipulation order-2 sm:order-1"
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createReferralMutation.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 touch-manipulation order-1 sm:order-2"
            data-testid="button-send-referral"
          >
            {createReferralMutation.isPending ? "Sending..." : "Send Referral"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
