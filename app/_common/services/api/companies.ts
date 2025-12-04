import { apiRequest, ApiResponse } from "./index";

export interface CompanyItem {
  id: number;
  stock_id: number;
  ticker: string;
  company_name: string;
  company_name_kr: string;
  sector: string;
  industry: string;
  industry_kr: string;
  description: string;
  description_kr: string;
  ceo: string;
  ceo_kr: string;
  exchange: string;
  exchange_kr: string;
  ipo_date: string | null;
  country: string;
  employees_count: number;
  headquarters: string;
  website: string;
  source: string;
  logo_url: string;
}

export type CompaniesData = ApiResponse<CompanyItem>;

export interface CompanySearchItem {
  ticker: string;
  symbol: string;
  company_name: string;
  company_name_kr: string;
  logo_url: string;
  exchange?: string; 
}

export type CompanySearchResponse = CompanySearchItem[];

export interface SearchHistoryItem {
  ticker: string;
  label: string;
  logo?: string;
  fallbackUrl?: string;
}


export class CompaniesService {
  async getAll(): Promise<CompaniesData> {
    const pageSize = 500;
    let page = 1;
    let allItems: CompanyItem[] = [];
    let total = 0;

    while (true) {
      const res = await apiRequest<CompaniesData>(
        `/companies?page=${page}&page_size=${pageSize}`,
      );
      allItems = allItems.concat(res.items);
      total = res.total;

      if (allItems.length >= total) {
        return {
          ...res,
          page: 1,
          page_size: allItems.length,
          total,
          items: allItems,
        };
      }

      page += 1;
    }
  }

  async getByTicker(ticker: string): Promise<CompaniesData> {
    if (!ticker) throw new Error("Ticker is required");
    const res = await apiRequest<CompaniesData>(
      `/companies/${ticker.toUpperCase()}`,
    );
    return res;
  }

  async search(query: string, limit = 10): Promise<CompanySearchResponse> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const results = await apiRequest<CompanySearchResponse>(
      `/companies/search?q=${encodeURIComponent(trimmed)}&limit=${limit}`,
    );
    return results.map((item) => ({
      ...item,
    }));
  }
}

export const companiesService = new CompaniesService();