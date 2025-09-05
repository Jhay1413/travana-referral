import { http } from "@/lib/http-client";
import type { Referral, Referrals } from "@/types/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUser } from "./useUser";

export const useFetchReferrals = (id: string) => {
  const { data, isLoading, error } = useQuery<Referrals[], Error>({
    queryKey: ["requests", id],
    queryFn: () => http.get(`/api/referral/${id}`),
    enabled: !!id,
  });
  return { data, isLoading, error };
};
export function useReferral() {
  const queryClient = useQueryClient();
    const {userId} = useUser();
  const {
    mutate: createReferral,
    isPending,
    data,
    error,
  } = useMutation({
    mutationFn: async (data: Referral) => {
      console.log(data);
      return await http.post("/api/referral/", data);
    },
    onSuccess: (response) => {
      toast.success("Referral created successfully");
      queryClient.invalidateQueries({ queryKey: ["requests", userId] });
      return response;
    },
    onError: (error) => {
      console.error("Referral creation failed:", error);
      toast.error("Failed to create referral");
    },
  });

  return {
    createReferral,
    isPending,
    data,
    error,
  };
}
