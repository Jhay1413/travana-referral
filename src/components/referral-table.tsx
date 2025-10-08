import { useFetchReferrals } from "@/hooks/useReferral";
import { referralTableColumns } from "./referral-column";
import { useUser } from "@/hooks/useUser";
import { DataTable } from "./ui/data-table";
import { useMemo, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ReferralTable = () => {
  const { userId } = useUser();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const {
    data: referrals = [],
    isLoading,
    error,
  } = useFetchReferrals({
    id: userId || "",
    options: {
      queryKey: ["referrals", userId],
      enabled: !!userId,
    },
  });

  const columns = useMemo(() => referralTableColumns(), []);

  // Filter referrals based on time period
  const filteredReferrals = useMemo(() => {
    if (timeFilter === "all") {
      return referrals;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return referrals.filter((referral) => {
      const referralDate = new Date(referral.createdAt);
      
      switch (timeFilter) {
        case "today":
          return referralDate >= today;
        case "thisWeek":
          return referralDate >= startOfWeek;
        case "thisMonth":
          return referralDate >= startOfMonth;
        default:
          return true;
      }
    });
  }, [referrals, timeFilter]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card className="flex flex-col gap-0">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <CardTitle>Recent Referrals</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="text-xs">
              {filteredReferrals.length} Active
            </Badge>
          </div>
        </div>
        <CardDescription>
          Your recent referral commissions and status
        </CardDescription>
      </CardHeader>
      <CardContent className="md:py-2 md:px-6 px-2 py-2">
        <div className="rounded-md border p-2">
          <DataTable 
            columns={columns} 
            data={filteredReferrals} 
            filterColumn="referredBy"
            searchPlaceholder="Search by referred by..."
          />
        </div>

        {filteredReferrals.length > 0 && (
          <div className="pt-4 border-t border-border">
            <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard/referrals")}>
              View All Referrals
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
