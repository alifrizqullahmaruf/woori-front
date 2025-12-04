// app/_common/hooks/useDividends.ts
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { apiService } from "@/app/_common/services/apiServices";
import { QUERY_KEYS } from "./queryKeys";
import { DividendsTTMData, DividendsEventsData } from "../services/api/dividends"; // import tipe

export const useAllDividendsTTM = (
  options?: Omit<UseQueryOptions<DividendsTTMData>, "queryKey" | "queryFn">,
) =>
  useQuery<DividendsTTMData>({ // Tambahkan tipe generik
    queryKey: QUERY_KEYS.ALL_DIVIDENDS_TTM,
    queryFn: () => apiService.dividends.getAllTTM(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useAllDividendsEvents = (
  options?: Omit<UseQueryOptions<DividendsEventsData>, "queryKey" | "queryFn">,
) =>
  useQuery<DividendsEventsData>({ // Tambahkan tipe generik
    queryKey: QUERY_KEYS.ALL_DIVIDENDS_EVENTS,
    queryFn: () => apiService.dividends.getAllEvents(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useDividendsTTM = (
  ticker: string,
  options?: Omit<UseQueryOptions<DividendsTTMData>, "queryKey" | "queryFn">,
) =>
  useQuery<DividendsTTMData>({ // Tambahkan tipe generik
    queryKey: QUERY_KEYS.DIVIDENDS_TTM(ticker),
    queryFn: () => apiService.dividends.getTTMByTicker(ticker),
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useDividendsEvents = (
  ticker: string,
  options?: Omit<UseQueryOptions<DividendsEventsData>, "queryKey" | "queryFn">,
) =>
  useQuery<DividendsEventsData>({ // Tambahkan tipe generik
    queryKey: QUERY_KEYS.DIVIDENDS_EVENTS(ticker),
    queryFn: () => apiService.dividends.getEventsByTicker(ticker),
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000,
    ...options,
  });