import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import type { OutstandingSharesData } from "@/app/_common/services/api/outstandingShares";
import { apiService } from "@/app/_common/services/apiServices";
import { QUERY_KEYS } from "./queryKeys";

export const useAllOutstandingShares = (
  options?: Omit<UseQueryOptions<OutstandingSharesData>, "queryKey" | "queryFn">,
) =>
  useQuery<OutstandingSharesData>({
    queryKey: QUERY_KEYS.ALL_OUTSTANDING_SHARES,
    queryFn: () => apiService.outstandingShares.getAll(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useOutstandingShares = (
  ticker: string,
  options?: Omit<UseQueryOptions<OutstandingSharesData>, "queryKey" | "queryFn">,
) =>
  useQuery<OutstandingSharesData>({
    queryKey: QUERY_KEYS.OUTSTANDING_SHARES(ticker),
    queryFn: () => apiService.outstandingShares.getByTicker(ticker),
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
