import { apiRequest, ApiResponse } from "./index";

export interface OutstandingSharesItem {
  id: number;
  stock_id: number;
  ticker: string;
  record_date: string;
  shares_outstanding: number;
  shares_float: number | null;
  shares_authorized: number | null;
  treasury_shares: number | null;
  source: string;
  filing_document: string | null;
}

export type OutstandingSharesData = ApiResponse<OutstandingSharesItem>;

export class OutstandingSharesService {
  async getAll(): Promise<OutstandingSharesData> {
    return apiRequest("/outstanding-shares");
  }

  async getByTicker(ticker: string): Promise<OutstandingSharesData> {
    if (!ticker) throw new Error("Ticker is required");
    return apiRequest(`/outstanding-shares/${ticker.toUpperCase()}`);
  }
}

export const outstandingSharesService = new OutstandingSharesService();
