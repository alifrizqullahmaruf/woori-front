import { apiRequest, ApiResponse } from "./index";

export interface RevenueSegmentItem {
  id: number;
  stock_id: number;
  ticker: string;
  symbol: string;
  report_date: string;
  fiscal_year: number;
  fiscal_period: string;
  segment_type: string;
  segment_name: string;
  segment_revenue: number;
  segment_percentage: number;
  segment_operating_income: number | null;
  currency: string;
  source: string;
  filing_document: string;
}

export type RevenueSegmentsData = ApiResponse<RevenueSegmentItem>;

export class RevenueSegmentsService {
  async getAll(): Promise<RevenueSegmentsData> {
    return apiRequest("/revenue-segments?page=1&page_size=500");
  }

  async getByTicker(ticker: string): Promise<RevenueSegmentsData> {
    if (!ticker) throw new Error("Ticker is required");
    return apiRequest(`/revenue-segments/${ticker.toUpperCase()}?page=1&page_size=500`);
  }
}

export const revenueSegmentsService = new RevenueSegmentsService();
