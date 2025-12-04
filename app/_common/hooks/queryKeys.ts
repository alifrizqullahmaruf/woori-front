// app/_common/hooks/queryKeys.ts
export const QUERY_KEYS = {
  ALL_FUNDAMENTALS: ["fundamentals", "all"] as const,
  ALL_OWNERSHIP: ["ownership", "all"] as const,
  ALL_COMPANIES: ["companies", "all"] as const,
  ALL_DIVIDENDS_TTM: ["dividendsTTM", "all"] as const,
  ALL_DIVIDENDS_EVENTS: ["dividendsEvents", "all"] as const,
  ALL_DAILY_PRICES: ["dailyPrices", "all"] as const,
  ALL_OUTSTANDING_SHARES: ["outstandingShares", "all"] as const,
  ALL_DAILY_FINANCIAL_METRICS: ["dailyFinancialMetrics", "all"] as const,
  ALL_REVENUE_SEGMENTS: ["revenueSegments", "all"] as const,
  FOREX_USDKRW: ["forex", "usdkrw"] as const,

  FUNDAMENTALS: (ticker: string) => ["fundamentals", ticker] as const,
  OWNERSHIP: (ticker: string) => ["ownership", ticker] as const,
  COMPANY: (ticker: string) => ["company", ticker] as const,
  DIVIDENDS_TTM: (ticker: string) => ["dividendsTTM", ticker] as const,
  DIVIDENDS_EVENTS: (ticker: string) => ["dividendsEvents", ticker] as const,
  DAILY_PRICES: (ticker: string) => ["dailyPrices", ticker] as const,
  OUTSTANDING_SHARES: (ticker: string) => ["outstandingShares", ticker] as const,
  DAILY_FINANCIAL_METRICS: (ticker: string) => ["dailyFinancialMetrics", ticker] as const,
  REVENUE_SEGMENTS: (ticker: string) => ["revenueSegments", ticker] as const,
  DAILY_PRICES_LATEST: (t: string) => ["dailyPrices", "latest", t] as const,
  COMPANY_SEARCH: (query: string, limit: number) =>
    ["companies", "search", query, limit] as const,
};
