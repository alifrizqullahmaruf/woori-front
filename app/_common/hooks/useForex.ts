import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import type { ForexData } from "@/app/_common/services/api/forex";
import { apiService } from "@/app/_common/services/apiServices";
import { QUERY_KEYS } from "./queryKeys";
import { USD_KRW_EXCHANGE_RATE } from "@/app/_common/const";

export const useForexUSDKRW = (
  options?: Omit<UseQueryOptions<ForexData>, "queryKey" | "queryFn">,
) =>
  useQuery<ForexData>({
    queryKey: QUERY_KEYS.FOREX_USDKRW,
    queryFn: () => apiService.forex.getUSDKRW(),
    staleTime: 60 * 60 * 1000, // 1 hour
    ...options,
  });

/**
 * Hook to get the current USD to KRW exchange rate
 * Returns the exchange rate from API, or falls back to the constant if API fails
 */
export const useExchangeRate = () => {
  const { data: forexData, isLoading, error } = useForexUSDKRW();

  const exchangeRate = forexData?.items?.[0]?.exchange_rate ?? USD_KRW_EXCHANGE_RATE;

  return {
    exchangeRate,
    isLoading,
    error,
    isFromAPI: !!forexData?.items?.[0]?.exchange_rate,
  };
};
