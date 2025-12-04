import { apiRequest, ApiResponse } from "./index";

export interface FundamentalsItem {
  id: number;
  stock_id: number;
  ticker: string;
  fiscal_year: number;
  fiscal_period: string;
  report_date: string;
  metric_type: string;
  metric_value: number;
  currency: string;
  source: string;
  source_document: string | null;
  last_updated_source: string;
}

export type FundamentalsData = ApiResponse<FundamentalsItem>;

export class FundamentalsService {
  async getAll(): Promise<FundamentalsData> {
    return apiRequest("/fundamentals");
  }

  async getByTicker(ticker: string): Promise<FundamentalsData> {
    if (!ticker) throw new Error("Ticker is required");
    return apiRequest(`/fundamentals/${ticker.toUpperCase()}`);
  }
}

export const fundamentalsService = new FundamentalsService();
