import { apiRequest, ApiResponse } from "./index";

export interface OwnershipItem {
  id: number;
  stock_id: number;
  ticker: string;
  as_of_date: string;
  filing_date: string;
  as_of_period_key: string | null;
  rank_in_quarter: number;
  shareholder_name: string;
  shareholder_name_kr: string | null;
  ownership_percent: number;
  shares_held: number;
  holding_value_usd: number | null;
  notes?: string | null;
}

export type OwnershipData = ApiResponse<OwnershipItem>;

export class OwnershipService {
  async getAll(): Promise<OwnershipData> {
    return apiRequest("/ownership");
  }

  async getByTicker(ticker: string): Promise<OwnershipData> {
    if (!ticker) throw new Error("Ticker is required");
    return apiRequest(`/ownership/${ticker.toUpperCase()}`);
  }
}

export const ownershipService = new OwnershipService();
