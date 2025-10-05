/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Explore } from "./Explore";
import type { Ticker } from "../types/ticker";
import { RateLimitError } from "../services/api";

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

// Mock the useToast hook
const mockToast = vi.fn();
vi.mock("../hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Mock the API service
vi.mock("../services/api", async () => {
  const actual = await vi.importActual("../services/api");
  return {
    ...actual,
    getRateLimitStatus: vi.fn(() => ({
      isRateLimited: false,
      retryAfter: 0,
    })),
  };
});

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
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
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
    mockToast.mockReturnValue({ id: "test-toast-id" });
  });

  afterEach(() => {
    vi.clearAllTimers();
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

    renderWithQueryClient(<Explore searchTerm="" />);

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

    renderWithQueryClient(<Explore searchTerm="" />);

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

    renderWithQueryClient(<Explore searchTerm="" />);

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

    renderWithQueryClient(<Explore searchTerm="" />);

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

    renderWithQueryClient(<Explore searchTerm="" />);

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

    renderWithQueryClient(<Explore searchTerm="" />);

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

    renderWithQueryClient(<Explore searchTerm="" />);

    const gridContainer = screen.getByText("AAPL").closest(".grid");
    expect(gridContainer).toHaveClass(
      "grid-cols-1",
      "sm:grid-cols-2",
      "lg:grid-cols-3",
      "xl:grid-cols-4"
    );
  });

  it("renders search-specific empty state when searching", async () => {
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

    renderWithQueryClient(<Explore searchTerm="test search" />);

    expect(screen.getByText("No stocks found")).toBeInTheDocument();
    expect(
      screen.getByText('No stocks found matching "test search"')
    ).toBeInTheDocument();
  });

  it("renders search-specific loading message when fetching next page", async () => {
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

    renderWithQueryClient(<Explore searchTerm="test search" />);

    expect(
      screen.getByText("Loading more search results...")
    ).toBeInTheDocument();
  });

  it("handles rate limit error with toast notification", async () => {
    const { useTickers } = await import("../hooks/useTickers");
    const mockUseTickers = vi.mocked(useTickers);
    const mockFetchNextPage = vi.fn();

    const rateLimitError = new RateLimitError("Rate limit exceeded");
    (mockUseTickers.mockReturnValue as any)({
      data: { pages: [{ results: mockTickers }] },
      error: rateLimitError,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
    });

    renderWithQueryClient(<Explore searchTerm="" />);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Rate Limit Exceeded",
        description: "Please wait before making another request.",
        variant: "warning",
        action: expect.any(Object),
      });
    });
  });

  it("handles generic error with toast notification", async () => {
    const { useTickers } = await import("../hooks/useTickers");
    const mockUseTickers = vi.mocked(useTickers);
    const mockFetchNextPage = vi.fn();

    const genericError = new Error("Network error");
    (mockUseTickers.mockReturnValue as any)({
      data: { pages: [{ results: mockTickers }] },
      error: genericError,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
    });

    renderWithQueryClient(<Explore searchTerm="" />);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Network error",
        variant: "destructive",
        action: expect.any(Object),
      });
    });
  });

  it("handles non-Error object in error state", async () => {
    const { useTickers } = await import("../hooks/useTickers");
    const mockUseTickers = vi.mocked(useTickers);
    const mockFetchNextPage = vi.fn();

    (mockUseTickers.mockReturnValue as any)({
      data: { pages: [{ results: mockTickers }] },
      error: "String error",
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
    });

    renderWithQueryClient(<Explore searchTerm="" />);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to load more stocks",
        variant: "destructive",
        action: expect.any(Object),
      });
    });
  });

  it("handles retry button click in rate limit toast", async () => {
    const { useTickers } = await import("../hooks/useTickers");
    const mockUseTickers = vi.mocked(useTickers);
    const mockFetchNextPage = vi.fn();

    const rateLimitError = new RateLimitError("Rate limit exceeded");
    (mockUseTickers.mockReturnValue as any)({
      data: { pages: [{ results: mockTickers }] },
      error: rateLimitError,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
    });

    renderWithQueryClient(<Explore searchTerm="" />);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalled();
    });

    // Simulate retry button click
    const toastCall = mockToast.mock.calls[0][0];
    const retryButton = toastCall.action;

    // Render the retry button and click it
    const { getByText } = render(retryButton as React.ReactElement);
    fireEvent.click(getByText("Retry"));

    expect(mockFetchNextPage).toHaveBeenCalled();
  });

  it("handles retry button click in generic error toast", async () => {
    const { useTickers } = await import("../hooks/useTickers");
    const mockUseTickers = vi.mocked(useTickers);
    const mockFetchNextPage = vi.fn();

    const genericError = new Error("Network error");
    (mockUseTickers.mockReturnValue as any)({
      data: { pages: [{ results: mockTickers }] },
      error: genericError,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
    });

    renderWithQueryClient(<Explore searchTerm="" />);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalled();
    });

    // Simulate retry button click
    const toastCall = mockToast.mock.calls[0][0];
    const retryButton = toastCall.action;

    // Render the retry button and click it
    const { getByText } = render(retryButton as React.ReactElement);
    fireEvent.click(getByText("Retry"));

    expect(mockFetchNextPage).toHaveBeenCalled();
  });

  it("does not show toast for same error twice", async () => {
    const { useTickers } = await import("../hooks/useTickers");
    const mockUseTickers = vi.mocked(useTickers);
    const mockFetchNextPage = vi.fn();

    const error = new Error("Network error");
    (mockUseTickers.mockReturnValue as any)({
      data: { pages: [{ results: mockTickers }] },
      error: error,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
    });

    const { rerender } = renderWithQueryClient(<Explore searchTerm="" />);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledTimes(1);
    });

    // Rerender with same error
    rerender(
      <QueryClientProvider client={createTestQueryClient()}>
        <Explore searchTerm="" />
      </QueryClientProvider>
    );

    // Should not show toast again for same error
    expect(mockToast).toHaveBeenCalledTimes(1);
  });

  it("resets error state when error is cleared", async () => {
    const { useTickers } = await import("../hooks/useTickers");
    const mockUseTickers = vi.mocked(useTickers);
    const mockFetchNextPage = vi.fn();

    const error = new Error("Network error");
    (mockUseTickers.mockReturnValue as any)({
      data: { pages: [{ results: mockTickers }] },
      error: error,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
    });

    const { rerender } = renderWithQueryClient(<Explore searchTerm="" />);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledTimes(1);
    });

    // Rerender with no error
    (mockUseTickers.mockReturnValue as any)({
      data: { pages: [{ results: mockTickers }] },
      error: null,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
    });

    rerender(
      <QueryClientProvider client={createTestQueryClient()}>
        <Explore searchTerm="" />
      </QueryClientProvider>
    );

    // Should be able to show toast again for new errors
    (mockUseTickers.mockReturnValue as any)({
      data: { pages: [{ results: mockTickers }] },
      error: new Error("New error"),
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
    });

    rerender(
      <QueryClientProvider client={createTestQueryClient()}>
        <Explore searchTerm="" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledTimes(2);
    });
  });

  it("handles error state with no data", async () => {
    const { useTickers } = await import("../hooks/useTickers");
    const mockUseTickers = vi.mocked(useTickers);

    const error = new Error("Failed to fetch");
    (mockUseTickers.mockReturnValue as any)({
      data: undefined,
      error: error,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
      isError: true,
    });

    renderWithQueryClient(<Explore searchTerm="" />);

    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Failed to fetch")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("handles error state with non-Error object and no data", async () => {
    const { useTickers } = await import("../hooks/useTickers");
    const mockUseTickers = vi.mocked(useTickers);

    (mockUseTickers.mockReturnValue as any)({
      data: undefined,
      error: "String error",
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
      isError: true,
    });

    renderWithQueryClient(<Explore searchTerm="" />);

    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Failed to load stocks")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("handles retry button click in error state", async () => {
    const { useTickers } = await import("../hooks/useTickers");
    const mockUseTickers = vi.mocked(useTickers);

    const error = new Error("Failed to fetch");
    (mockUseTickers.mockReturnValue as any)({
      data: undefined,
      error: error,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
      isError: true,
    });

    // Mock window.location.reload
    const mockReload = vi.fn();
    Object.defineProperty(window, "location", {
      value: { reload: mockReload },
      writable: true,
    });

    renderWithQueryClient(<Explore searchTerm="" />);

    const retryButton = screen.getByText("Try Again");
    fireEvent.click(retryButton);

    expect(mockReload).toHaveBeenCalled();
  });
});
