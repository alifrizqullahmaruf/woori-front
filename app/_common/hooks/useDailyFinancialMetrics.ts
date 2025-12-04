import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import type { DailyFinancialMetricsData } from "@/app/_common/services/api/dailyFinancialMetrics";
import { apiService } from "@/app/_common/services/apiServices";
import { QUERY_KEYS } from "./queryKeys";

export const useAllDailyFinancialMetrics = (
  options?: Omit<UseQueryOptions<DailyFinancialMetricsData>, "queryKey" | "queryFn">,
) =>
  useQuery<DailyFinancialMetricsData>({
    queryKey: QUERY_KEYS.ALL_DAILY_FINANCIAL_METRICS,
    queryFn: () => apiService.dailyFinancialMetrics.getAll(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useDailyFinancialMetrics = (
  ticker: string,
  options?: Omit<UseQueryOptions<DailyFinancialMetricsData>, "queryKey" | "queryFn">,
) =>
  useQuery<DailyFinancialMetricsData>({
    queryKey: QUERY_KEYS.DAILY_FINANCIAL_METRICS(ticker),
    queryFn: () => apiService.dailyFinancialMetrics.getByTicker(ticker),
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000,
    ...options,
  });