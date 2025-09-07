import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Mail, Phone, Clock } from "lucide-react";
import { useFetchReferralRequests } from "@/hooks/useReferral";
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
  } = useFetchReferralRequests(userId || "");

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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <CardTitle>Referral Requests</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {referrals.length} Active
          </Badge>
        </div>
        <CardDescription>
          Your sent referral requests and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {referrals.map((referral) => (
            <div
              key={referral.id}
              className="flex items-center space-x-4 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer"
            >
              {/* Avatar/Profile Image */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">
                  {referral.referredName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>

              {/* Referral Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-foreground truncate">
                        {referral.referredName}
                      </h4>
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

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">
                          {referral.referredEmail}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>{referral.referredPhoneNumber}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {referral.notes && (
                      <div className="text-xs text-muted-foreground truncate">
                        <strong>Note:</strong> {referral.notes}
                      </div>
                    )}
                  </div>

                  {/* Status and Actions */}
                  <div className="text-right ml-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(referral.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {referrals.length > 0 && (
            <div className="pt-4 border-t border-border">
              <Button variant="outline" className="w-full">
                View All Referral Requests
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
