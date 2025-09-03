import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { Edit2, Check, X } from "lucide-react";
import {
  referralStatusLabels,
  type Referral,
  type ReferralStatus,
} from "@/types/schema";
import { toast } from "sonner";

interface ReferralStatusUpdateProps {
  referral: Referral;
  compact?: boolean;
}

export default function ReferralStatusUpdate({
  referral,
  compact = false,
}: ReferralStatusUpdateProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    referral.status as ReferralStatus
  );
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: ReferralStatus) => {
      return apiRequest(`/api/referrals/${referral.id}/status`, "PUT", {
        status: newStatus,
      });
    },
    onSuccess: () => {
      toast.success("Referral status updated successfully");

      toast.error("Failed to update status");
      queryClient.invalidateQueries({ queryKey: ["/api/referrals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setIsEditing(false);
    },
    onError: () => {
      toast.error("Failed to update status");

      toast.error("Failed to update status");
    },
  });

  const getStatusColor = (status: ReferralStatus) => {
    switch (status) {
      case "enquiry":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "quote_in_progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "quote_ready":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "awaiting_decision":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "booked":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "lost":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const handleSave = () => {
    if (selectedStatus !== referral.status) {
      updateStatusMutation.mutate(selectedStatus);
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setSelectedStatus(referral.status as ReferralStatus);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Select
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value as ReferralStatus)}
        >
          <SelectTrigger
            className={`${
              compact ? "h-8 text-xs" : "h-9 text-sm"
            } min-w-[140px]`}
            data-testid={`select-status-${referral.id}`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(referralStatusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-1">
          <Button
            size={compact ? "sm" : "default"}
            variant="ghost"
            onClick={handleSave}
            disabled={updateStatusMutation.isPending}
            className={`${
              compact ? "h-8 w-8 p-0" : "h-9 w-9 p-0"
            } text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30`}
            data-testid={`button-save-status-${referral.id}`}
          >
            <Check className={`${compact ? "h-3 w-3" : "h-4 w-4"}`} />
          </Button>

          <Button
            size={compact ? "sm" : "default"}
            variant="ghost"
            onClick={handleCancel}
            disabled={updateStatusMutation.isPending}
            className={`${
              compact ? "h-8 w-8 p-0" : "h-9 w-9 p-0"
            } text-gray-600 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-900/30`}
            data-testid={`button-cancel-status-${referral.id}`}
          >
            <X className={`${compact ? "h-3 w-3" : "h-4 w-4"}`} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge
        className={`${getStatusColor(referral.status as ReferralStatus)} ${
          compact ? "text-xs" : "text-sm"
        }`}
        data-testid={`badge-status-${referral.id}`}
      >
        {compact
          ? referralStatusLabels[referral.status as ReferralStatus].split(
              " "
            )[0]
          : referralStatusLabels[referral.status as ReferralStatus]}
      </Badge>

      <Button
        size={compact ? "sm" : "default"}
        variant="ghost"
        onClick={() => setIsEditing(true)}
        className={`${
          compact ? "h-8 w-8 p-0" : "h-9 w-9 p-0"
        } text-muted-foreground hover:text-foreground`}
        data-testid={`button-edit-status-${referral.id}`}
      >
        <Edit2 className={`${compact ? "h-3 w-3" : "h-4 w-4"}`} />
      </Button>
    </div>
  );
}
