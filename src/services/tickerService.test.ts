import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTickers, getNextPage, searchTickers } from "./tickerService";
import * as api from "./api";

vi.mock("./api");

describe("tickerService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getTickers", () => {
        it("should fetch tickers with default params", async () => {
            const mockResponse = {
                results: [
                    {
                        ticker: "AAPL",
                        name: "Apple Inc.",
                        market: "stocks",
                        locale: "us",
                        active: true,
                    },
                ],
                status: "OK",
            };

            vi.spyOn(api, "apiClient").mockResolvedValueOnce(mockResponse);

            const result = await getTickers();

            expect(result).toEqual(mockResponse);
            expect(api.apiClient).toHaveBeenCalledWith(
                "/v3/reference/tickers",
                {
                    market: "stocks",
                    exchange: "XNAS",
                    active: true,
                    limit: 100,
                    sort: "ticker",
                    order: "asc",
                }
            );
        });

        it("should merge custom params with defaults", async () => {
            const mockResponse = { results: [], status: "OK" };
            vi.spyOn(api, "apiClient").mockResolvedValueOnce(mockResponse);

            await getTickers({ limit: 50, search: "Apple" });

            expect(api.apiClient).toHaveBeenCalledWith(
                "/v3/reference/tickers",
                {
                    market: "stocks",
                    exchange: "XNAS",
                    active: true,
                    limit: 50,
                    sort: "ticker",
                    order: "asc",
                    search: "Apple",
                }
            );
        });

        it("should allow overriding default params", async () => {
            const mockResponse = { results: [], status: "OK" };
            vi.spyOn(api, "apiClient").mockResolvedValueOnce(mockResponse);

            await getTickers({ exchange: "XNGS", active: false });

            expect(api.apiClient).toHaveBeenCalledWith(
                "/v3/reference/tickers",
                {
                    market: "stocks",
                    exchange: "XNGS",
                    active: false,
                    limit: 100,
                    sort: "ticker",
                    order: "asc",
                }
            );
        });
    });

    describe("getNextPage", () => {
        it("should fetch next page using provided URL", async () => {
            const nextUrl =
                "https://api.polygon.io/v3/reference/tickers?cursor=abc";
            const mockResponse = {
                results: [
                    {
                        ticker: "MSFT",
                        name: "Microsoft Corporation",
                        market: "stocks",
                        locale: "us",
                        active: true,
                    },
                ],
                status: "OK",
            };

            vi.spyOn(api, "fetchFromUrl").mockResolvedValueOnce(mockResponse);

            const result = await getNextPage(nextUrl);

            expect(result).toEqual(mockResponse);
            expect(api.fetchFromUrl).toHaveBeenCalledWith(nextUrl);
        });
    });

    describe("searchTickers", () => {
        it("should search tickers with search term", async () => {
            const mockResponse = {
                results: [
                    {
                        ticker: "AAPL",
                        name: "Apple Inc.",
                        market: "stocks",
                        locale: "us",
                        active: true,
                    },
                ],
                status: "OK",
            };

            vi.spyOn(api, "apiClient").mockResolvedValueOnce(mockResponse);

            const result = await searchTickers("Apple");

            expect(result).toEqual(mockResponse);
            expect(api.apiClient).toHaveBeenCalledWith(
                "/v3/reference/tickers",
                {
                    market: "stocks",
                    exchange: "XNAS",
                    active: true,
                    limit: 100,
                    sort: "ticker",
                    order: "asc",
                    search: "Apple",
                }
            );
        });

        it("should allow custom params with search", async () => {
            const mockResponse = { results: [], status: "OK" };
            vi.spyOn(api, "apiClient").mockResolvedValueOnce(mockResponse);

            await searchTickers("Tech", { limit: 50 });

            expect(api.apiClient).toHaveBeenCalledWith(
                "/v3/reference/tickers",
                {
                    market: "stocks",
                    exchange: "XNAS",
                    active: true,
                    limit: 50,
                    sort: "ticker",
                    order: "asc",
                    search: "Tech",
                }
            );
        });
    });
});
