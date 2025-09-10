import { useFetchReferrals } from "@/hooks/useReferral";
import { referralTableColumns } from "./referral-column";
import { useUser } from "@/hooks/useUser";
import { DataTable } from "./ui/data-table";
import { useMemo } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { TrendingUp } from "lucide-react";

export const ReferralTable = () => {
  const { userId } = useUser();
  const {
    data: referrals = [],
    isLoading,
    error,
  } = useFetchReferrals(userId || "");

  const columns = useMemo(() => referralTableColumns(), []);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <CardTitle>Recent Referrals</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {referrals.length} Active
          </Badge>
        </div>
        <CardDescription>
          Your recent referral commissions and status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <DataTable columns={columns} data={referrals} />
        </div>

        {referrals.length > 0 && (
          <div className="pt-4 border-t border-border">
            <Button variant="outline" className="w-full">
              View All Referrals
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
