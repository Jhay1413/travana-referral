import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Clock, TrendingUp, Eye, Edit } from "lucide-react";
import { useFetchReferrals } from "@/hooks/useReferral";
import { useUser } from "@/hooks/useUser";

export default function RecentReferrals() {
  const { userId } = useUser();
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.slice(0, 5).map((referral) => (
                <TableRow key={referral.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {getInitials(referral.clientName)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {referral.clientName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {referral.transactionId}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${getStatusColor(
                        referral.status
                      )} text-xs font-medium px-2 py-1`}
                    >
                      {referral.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-right">
                      <div className="font-bold text-green-600 dark:text-green-400">
                        £{referral.commission.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {referral.potentialCommission.toFixed(2)}% potential
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(referral.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {new Date(referral.updatedAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
}
