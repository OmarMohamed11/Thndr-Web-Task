import { useEffect, useRef, useState } from "react";
import { useTickers } from "../hooks/useTickers";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { LoadingSpinner } from "../components/ui/loading-spinner";
import { ErrorState } from "../components/ui/error-state";
import { StockCard } from "../components/StockCard";
import { useToast } from "../contexts/ToastContext";
import { RateLimitError, getRateLimitStatus } from "../services/api";

export function Explore() {
    const { showToast, updateToast } = useToast();
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useTickers();

    const previousErrorRef = useRef<Error | null>(null);
    const hasShownToastRef = useRef(false);
    const [cooldownSeconds, setCooldownSeconds] = useState<number | null>(null);
    const rateLimitToastIdRef = useRef<string | null>(null);

    const { lastElementRef } = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage: () => {
            void fetchNextPage();
        },
    });

    // Handle subsequent page fetch errors with toast
    useEffect(() => {
        if (error && data && data.pages.length > 0) {
            // Check if this is a new error (not the same as previous)
            const isNewError = error !== previousErrorRef.current;

            if (isNewError && !hasShownToastRef.current) {
                const isRateLimit = error instanceof RateLimitError;

                if (isRateLimit) {
                    const message = cooldownSeconds
                        ? `Rate limit exceeded. Please wait ${cooldownSeconds.toString()} seconds before making another request.`
                        : error.message;

                    const toastId = showToast({
                        message,
                        type: "warning",
                        onRetry: () => {
                            hasShownToastRef.current = false;
                            void fetchNextPage();
                        },
                        duration: 0, // Don't auto-dismiss during cooldown
                    });

                    rateLimitToastIdRef.current = toastId;
                } else {
                    showToast({
                        message:
                            error instanceof Error
                                ? error.message
                                : "Failed to load more stocks",
                        type: "error",
                        onRetry: () => {
                            hasShownToastRef.current = false;
                            void fetchNextPage();
                        },
                        duration: 8000,
                    });
                }

                hasShownToastRef.current = true;
            }

            previousErrorRef.current = error;
        } else if (!error) {
            // Reset the toast flag when there's no error
            hasShownToastRef.current = false;
            previousErrorRef.current = null;
        }
    }, [error, data, showToast, fetchNextPage, cooldownSeconds]);

    // Countdown timer for rate limit cooldown
    useEffect(() => {
        const rateLimitStatus = getRateLimitStatus();

        if (rateLimitStatus.isRateLimited) {
            setCooldownSeconds(rateLimitStatus.remainingCooldownSeconds);

            const interval = setInterval(() => {
                const currentStatus = getRateLimitStatus();
                if (currentStatus.isRateLimited) {
                    setCooldownSeconds(currentStatus.remainingCooldownSeconds);

                    // Update toast message with new countdown
                    if (rateLimitToastIdRef.current) {
                        updateToast(rateLimitToastIdRef.current, {
                            message: `Rate limit exceeded. Please wait ${currentStatus.remainingCooldownSeconds.toString()} seconds before making another request.`,
                        });
                    }
                } else {
                    setCooldownSeconds(null);
                    rateLimitToastIdRef.current = null;
                    clearInterval(interval);
                }
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        } else {
            setCooldownSeconds(null);
            rateLimitToastIdRef.current = null;
        }
    }, [error, updateToast, cooldownSeconds]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Handle initial load errors
    if (isError && !data) {
        return (
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
        );
    }

    const allTickers = data?.pages.flatMap((page) => page.results || []) || [];

    if (allTickers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="text-center">
                    <h3 className="text-lg font-semibold">No stocks found</h3>
                    <p className="text-sm text-muted-foreground">
                        There are no stocks available at the moment.
                    </p>
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
                    return (
                        <div
                            key={ticker.ticker}
                            ref={isLastElement ? lastElementRef : null}
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
                        Loading more stocks...
                    </div>
                </div>
            )}
        </div>
    );
}
