/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Explore } from "./Explore";
import type { Ticker } from "../types/ticker";

// Mock the useTickers hook
vi.mock("../hooks/useTickers", () => ({
    useTickers: vi.fn(),
}));

// Mock the useInfiniteScroll hook
vi.mock("../hooks/useInfiniteScroll", () => ({
    useInfiniteScroll: vi.fn(() => ({
        lastElementRef: vi.fn(),
    })),
}));

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

const renderWithQueryClient = (component: React.ReactElement) => {
    const queryClient = createTestQueryClient();
    return render(
        <QueryClientProvider client={queryClient}>
            {component}
        </QueryClientProvider>
    );
};

const mockTickers: Ticker[] = [
    {
        ticker: "AAPL",
        name: "Apple Inc.",
        market: "stocks",
        locale: "us",
        primary_exchange: "NASDAQ",
        type: "CS",
        active: true,
        currency_name: "us dollar",
        currency_symbol: "$",
        last_updated_utc: "2023-01-01T00:00:00Z",
    },
    {
        ticker: "MSFT",
        name: "Microsoft Corporation",
        market: "stocks",
        locale: "us",
        primary_exchange: "NASDAQ",
        type: "CS",
        active: true,
        currency_name: "us dollar",
        currency_symbol: "$",
        last_updated_utc: "2023-01-01T00:00:00Z",
    },
];

describe("Explore", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders loading state initially", async () => {
        const { useTickers } = await import("../hooks/useTickers");
        const mockUseTickers = vi.mocked(useTickers);

        (mockUseTickers.mockReturnValue as any)({
            data: undefined,
            error: null,
            fetchNextPage: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            isLoading: true,
            isError: false,
        });

        renderWithQueryClient(<Explore />);

        expect(screen.getByRole("status")).toBeInTheDocument();
        expect(screen.getByLabelText("Loading")).toBeInTheDocument();
    });

    it("renders error state when there is an error", async () => {
        const { useTickers } = await import("../hooks/useTickers");
        const mockUseTickers = vi.mocked(useTickers);

        const mockError = new Error("Failed to fetch stocks");
        (mockUseTickers.mockReturnValue as any)({
            data: undefined,
            error: mockError,
            fetchNextPage: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            isLoading: false,
            isError: true,
        });

        renderWithQueryClient(<Explore />);

        expect(screen.getByText("Error")).toBeInTheDocument();
        expect(screen.getByText("Failed to fetch stocks")).toBeInTheDocument();
        expect(screen.getByText("Try Again")).toBeInTheDocument();
    });

    it("renders empty state when no stocks are available", async () => {
        const { useTickers } = await import("../hooks/useTickers");
        const mockUseTickers = vi.mocked(useTickers);

        (mockUseTickers.mockReturnValue as any)({
            data: { pages: [] },
            error: null,
            fetchNextPage: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            isLoading: false,
            isError: false,
        });

        renderWithQueryClient(<Explore />);

        expect(screen.getByText("No stocks available")).toBeInTheDocument();
        expect(
            screen.getByText("There are no stocks available at the moment.")
        ).toBeInTheDocument();
    });

    it("renders stock list when data is available", async () => {
        const { useTickers } = await import("../hooks/useTickers");
        const mockUseTickers = vi.mocked(useTickers);

        (mockUseTickers.mockReturnValue as any)({
            data: { pages: [{ results: mockTickers }] },
            error: null,
            fetchNextPage: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            isLoading: false,
            isError: false,
        });

        renderWithQueryClient(<Explore />);

        expect(screen.getByText("Nasdaq Stocks")).toBeInTheDocument();
        expect(
            screen.getByText("Explore stocks listed on the Nasdaq exchange")
        ).toBeInTheDocument();
        expect(screen.getByText("AAPL")).toBeInTheDocument();
        expect(screen.getByText("Apple Inc.")).toBeInTheDocument();
        expect(screen.getByText("MSFT")).toBeInTheDocument();
        expect(screen.getByText("Microsoft Corporation")).toBeInTheDocument();
    });

    it("renders loading indicator when fetching next page", async () => {
        const { useTickers } = await import("../hooks/useTickers");
        const mockUseTickers = vi.mocked(useTickers);

        (mockUseTickers.mockReturnValue as any)({
            data: { pages: [{ results: mockTickers }] },
            error: null,
            fetchNextPage: vi.fn(),
            hasNextPage: true,
            isFetchingNextPage: true,
            isLoading: false,
            isError: false,
        });

        renderWithQueryClient(<Explore />);

        expect(screen.getByText("Loading more stocks...")).toBeInTheDocument();
        expect(screen.getByLabelText("Loading")).toBeInTheDocument();
    });

    it("handles multiple pages of data correctly", async () => {
        const { useTickers } = await import("../hooks/useTickers");
        const mockUseTickers = vi.mocked(useTickers);

        const page1Tickers = [mockTickers[0]];
        const page2Tickers = [mockTickers[1]];

        (mockUseTickers.mockReturnValue as any)({
            data: {
                pages: [{ results: page1Tickers }, { results: page2Tickers }],
            },
            error: null,
            fetchNextPage: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            isLoading: false,
            isError: false,
        });

        renderWithQueryClient(<Explore />);

        // Should render all tickers from both pages
        expect(screen.getByText("AAPL")).toBeInTheDocument();
        expect(screen.getByText("MSFT")).toBeInTheDocument();
    });

    it("applies correct grid layout classes", async () => {
        const { useTickers } = await import("../hooks/useTickers");
        const mockUseTickers = vi.mocked(useTickers);

        (mockUseTickers.mockReturnValue as any)({
            data: { pages: [{ results: mockTickers }] },
            error: null,
            fetchNextPage: vi.fn(),
            hasNextPage: false,
            isFetchingNextPage: false,
            isLoading: false,
            isError: false,
        });

        renderWithQueryClient(<Explore />);

        const gridContainer = screen.getByText("AAPL").closest(".grid");
        expect(gridContainer).toHaveClass(
            "grid-cols-1",
            "sm:grid-cols-2",
            "lg:grid-cols-3",
            "xl:grid-cols-4"
        );
    });
});
