import { useEffect, useRef } from "react";
import { useTickers } from "../hooks/useTickers";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { LoadingSpinner } from "../components/ui/loading-spinner";
import { ErrorState } from "../components/ui/error-state";
import { StockCard } from "../components/StockCard";
import { useToast } from "../hooks/use-toast";
import { Button } from "../components/ui/button";
import { RateLimitError, getRateLimitStatus } from "../services/api";

interface ExploreProps {
    readonly searchTerm: string;
}

export function Explore({ searchTerm }: ExploreProps) {
    const { toast } = useToast();

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useTickers(searchTerm ? { search: searchTerm } : {});

    const previousErrorRef = useRef<Error | null>(null);
    const hasShownToastRef = useRef(false);
    const rateLimitToastIdRef = useRef<string | null>(null);

    const { lastElementRef } = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage: () => {
            void fetchNextPage();
        },
    });

    useEffect(() => {
        if (error && data && data.pages.length > 0) {
            const isNewError = error !== previousErrorRef.current;

            if (isNewError && !hasShownToastRef.current) {
                const isRateLimit = error instanceof RateLimitError;

                if (isRateLimit) {
                    const toastResult = toast({
                        title: "Rate Limit Exceeded",
                        description:
                            "Please wait before making another request.",
                        variant: "warning",
                        action: (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    hasShownToastRef.current = false;
                                    void fetchNextPage();
                                }}
                            >
                                Retry
                            </Button>
                        ),
                    });

                    rateLimitToastIdRef.current = toastResult.id;
                } else {
                    toast({
                        title: "Error",
                        description:
                            error instanceof Error
                                ? error.message
                                : "Failed to load more stocks",
                        variant: "destructive",
                        action: (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    hasShownToastRef.current = false;
                                    void fetchNextPage();
                                }}
                            >
                                Retry
                            </Button>
                        ),
                    });
                }

                hasShownToastRef.current = true;
            }

            previousErrorRef.current = error;
        } else if (!error) {
            hasShownToastRef.current = false;
            previousErrorRef.current = null;
        }
    }, [error, data, toast, fetchNextPage]);

    useEffect(() => {
        const rateLimitStatus = getRateLimitStatus();

        if (rateLimitStatus.isRateLimited) {
            const interval = setInterval(() => {
                const currentStatus = getRateLimitStatus();
                if (currentStatus.isRateLimited) {
                    if (rateLimitToastIdRef.current) {
                        toast({
                            title: "Rate Limit Exceeded",
                            description:
                                "Please wait before making another request.",
                            variant: "warning",
                        });
                    }
                } else {
                    rateLimitToastIdRef.current = null;
                    clearInterval(interval);
                }
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        } else {
            rateLimitToastIdRef.current = null;
        }
    }, [error, toast]);

    const isSearching = searchTerm && searchTerm.length > 0;

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-center mb-2">
                        Nasdaq Stocks
                    </h1>
                    <p className="text-center text-muted-foreground">
                        Explore stocks listed on the Nasdaq exchange
                    </p>
                </div>

                <div className="flex items-center justify-center min-h-[400px]">
                    <LoadingSpinner size="lg" />
                </div>
            </div>
        );
    }

    if (isError && !data) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-center mb-2">
                        Nasdaq Stocks
                    </h1>
                    <p className="text-center text-muted-foreground">
                        Explore stocks listed on the Nasdaq exchange
                    </p>
                </div>

                <ErrorState
                    message={
                        error instanceof Error
                            ? error.message
                            : "Failed to load stocks"
                    }
                    onRetry={() => {
                        window.location.reload();
                    }}
                />
            </div>
        );
    }

    const allTickers = data
        ? data.pages.flatMap((page) => page.results || [])
        : [];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (allTickers.length === 0 && !isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-center mb-2">
                        Nasdaq Stocks
                    </h1>
                    <p className="text-center text-muted-foreground">
                        Explore stocks listed on the Nasdaq exchange
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">
                            {isSearching
                                ? "No stocks found"
                                : "No stocks available"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {isSearching
                                ? `No stocks found matching "${searchTerm}"`
                                : "There are no stocks available at the moment."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-center mb-2">
                    Nasdaq Stocks
                </h1>
                <p className="text-center text-muted-foreground">
                    Explore stocks listed on the Nasdaq exchange
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {allTickers.map((ticker, index) => {
                    const isLastElement = index === allTickers.length - 1;
                    const shouldUseInfiniteScroll = isLastElement;
                    return (
                        <div
                            key={ticker.ticker}
                            ref={
                                shouldUseInfiniteScroll ? lastElementRef : null
                            }
                        >
                            <StockCard ticker={ticker} />
                        </div>
                    );
                })}
            </div>

            {isFetchingNextPage && (
                <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <LoadingSpinner size="sm" />
                        {isSearching
                            ? "Loading more search results..."
                            : "Loading more stocks..."}
                    </div>
                </div>
            )}
        </div>
    );
}
