import { http } from "@/lib/http-client";
import type {
  Referral,
  RefferalRequest,
  ReferralRequestMutate,
  FetchReferrerStats,
} from "@/types/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUser } from "./useUser";

export const useFetchReferralRequests = (id: string) => {
  const { data, isLoading, error } = useQuery<RefferalRequest[], Error>({
    queryKey: ["requests", id],
    queryFn: () => http.get(`/api/referral/${id}`),
    enabled: !!id,
  });
  return { data, isLoading, error };
};  
export const useFetchReferrals = (id: string) => {
  const { data, isLoading, error } = useQuery<Referral[], Error>({
    queryKey: ["referrals", id],
    queryFn: () => http.get(`/api/referral/${id}/referrals`),
    enabled: !!id,
  });
  return { data, isLoading, error };
};
export const useFetchReferrerStats = (id: string) => {
  const { data, isLoading, error } = useQuery<FetchReferrerStats, Error>({
    queryKey: ["referrerStats", id],
    queryFn: () => http.get(`/api/referral/${id}/stats`),
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
