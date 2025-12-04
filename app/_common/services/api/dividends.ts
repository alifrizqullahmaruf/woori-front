import { apiRequest, ApiResponse } from "./index";

export interface DividendsTTMItem {
  id: number;
  stock_id: number;
  ticker: string;
  metric_date: string;
  dividend_yield_ttm: number | null;
  dividend_yield_forward: number | null;
  payout_ratio_ttm: number | null;
  annual_dividend_ttm: number | null;
  dividend_growth_rate_1y: number | null;
  dividend_growth_rate_3y: number | null;
  dividend_growth_rate_5y: number | null;
  consecutive_years_paid: number;
  consecutive_years_increased: number;
  currency: string;
  source: string;
  calculation_method: string;
}

export interface DividendsEventsItem {
  id: number;
  stock_id: number;
  ticker: string;
  announcement_date: string;
  ex_dividend_date: string;
  record_date: string;
  payment_date: string;
  dividend_amount: number;
  dividend_type: string;
  frequency: string;
  currency: string;
  tax_rate: number | null;
  source: string;
  source_announcement: string | null;
}

export type DividendsTTMData = ApiResponse<DividendsTTMItem>;
export type DividendsEventsData = ApiResponse<DividendsEventsItem>;

export class DividendsService {
  async getAllTTM(): Promise<DividendsTTMData> {
    return apiRequest("/dividendsTTM");
  }

  async getTTMByTicker(ticker: string): Promise<DividendsTTMData> {
    if (!ticker) throw new Error("Ticker is required");
    return apiRequest(`/dividendsTTM/${ticker.toUpperCase()}`);
  }

  async getAllEvents(): Promise<DividendsEventsData> {
    return apiRequest("/dividends-events");
  }

  async getEventsByTicker(ticker: string): Promise<DividendsEventsData> {
    if (!ticker) throw new Error("Ticker is required");
    return apiRequest(`/dividends-events/${ticker.toUpperCase()}`);
  }
}

export const dividendsService = new DividendsService();
