import { apiRequest, ApiResponse } from "./index";

export interface ForexItem {
  id: number;
  currency_pair: string;
  exchange_rate: number;
  rate_date: string;
  source: string;
  last_updated: string;
}

export type ForexData = ApiResponse<ForexItem>;

export class ForexService {
  async getUSDKRW(): Promise<ForexData> {
    return apiRequest("/forex/usdkrw");
  }

  async getByCurrencyPair(currencyPair: string): Promise<ForexData> {
    if (!currencyPair) throw new Error("Currency pair is required");
    return apiRequest(`/forex/${currencyPair.toLowerCase()}`);
  }
}

export const forexService = new ForexService();
