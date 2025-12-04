export interface SearchHistoryItem {
  ticker: string;
  label: string;
  logo?: string;
}

export interface Company {
  ticker: string;
  company_name?: string;
  company_name_kr?: string;
  logo_url?: string;
}

export interface CompanySearchProps {
  onSelect?: (ticker: string) => void;
  placeholder?: string;
  companies?: Company[];
  isLoading?: boolean;
}
