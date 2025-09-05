import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Mail, Phone } from "lucide-react";
import { useFetchReferrals } from "@/hooks/useReferral";
import { useUser } from "@/hooks/useUser";

interface ReferralRequestsProps {
  className?: string;
}

export function ReferralRequests({ className }: ReferralRequestsProps) {
  const { userId } = useUser();
  const {
    data: referrals = [],
    isLoading,
    error,
  } = useFetchReferrals(userId || "");


  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "APPROVED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "REJECTED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Referral Requests</CardTitle>
          <CardDescription>Your sent referral requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Referral Requests</CardTitle>
          <CardDescription>Your sent referral requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Failed to load referral requests
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!referrals || referrals.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Referral Requests</CardTitle>
          <CardDescription>Your sent referral requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              No referral requests yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Start by creating your first referral request to see them here.
            </p>
            <Button>Create Referral</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Referral Requests</CardTitle>
        <CardDescription>
          {referrals.length} referral request{referrals.length !== 1 ? "s" : ""}{" "}
          sent
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {referrals.map((referral) => (
            <div
              key={referral.id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">
                    {referral.referredName}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Request ID: {referral.id}
                  </p>
                </div>
                <Badge
                  className={
                    referral.referredStatus
                      ? getStatusColor(referral.referredStatus)
                      : ""
                  }
                >
                  {referral.referredStatus}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{referral.referredEmail}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{referral.referredPhoneNumber}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Created {new Date(referral.createdAt).toDateString() || ""}
                  </span>
                </div>
              </div>

              {referral.notes && (
                <div className="mt-3 p-3 bg-muted/30 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    <strong>Notes:</strong> {referral.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <div className="text-xs text-muted-foreground">
                  Last updated:{" "}
                  {new Date(referral.updatedAt).toDateString() || ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
