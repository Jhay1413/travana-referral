import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, TrendingUp } from "lucide-react";
import { useFetchReferrals } from "@/hooks/useReferral";
import { useUser } from "@/hooks/useUser";

export default function RecentReferrals() {
  const { userId } = useUser();
  const {
    data: referrals = [],
    isLoading,
    error,
  } = useFetchReferrals(userId || "");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in inquiry":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "in quote":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "in booking":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";

      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <CardTitle>Recent Referrals</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              Loading...
            </Badge>
          </div>
          <CardDescription>
            Your recent referral commissions and status
          </CardDescription>
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <CardTitle>Recent Referrals</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              Error
            </Badge>
          </div>
          <CardDescription>
            Your recent referral commissions and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Failed to load referral data
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <CardTitle>Recent Referrals</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              0 Active
            </Badge>
          </div>
          <CardDescription>
            Your recent referral commissions and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No referrals yet</h3>
            <p className="text-muted-foreground mb-4">
              Start referring clients to see your commissions here.
            </p>
            <Button>Create Referral</Button>
          </div>
        </CardContent>
      </Card>
    );
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
        <div className="space-y-3">
          {referrals.slice(0, 5).map((referral) => (
            <div
              key={referral.id}
              className="group p-4 rounded-xl border border-border/50 hover:border-border hover:bg-muted/20 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white font-bold text-base">
                    {getInitials(referral.clientName)}
                  </span>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-foreground text-base truncate">
                          {referral.clientName}
                        </h4>
                        <Badge
                          className={`${getStatusColor(
                            referral.status
                          )} text-xs font-medium px-2 py-1`}
                        >
                          {referral.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>
                            {new Date(referral.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Commission Info */}
                    <div className="text-right ml-4 flex-shrink-0">
                      <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 min-w-[120px]">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          £{referral.commission.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Potential: {referral.potentialCommission.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row - Last Updated & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        Updated{" "}
                        {new Date(referral.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 px-3"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 px-3"
                      >
                        Update Status
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
                View All Referrals
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
