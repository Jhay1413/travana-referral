import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { Calendar } from "lucide-react";
import type { Referral } from "@/types/schema";

export const commissionColumns = (): ColumnDef<Referral>[] => [
  {
    accessorKey: "clientName",
    header: "Client",
    cell: ({ row }) => {
      const referral = row.original;
      const getInitials = (name: string) => {
        return name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2);
      };
      return (
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
          
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
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
      return (
        <Badge
          className={`${getStatusColor(status)} text-xs font-medium px-2 py-1`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "commission",
    header: "Commission",
    cell: ({ row }) => {
      const commission = row.getValue("commission") as number;
      return (
        <div className="">
          <div className="font-bold text-green-600 dark:text-green-400">
            £{commission.toFixed(2)}
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {date.toLocaleDateString()}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {date.toLocaleDateString()}
        </div>
      );
    },
  },
];
