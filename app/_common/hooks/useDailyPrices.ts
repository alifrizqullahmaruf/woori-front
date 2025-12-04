import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import type { DailyPricesData } from "@/app/_common/services/api/dailyPrices";
import { apiService } from "@/app/_common/services/apiServices";
import { QUERY_KEYS } from "./queryKeys";

export const useAllDailyPrices = (
  options?: Omit<UseQueryOptions<DailyPricesData>, "queryKey" | "queryFn">,
) =>
  useQuery<DailyPricesData>({
    queryKey: QUERY_KEYS.ALL_DAILY_PRICES,
    queryFn: () => apiService.dailyPrices.getAll(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useDailyPrices = (
  ticker: string,
  options?: Omit<UseQueryOptions<DailyPricesData>, "queryKey" | "queryFn">,
) =>
  useQuery<DailyPricesData>({
    queryKey: QUERY_KEYS.DAILY_PRICES(ticker),
    queryFn: () => apiService.dailyPrices.getByTicker(ticker),
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

// hooks/useDailyPrices.ts
export const useDailyPricesLatest = (
  ticker: string,
  options?: Omit<UseQueryOptions<DailyPricesData>, "queryKey" | "queryFn">
) =>
  useQuery<DailyPricesData>({
    queryKey: QUERY_KEYS.DAILY_PRICES_LATEST(ticker),               
    queryFn: () => apiService.dailyPrices.getByTickerLatest(ticker), 
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
