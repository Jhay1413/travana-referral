import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { Referral } from "@/types/schema";

export const referralTableColumns = (): ColumnDef<Referral>[] => [
  {
    header: () => <div className="font-bold text-black">Client</div>,
    accessorKey: "clientName",
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
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <button
          onClick={column.getToggleSortingHandler()}
          className="flex text-black font-bold items-center gap-1 w-32 text-left"
        >
          Created
          {isSorted === "asc" && <ArrowUp className="w-4 h-4 text-gray-500" />}
          {isSorted === "desc" && (
            <ArrowDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
      );
    },
    sortDescFirst: true,
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <span className="text-xs">{date.toLocaleDateString()}</span>;
    },
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.original.createdAt);
      const dateB = new Date(rowB.original.createdAt);
      return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
    },
    meta: {
      className: "hidden sm:table-cell"
    }
  },
  {
    header: () => <div className="font-bold text-black">Status</div>,
    accessorKey: "status",
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
    header: () => <div className="font-bold text-black">Commission</div>,
    accessorKey: "commission",
    cell: ({ row }) => {
      return (
        <span className="font-bold text-green-600 dark:text-green-400">
          &pound;{row.getValue("commission")}
        </span>
      );
    },
  },
];
