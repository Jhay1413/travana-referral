import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useFetchReferralRequests } from "@/hooks/useReferral";
import { useUser } from "@/hooks/useUser";
import { DataTable } from "@/components/ui/data-table";
import { referralRequestColumns } from "@/components/referral-request-columns";

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

  const columns = useMemo(() => referralRequestColumns(), []);

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
        <div className="rounded-md border">
          <DataTable columns={columns} data={referrals} />
        </div>

        {referrals.length > 0 && (
          <div className="pt-4 border-t border-border">
            <Button variant="outline" className="w-full">
              View All Referral Requests
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
