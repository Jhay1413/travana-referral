import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, QrCode } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import QRCodeModal from "./qr-code-modal";
import type { User, ShareMessage } from "@/types/schema";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";

interface ReferralLinkProps {
  user: User;
}

export default function ReferralLink({ user }: ReferralLinkProps) {
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const { userId } = useUser();
  const referralUrl = `${
    import.meta.env.VITE_BETTER_AUTH_URL
  }/public-client-request?ref=${userId}`;

  // Fetch custom share messages
  const { data: shareMessages } = useQuery<ShareMessage[]>({
    queryKey: ["/api/share-messages"],
  });

  // Helper function to get custom message or fallback to default
  const getShareMessage = (platform: string) => {
    const customMessage = shareMessages?.find(
      (msg) => msg.platform === platform && msg.isActive
    );
    return customMessage;
  };

  // Helper function to process message template
  const processMessage = (template: string) => {
    return template.replace(/\[REFERRAL_LINK\]/g, referralUrl);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      toast.success("Referral link copied to clipboard");

      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareEmail = () => {
    const customMessage = getShareMessage("email");
    const subject = customMessage?.subject
      ? processMessage(customMessage.subject)
      : "Join Travana - Premium Travel Services";
    const body = customMessage
      ? processMessage(customMessage.message)
      : `Hi there!\n\nI wanted to share Travana with you - they provide amazing travel services and I think you'd love what they offer.\n\nUse my referral link to get started: ${referralUrl}\n\nBest regards!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const shareLinkedIn = () => {
    const customMessage = getShareMessage("linkedin");
    const text = customMessage
      ? processMessage(customMessage.message)
      : `Check out Travana's premium travel services! ${referralUrl}`;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        referralUrl
      )}&summary=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const shareWhatsApp = () => {
    const customMessage = getShareMessage("whatsapp");
    const message = customMessage
      ? processMessage(customMessage.message)
      : `Hi! 👋\n\nI wanted to share Travana with you - they provide amazing travel services and I think you'd love what they offer!\n\nUse my referral link to get started: ${referralUrl}\n\nLet me know if you have any questions! ✈️`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const showQRCode = () => {
    setShowQRModal(true);
  };

  const getWhatsAppQRUrl = () => {
    return `${
      import.meta.env.VITE_BETTER_AUTH_URL
    }/public-client-request?ref=${userId}`;
  };

  return (
    <Card className="border border-border">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-base sm:text-lg font-semibold text-foreground"
            data-testid="text-referral-link-title"
          >
            Your Referral Link
          </h3>
        </div>
        <div className="space-y-4">
          {/* QR Code Button - Prominent */}

          {/* URL Display with Copy Button */}
          <div className="flex items-center gap-2">
            <Input
              type="text"
              readOnly
              className="flex-1 bg-muted border border-border text-muted-foreground h-10 text-sm touch-manipulation"
              value={referralUrl}
              data-testid="input-referral-link"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={copyToClipboard}
              className="px-3 py-2 h-10 touch-manipulation min-w-[50px]"
              data-testid="button-copy-link"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>

            <Button
              onClick={showQRCode}
              className="px-3 py-2 h-10 touch-manipulation min-w-[50px]"
              data-testid="button-show-qr-prominent"
            >
              <QrCode className="" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <Button
              variant="secondary"
              className="h-12 touch-manipulation text-sm"
              onClick={shareEmail}
              data-testid="button-share-email"
            >
              <span className="mr-1 sm:mr-2">✉️</span>
              <span className="hidden sm:inline">Email</span>
              <span className="sm:hidden">Mail</span>
            </Button>
            <Button
              variant="secondary"
              className="h-12 touch-manipulation text-sm"
              onClick={shareWhatsApp}
              data-testid="button-share-whatsapp"
            >
              <span className="mr-1 sm:mr-2">💬</span>
              WhatsApp
            </Button>
            <Button
              variant="secondary"
              className="h-12 touch-manipulation text-sm"
              onClick={shareLinkedIn}
              data-testid="button-share-linkedin"
            >
              <span className="mr-1 sm:mr-2">🔗</span>
              LinkedIn
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-4">
            This Month
          </h4>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Link Clicks</span>
              <span
                className="font-semibold text-foreground"
                data-testid="text-link-clicks"
              >
                23
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Conversions</span>
              <span
                className="font-semibold text-accent"
                data-testid="text-conversions"
              >
                7
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Commission Earned
              </span>
              <span
                className="font-semibold text-accent"
                data-testid="text-commission-earned"
              >
                £840
              </span>
            </div>
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Success Rate
                </span>
                <span
                  className="font-bold text-primary"
                  data-testid="text-success-rate"
                >
                  30.4%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Modal */}
        <QRCodeModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          whatsappUrl={getWhatsAppQRUrl()}
          userName={user.firstName || user.email || "User"}
        />
      </CardContent>
    </Card>
  );
}
