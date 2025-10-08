import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";

import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";

type Invitation = {
  id: string;
  organizationId: string;
  email: string;
  role: string;
  status: string;
};
const columns = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }: { row: { original: Invitation } }) => (
      <div>{row.original.email || "N/A"}</div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }: { row: { original: Invitation } }) => (
      <div>{row.original.role || "N/A"}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: { original: Invitation } }) => (
      <div>{row.original.status || "N/A"}</div>
    ),
  },
];

export const PendingInvitations = ({ orgId }: { orgId: string }) => {
  const { data } = useQuery({
    queryKey: ["pending-invitations", orgId],
    queryFn: async () => {
      const { data } = await authClient.organization.listInvitations({
        query: {
          organizationId: orgId,
        },
      });
      return data;
    },
  });

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Pending Invitations</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={
            data?.filter((invitation) => invitation.status === "pending") || []
          }
        />
      </CardContent>
    </Card>
  );
};
