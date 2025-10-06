import { Card, CardContent } from "@/components/ui/card";
import { http } from "@/lib/http-client";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function InvitationPage() {
  const { token } = useParams();

  const { mutate: acceptInvitation, isPending } = useMutation({
    mutationFn: async () => {
      await http.post(`/api/auth-options/accept-invitation/${token}`);
    },
  });

  useEffect(() => {
    if (token) {
      acceptInvitation();
    }
  }, [token]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Invitation Accepted!
            </h2>
            <p className="text-muted-foreground">
              You have successfully joined the team. Welcome aboard!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
