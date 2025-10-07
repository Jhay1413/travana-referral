import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, X } from "lucide-react";


type OrganizationInvitation = {
  id: string;
  email: string;
  role: "member" | "admin" | "owner";
  organizationId: string;
  status: string;
  inviterId: string;
  expiresAt: Date;
}
interface PendingInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitations: OrganizationInvitation[];
}

export function PendingInvitationModal({
  isOpen,
  onClose,
  invitations,
}: PendingInvitationModalProps) {
  const [hasShownModal, setHasShownModal] = useState(false);

  useEffect(() => {
    // Only show modal if there are pending invitations and we haven't shown it yet
    if (invitations && invitations.length > 0 && !hasShownModal) {
      setHasShownModal(true);
    }
  }, [invitations, hasShownModal]);

  const handleClose = () => {
    setHasShownModal(true); // Mark as shown so it doesn't show again
    onClose();
  };

  const handleDismiss = () => {
    setHasShownModal(true); // Mark as shown so it doesn't show again
    onClose();
  };

  return (
    <Dialog open={isOpen && invitations && invitations.length > 0} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-blue-500" />
            <DialogTitle>Organization Invitation</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            You have been invited to join an organization. Please check your email 
            to confirm your invitation and complete the setup process.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-800 font-medium">
                  Check Your Email
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  We've sent you an invitation email with instructions to join the organization.
                  Please check your inbox and follow the link to accept the invitation.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleDismiss}
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Dismiss
          </Button>
          <Button
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            <Mail className="h-4 w-4 mr-2" />
            Check Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
