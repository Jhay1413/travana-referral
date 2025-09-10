import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, Eye, Edit, Phone, Calendar } from 'lucide-react';
import type { RefferalRequest } from '@/types/schema';

export const referralRequestColumns = (): ColumnDef<RefferalRequest>[] => [
  {
    header: () => <div className="font-bold text-black">Client</div>,
    accessorKey: 'referredName',
    cell: ({ row }) => {
      const referral = row.original;
      const getInitials = (name: string) => {
        return name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2);
      };

      return (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {getInitials(referral.referredName)}
            </span>
          </div>
          <div>
            <div className="font-semibold text-foreground">
              {referral.referredName}
            </div>
            <div className="text-sm text-muted-foreground">
              {referral.referredEmail}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    header: () => <div className="font-bold text-black">Contact</div>,
    accessorKey: 'referredPhoneNumber',
    cell: ({ row }) => {
      const phone = row.getValue('referredPhoneNumber') as string | null;
      return (
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {phone || 'N/A'}
          </span>
        </div>
      );
    },
  },
  {
    header: () => <div className="font-bold text-black">Status</div>,
    accessorKey: 'referredStatus',
    cell: ({ row }) => {
      const status = row.getValue('referredStatus') as string;
      const getStatusColor = (status: string) => {
        switch (status) {
          case 'PENDING':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
          case 'APPROVED':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
          case 'REJECTED':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
          default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
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
    header: () => <div className="font-bold text-black">Notes</div>,
    accessorKey: 'notes',
    cell: ({ row }) => {
      const notes = row.getValue('notes') as string | null;
      return (
        <div className="max-w-[200px] truncate text-sm text-muted-foreground">
          {notes || 'No notes'}
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
          {isSorted === 'asc' && <ArrowUp className="w-4 h-4 text-gray-500" />}
          {isSorted === 'desc' && <ArrowDown className="w-4 h-4 text-gray-500" />}
        </button>
      );
    },
    sortDescFirst: true,
    accessorKey: 'createdAt',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {date.toLocaleDateString()}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.original.createdAt);
      const dateB = new Date(rowB.original.createdAt);
      return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
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
          Updated
          {isSorted === 'asc' && <ArrowUp className="w-4 h-4 text-gray-500" />}
          {isSorted === 'desc' && <ArrowDown className="w-4 h-4 text-gray-500" />}
        </button>
      );
    },
    sortDescFirst: true,
    accessorKey: 'updatedAt',
    cell: ({ row }) => {
      const date = new Date(row.getValue('updatedAt'));
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {date.toLocaleDateString()}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.original.updatedAt);
      const dateB = new Date(rowB.original.updatedAt);
      return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
    },
  },
  {
    header: () => (
      <div className="font-bold text-black text-right">Actions</div>
    ),
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              console.log('View referral request:', row.original);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit referral request:', row.original);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
