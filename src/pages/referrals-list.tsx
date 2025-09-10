import { useState } from "react";
import { useFetchReferrals } from "@/hooks/useReferral";
import { referralTableColumns } from "@/components/referral-column";
import { useUser } from "@/hooks/useUser";
import { DataTable } from "@/components/ui/data-table";
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
import { Input } from "@/components/ui/input";
import { TrendingUp, Search, Plus, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ReferralsListPage = () => {
  const { userId } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const {
    data: referrals = [],
    isLoading,
    error,
  } = useFetchReferrals(userId || "");

  const columns = useMemo(() => referralTableColumns(), []);

  // Filter referrals based on search and status
  const filteredReferrals = useMemo(() => {
    let filtered = referrals;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (referral) =>
          referral.clientName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          referral.transactionId
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (referral) =>
          referral.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    return filtered;
  }, [referrals, searchTerm, statusFilter]);

  const getStatusCounts = () => {
    const counts = referrals.reduce((acc, referral) => {
      const status = referral.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return counts;
  };

  const statusCounts = getStatusCounts();
  const totalCommission = referrals.reduce(
    (sum, referral) => sum + referral.commission,
    0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading referrals...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Failed to load referrals
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Referrals</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your referral commissions
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Referral
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Referrals
                  </p>
                  <p className="text-2xl font-bold">{referrals.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Commission
                  </p>
                  <p className="text-2xl font-bold">
                    £{totalCommission.toFixed(2)}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">£</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Inquiry</p>
                  <p className="text-2xl font-bold">
                    {statusCounts["in inquiry"] || 0}
                  </p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Inquiry</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Booking</p>
                  <p className="text-2xl font-bold">
                    {statusCounts["in booking"] || 0}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">Booking</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-blue-600" />
                <CardTitle>All Referrals</CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs">
                {filteredReferrals.length} of {referrals.length}
              </Badge>
            </div>
            <CardDescription>Search and filter your referrals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by client name or transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="in inquiry">In Inquiry</SelectItem>
                  <SelectItem value="in quote">In Quote</SelectItem>
                  <SelectItem value="in booking">In Booking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data Table */}
            <DataTable columns={columns} data={filteredReferrals} />

            {/* Empty State */}
            {filteredReferrals.length === 0 && referrals.length > 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No referrals found matching your filters.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {referrals.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No referrals yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start referring clients to see your commissions here.
                </p>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Referral
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
