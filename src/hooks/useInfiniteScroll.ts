import { useCallback, useRef } from "react";

interface UseInfiniteScrollOptions {
    hasNextPage?: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    threshold?: number;
    rootMargin?: string;
}

export function useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold = 0.1,
    rootMargin = "100px",
}: UseInfiniteScrollOptions) {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useRef<HTMLDivElement | null>(null);

    const lastElementCallback = useCallback(
        (node: HTMLDivElement | null) => {
            if (isFetchingNextPage) return;
            if (observerRef.current) observerRef.current.disconnect();

            observerRef.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasNextPage) {
                        fetchNextPage();
                    }
                },
                {
                    threshold,
                    rootMargin,
                }
            );

            if (node) {
                observerRef.current.observe(node);
                lastElementRef.current = node;
            }
        },
        [isFetchingNextPage, hasNextPage, fetchNextPage, threshold, rootMargin]
    );

    return { lastElementRef: lastElementCallback };
}
