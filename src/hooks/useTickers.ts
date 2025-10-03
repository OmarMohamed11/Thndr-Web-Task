import { useInfiniteQuery } from "@tanstack/react-query";
import { getTickers, getNextPage } from "../services/tickerService";
import type { TickersQueryParams } from "../types/ticker";

export function useTickers(params: TickersQueryParams = {}) {
    return useInfiniteQuery({
        queryKey: ["tickers", params],
        queryFn: ({ pageParam }) => {
            if (pageParam) {
                return getNextPage(pageParam);
            }
            return getTickers(params);
        },
        getNextPageParam: (lastPage) => lastPage.next_url ?? undefined,
        initialPageParam: undefined as string | undefined,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}
