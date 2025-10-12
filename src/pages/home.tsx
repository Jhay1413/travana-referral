import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CreateReferralModal from "@/components/create-referral-modal";
import QRCodeModal from "@/components/qr-code-modal";
import { QrCode } from "lucide-react";
import type { User } from "@/types/schema";
import DashboardStats from "@/components/dashboard-stats";
// import HolidayDeals from "@/components/holiday-deals";
import ReferralLink from "@/components/referral-link";
import { ReferralRequests } from "@/components/referral-requests";
import { ReferralTable } from "@/components/referral-table";
import { useUser } from "@/hooks/useUser";
import { ChangePasswordModal } from "@/components/change-password-modal";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export default function Home() {


  const [searchParams] = useSearchParams();
  const isFirstLogin = searchParams.get("firstLogin") === "true" ? true : false;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(isFirstLogin);
  const { userId } = useUser();
  const [showQRModal, setShowQRModal] = useState(false);
  const navigate = useNavigate();
  // Extract isFirstLogin from location state


  // Show invitation modal if there are pending invitations


  useEffect(() => {
    if (isFirstLogin) {
      setShowPasswordModal(true);
    }
  }, [isFirstLogin]);

  const getWhatsAppQRUrl = () => {
    return `${import.meta.env.VITE_BETTER_AUTH_URL
      }/public-client-request?ref=${userId}`;
  };

  return (
    <>
      <div className="md:hidden bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Button
            onClick={() => setShowQRModal(true)}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-semibold"
            data-testid="button-mobile-qr-top"
          >
            <QrCode className="h-5 w-5 mr-2" />
            Show QR Code
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <DashboardStats userId={userId || ""} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mt-6 sm:mt-8">
          <div className="lg:col-span-2 order-2 lg:order-1 space-y-6 sm:space-y-8">
            <ReferralTable />
            <ReferralRequests />
            {/* <HolidayDeals /> */}
          </div>

          <div className="space-y-6 order-1 lg:order-2">
            <ReferralLink
              user={
                {
                  firstName: "Jhon",
                  lastName: "Doe",
                  referralCode: "123456",
                } as User
              }
            />
          </div>
        </div>
      </div>

      {/* Create Referral Modal */}
      {showCreateModal && (
        <CreateReferralModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            // Refresh the page to show updated data
            window.location.reload();
          }}
        />
      )}

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        whatsappUrl={getWhatsAppQRUrl()}
        userName={"Jhon Doe"}
      />

      {/* <PendingInvitationModal
        isOpen={showInvitationModal}
        onClose={() => setShowInvitationModal(false)}
        invitations={invitations?.data || []}
      />
*/}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={() => {
          navigate("/dashboard");
        }}
      />
    </>
  );
}
