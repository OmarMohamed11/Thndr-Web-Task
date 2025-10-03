import { apiClient, fetchFromUrl } from "./api";
import type { TickersResponse, TickersQueryParams } from "../types/ticker";

export async function getTickers(
  params: TickersQueryParams = {}
): Promise<TickersResponse> {
  const defaultParams: TickersQueryParams = {
    market: "stocks",
    exchange: "XNAS",
    active: true,
    limit: 100,
    sort: "ticker",
    order: "asc",
    ...params,
  };

  return apiClient<TickersResponse>("/v3/reference/tickers", defaultParams);
}

export async function getNextPage(nextUrl: string): Promise<TickersResponse> {
  return fetchFromUrl<TickersResponse>(nextUrl);
}

export async function searchTickers(
  searchTerm: string,
  params: Omit<TickersQueryParams, "search"> = {}
): Promise<TickersResponse> {
  return getTickers({
    ...params,
    search: searchTerm,
  });
}
