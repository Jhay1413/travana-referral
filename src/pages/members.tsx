import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Plus, Users } from "lucide-react";

import { useMembers, type Member } from "@/hooks/useMembers";
import { AddMemberModal } from "@/components/add-member-modal";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { PendingInvitations } from "@/components/pending-invitations";
import { queryClient } from "@/lib/queryClient";

const columns = [
  {
    accessorKey: "Name",
    header: "Agent(Owners) / Referrers",
    cell: ({ row }: { row: { original: Member } }) => (
      <div>{row.original.name || "N/A"}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }: { row: { original: Member } }) => (
      <div>{row.original.email || "N/A"}</div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }: { row: { original: Member } }) => (
      <div>{row.original.role || "N/A"}</div>
    ),
  },
  {
    accessorKey: "totalReferred",
    header: "Total Referral",
    cell: ({ row }: { row: { original: Member } }) => (
      <div>{row.original.totalReferred}</div>
    ),
  },
  {
    accessorKey: "lastReferred",
    header: "Last Referred",
    cell: ({ row }: { row: { original: Member } }) => (
      <div>{row.original.lastReferred || "N/A"}</div>
    ),
  },
];

export default function MembersPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { members, isLoading } = useMembers();

  const { mutate: addMemberMutation, isPending } = useMutation({
    mutationFn: async (email: string) => {
      await authClient.organization.inviteMember({
        email: email,
        role: "member",
        organizationId: members[0]?.organizationId || "",
      });
    },
    onSuccess: () => {
      toast.success("Member added successfully");
      setShowAddModal(false);
    },
    onError: () => {
      toast.error("Failed to add member");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["pending-invitations", members[0]?.organizationId || ""],
      });
    },
  });

  // const handleAddMember = (data: {
  //   firstName: string;
  //   lastName: string;
  //   email: string;
  //   contactNumber: string;
  // }) => {
  //   addMember.mutate(
  //     {
  //       email: data.email,
  //       role: "member",
  //       organizationId: members[0]?.organizationId || "",
  //       firstName: data.firstName,
  //       lastName: data.lastName,
  //       contactNumber: data.contactNumber,
  //     },
  //     {
  //       onSuccess: () => {
  //         setShowAddModal(false);
  //         // Refresh the page to show updated data
  //         toast.success("Member added successfully");
  //       },
  //       onError: () => {
  //         toast.error("Failed to add member");
  //       },
  //     }
  //   );
  // };
  const handleAddMember = (email: string) => {
    addMemberMutation(email);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading members...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Members
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your team members and their access
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          data-testid="button-add-member"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {members?.filter((member) => member.role === "owner").length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Complete Profiles
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Members</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={members || []} />
        </CardContent>
      </Card>
      <PendingInvitations orgId={members[0]?.organizationId || ""} />

      {/* Add Member Modal */}
      {showAddModal && (
        <AddMemberModal
          isLoading={isPending}
          onClose={() => setShowAddModal(false)}
          addMember={handleAddMember}
          onSuccess={() => {
            setShowAddModal(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
