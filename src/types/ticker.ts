export interface Ticker {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange?: string;
  type?: string;
  active: boolean;
  currency_name?: string;
  currency_symbol?: string;
  base_currency_symbol?: string;
  base_currency_name?: string;
  last_updated_utc?: string;
  delisted_utc?: string;
}

export interface TickersResponse {
  results?: Ticker[];
  status?: string;
  next_url?: string;
  count?: number;
  request_id?: string;
}

export interface TickersQueryParams {
  ticker?: string;
  type?: string;
  market?: string;
  exchange?: string;
  cusip?: string;
  cik?: string;
  date?: string;
  search?: string;
  active?: boolean;
  order?: "asc" | "desc";
  limit?: number;
  sort?: string;
}
