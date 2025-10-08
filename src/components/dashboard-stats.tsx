// import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { useFetchReferrerStats } from "@/hooks/useReferral";

type DashboardStats = {
  totalEarnings: number;
  activeReferrals: number;
  conversionRate: number;
  pendingCommission: number;
  monthlyStats: {
    referralsSent: number;
    conversions: number;
    commission: number;
    successRate: number;
  };
};

export default function DashboardStats({ userId }: { userId: string }) {
  const { data: stats } = useFetchReferrerStats(userId);

  console.log(stats);

  // const { data: stats, isLoading } = useQuery<DashboardStats>({
  //   queryKey: ["/api/dashboard/stats"],
  //   retry: false,
  // });

  // if (isLoading) {
  //   return (
  //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
  //       {[...Array(4)].map((_, i) => (
  //         <Card key={i} className="border border-border">
  //           <CardContent className="p-4 sm:p-6">
  //             <div className="animate-pulse">
  //               <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
  //               <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
  //               <div className="h-3 bg-muted rounded w-1/3"></div>
  //             </div>
  //           </CardContent>
  //         </Card>
  //       ))}
  //     </div>
  //   );
  // }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <Card className="border border-border">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">Active Referrals</p>
              <p
                className="text-2xl sm:text-3xl font-bold text-foreground"
                data-testid="text-active-referrals"
              >
                {stats?.activeReferralsCount}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-primary text-lg sm:text-xl">👥</span>
            </div>
          </div>
          <div className="flex items-center mt-3 sm:mt-4">
            <span className="text-sm text-accent font-medium">+8</span>
            <span className="text-sm text-muted-foreground ml-1">
              this week
            </span>
          </div>
        </CardContent>
      </Card>
      <Card className="border border-border">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">
                Potential Comisison
              </p>
              <p
                className="text-2xl sm:text-3xl font-bold text-foreground"
                data-testid="text-conversion-rate"
              >
                £{stats?.potentialComission}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-chart-3/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-chart-3 text-lg sm:text-xl">📈</span>
            </div>
          </div>
          <div className="flex items-center mt-3 sm:mt-4">
            <span className="text-sm text-accent font-medium">+2.1%</span>
            <span className="text-sm text-muted-foreground ml-1">
              vs last month
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-border">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">
                Pending Commission
              </p>
              <p
                className="text-2xl sm:text-3xl font-bold text-chart-4 truncate"
                data-testid="text-pending-commission"
              >
                £{stats?.pendingReferrals.toFixed(2)}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-chart-4/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-chart-4 text-lg sm:text-xl">⏰</span>
            </div>
          </div>
          <div className="flex items-center mt-3 sm:mt-4">
            <span className="text-sm text-muted-foreground">
              0 referrals pending
            </span>
          </div>
        </CardContent>
      </Card>
      <Card className="border border-border">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">Available spend</p>
              <p
                className="text-2xl sm:text-3xl font-bold text-accent truncate"
                data-testid="text-total-earnings"
              >
                £{stats?.totalEarnings.toFixed(2)}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-accent text-lg sm:text-xl">💰</span>
            </div>
          </div>
          <div className="flex items-center mt-3 sm:mt-4">
            <span className="text-sm text-accent font-medium">+12.5%</span>
            <span className="text-sm text-muted-foreground ml-1">
              this month
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
