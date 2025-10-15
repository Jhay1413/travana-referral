import { http } from "@/lib/http-client";
import type {
  Referral,
  RefferalRequest,
  ReferralRequestMutate,
  FetchReferrerStats,
} from "@/types/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUser } from "./useUser";

export const useFetchReferralRequests = (id: string) => {
  const { data, isLoading, error } = useQuery<RefferalRequest[], Error>({
    queryKey: ["requests", id],
    queryFn: () => http.get(`/api/referrals/${id}`),
    enabled: !!id,
  });
  return { data, isLoading, error };
};
export const useFetchReferrals = ({ id, options }: { id: string, options: UseQueryOptions<Referral[], Error> }) => {

  return useQuery<Referral[], Error>({
    ...options,
    queryFn: () => http.get(`/api/referrals/user/${id}`),
  });
}
export const useAgentStats = (id: string) => {
  return useQuery<{
    successRate: number,
    conversionRate: number,
  }, Error>({
    queryKey: ["agentStats", id],
    queryFn: () => http.get(`/api/referrals/user/${id}/monthly-stats`) as Promise<{
      successRate: number,
      conversionRate: number,
    }>,
  });
}
export const useFetchCommissions = (id: string) => {
  const { data, isLoading, error } = useQuery<Referral[], Error>({
    queryKey: ["commissions", id],
    queryFn: () => http.get(`/api/referrals/user/${id}/commission`),
    enabled: !!id,
  });
  return { data, isLoading, error };
};
export const useFetchReferrerStats = (id: string) => {
  const { data, isLoading, error } = useQuery<FetchReferrerStats, Error>({
    queryKey: ["referrerStats", id],
    queryFn: () => http.get(`/api/referrals/user/${id}/stats`),
    enabled: !!id,
  });
  return { data, isLoading, error };
};
export function useReferral(

) {
  const queryClient = useQueryClient();
  const { userId } = useUser();
  const {
    mutate: createReferral,
    isPending,
    data,
    error,
  } = useMutation({
    mutationFn: async (data: ReferralRequestMutate) => {
      return await http.post("/api/referrals/", data);
    },
    onSuccess: (response) => {
      toast.success("Referral created successfully");

      queryClient.invalidateQueries({ queryKey: ["requests", userId] });

      window.open("https://wa.me/447541063492?text=Hey+%F0%9F%91%8B+I%E2%80%99ve+been+recommended%21+%F0%9F%8E%89+Can+you+add+me+to+your+%F0%9F%8C%B4+VIP+WhatsApp++Group%C2%A0%F0%9F%8C%B4%C2%A0please", "_blank");

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
