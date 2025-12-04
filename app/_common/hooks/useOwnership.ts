import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import type { OwnershipData } from "@/app/_common/services/api/ownership";
import { apiService } from "@/app/_common/services/apiServices";
import { QUERY_KEYS } from "./queryKeys";

export const useAllOwnership = (
  options?: Omit<UseQueryOptions<OwnershipData>, "queryKey" | "queryFn">,
) =>
  useQuery<OwnershipData>({
    queryKey: QUERY_KEYS.ALL_OWNERSHIP,
    queryFn: () => apiService.ownership.getAll(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useOwnership = (
  ticker: string,
  options?: Omit<UseQueryOptions<OwnershipData>, "queryKey" | "queryFn">,
) =>
  useQuery<OwnershipData>({
    queryKey: QUERY_KEYS.OWNERSHIP(ticker),
    queryFn: () => apiService.ownership.getByTicker(ticker),
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000,
    ...options,
  });