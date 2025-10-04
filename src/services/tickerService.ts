import { apiClient, fetchFromUrl } from "./api";
import type { TickersResponse, TickersQueryParams } from "../types/ticker";

export async function getTickers(
  params: TickersQueryParams
): Promise<TickersResponse> {
  return apiClient<TickersResponse>(
    "/v3/reference/tickers",
    params as Record<string, string | number | boolean | undefined>
  );
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
