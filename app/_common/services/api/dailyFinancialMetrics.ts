import { apiRequest, ApiResponse } from "./index";

export interface DailyFinancialMetricsItem {
  id: number;
  stock_id: number;
  ticker: string;
  metric_date: string;
  metric_type: string;
  metric_value: number;
  calculation_method: string;
  source: string;
  source_timestamp: string;
}

export type DailyFinancialMetricsData = ApiResponse<DailyFinancialMetricsItem>;

export class DailyFinancialMetricsService {
  async getAll(): Promise<DailyFinancialMetricsData> {
    return apiRequest("/daily-financial-metrics");
  }

  async getByTicker(ticker: string): Promise<DailyFinancialMetricsData> {
    if (!ticker) throw new Error("Ticker is required");
    return apiRequest(`/daily-financial-metrics/${ticker.toUpperCase()}`);
  }
}

export const dailyFinancialMetricsService = new DailyFinancialMetricsService();
