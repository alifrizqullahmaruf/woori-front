// app/_common/hooks/useRevenueSegments.ts
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { apiService } from "@/app/_common/services/apiServices";
import { QUERY_KEYS } from "./queryKeys";
import { RevenueSegmentsData } from "../services/api/revenueSegments";

export const useAllRevenueSegments = (
  options?: Omit<UseQueryOptions<RevenueSegmentsData>, "queryKey" | "queryFn">,
) =>
  useQuery<RevenueSegmentsData>({
    queryKey: QUERY_KEYS.ALL_REVENUE_SEGMENTS,
    queryFn: () => apiService.revenueSegments.getAll(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useRevenueSegments = (
  ticker: string,
  options?: Omit<UseQueryOptions<RevenueSegmentsData>, "queryKey" | "queryFn">,
) =>
  useQuery<RevenueSegmentsData>({
    queryKey: QUERY_KEYS.REVENUE_SEGMENTS(ticker),
    queryFn: () => apiService.revenueSegments.getByTicker(ticker),
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
