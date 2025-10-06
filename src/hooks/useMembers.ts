import { authClient } from "@/lib/auth-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import http from "@/lib/http-client";


export type Member = {
  createdAt: string;
  id: string;
  organizationId: string;
  role: string;
  user: {
    email: string;
    id: string;
    image: string;
    name: string;
  };
  userId: string;
}

export function useMembers() {

  const { data: organizations } = authClient.useListOrganizations();



  const { data: organizationId } = useQuery({
    queryKey: ["organizationId"],
    queryFn: async () => {

      const response = await http.get("/api/org/list");


      return response
    },
  });

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["members", organizations],
    queryFn: async () => {
      const response = await http.get(`/api/org/list/all/${organizationId[0].id}`);
      return response.members as Member[]
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: async (data: { email: string, role: string, organizationId: string ,firstName: string,lastName: string,contactNumber: string }) => {
      const response = await http.post(`/api/auth-options/invitation`, {
        email: data.email,
        role: data.role,
        organizationId:organizationId[0].id,
        firstName: data.firstName,
        lastName: data.lastName,
        contactNumber: data.contactNumber,
      });
      return response
    },
  });


  return {
    members: members || [],
    isLoading: membersLoading,
    addMember: addMemberMutation,
  };
}
