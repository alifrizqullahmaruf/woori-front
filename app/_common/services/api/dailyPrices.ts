import { apiRequest, ApiResponse } from "./index";

export interface DailyPricesItem {
  id: number;
  stock_id: number;
  ticker: string;
  price_date: string;
  closing_price: number;
  source: string;
  open_price: number | null;
  high_price: number | null;
  low_price: number | null;
  adjusted_close: number | null;
  percent_change: number | null;
  net_change: number | null;
  volume: number;
  market_cap: number;
  currency: string;
  source_timestamp: string;
  data_quality: string;
}

export type DailyPricesData = ApiResponse<DailyPricesItem>;

export class DailyPricesService {
  async getAll(): Promise<DailyPricesData> {
    return apiRequest("/daily-prices");
  }

  async getByTicker(ticker: string): Promise<DailyPricesData> {
    if (!ticker) throw new Error("Ticker is required");
    return apiRequest(`/daily-prices/${ticker.toUpperCase()}`);
  }

async getByTickerLatest(ticker: string): Promise<DailyPricesData> {
    if (!ticker) throw new Error("Ticker is required");

    // The endpoint returns a single DailyPricesItem object.
    const latest: DailyPricesItem = await apiRequest(
      `/daily-prices/${ticker.toUpperCase()}/latest`
    );

    // Normalize to your ApiResponse<T> shape
    return {
      page: 1,
      page_size: 1,
      total: 1,
      items: [latest],
    };
  }
}

export const dailyPricesService = new DailyPricesService();
