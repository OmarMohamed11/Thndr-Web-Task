import { useInfiniteQuery } from "@tanstack/react-query";
import { getTickers, getNextPage } from "../services/tickerService";
import type { TickersQueryParams } from "../types/ticker";

const defaultParams: TickersQueryParams = {
  active: true,
  limit: 100,
  sort: "ticker",
  order: "asc",
};

export function useTickers(params: TickersQueryParams = {}) {
  const mergedParams = { ...defaultParams, ...params };

  return useInfiniteQuery({
    queryKey: ["tickers", mergedParams],
    queryFn: ({ pageParam }) => {
      if (pageParam) {
        return getNextPage(pageParam);
      }
      return getTickers(mergedParams);
    },
    getNextPageParam: (lastPage) => lastPage.next_url ?? undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
