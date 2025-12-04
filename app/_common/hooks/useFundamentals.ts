import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import type { FundamentalsData } from "@/app/_common/services/api/fundamentals";
import { apiService } from "@/app/_common/services/apiServices";
import { QUERY_KEYS } from "./queryKeys";

export const useAllFundamentals = (
  options?: Omit<UseQueryOptions<FundamentalsData>, "queryKey" | "queryFn">,
) =>
  useQuery<FundamentalsData>({
    queryKey: QUERY_KEYS.ALL_FUNDAMENTALS,
    queryFn: () => apiService.fundamentals.getAll(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useFundamentals = (
  ticker: string,
  options?: Omit<UseQueryOptions<FundamentalsData>, "queryKey" | "queryFn">,
) =>
  useQuery<FundamentalsData>({
    queryKey: QUERY_KEYS.FUNDAMENTALS(ticker),
    queryFn: () => apiService.fundamentals.getByTicker(ticker),
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
