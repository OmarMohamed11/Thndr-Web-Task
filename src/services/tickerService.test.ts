import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTickers, getNextPage, searchTickers } from "./tickerService";
import * as api from "./api";

vi.mock("./api");

describe("tickerService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTickers", () => {
    it("should fetch tickers with provided params", async () => {
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

      const params = {
        market: "stocks",
        exchange: "XNAS",
        active: true,
        limit: 100,
        sort: "ticker",
        order: "asc" as const,
      };

      vi.spyOn(api, "apiClient").mockResolvedValueOnce(mockResponse);

      const result = await getTickers(params);

      expect(result).toEqual(mockResponse);
      expect(api.apiClient).toHaveBeenCalledWith(
        "/v3/reference/tickers",
        params
      );
    });

    it("should pass custom params directly", async () => {
      const mockResponse = { results: [], status: "OK" };
      const params = { limit: 50, search: "Apple" };
      vi.spyOn(api, "apiClient").mockResolvedValueOnce(mockResponse);

      await getTickers(params);

      expect(api.apiClient).toHaveBeenCalledWith(
        "/v3/reference/tickers",
        params
      );
    });

    it("should pass specific params directly", async () => {
      const mockResponse = { results: [], status: "OK" };
      const params = { exchange: "XNGS", active: false };
      vi.spyOn(api, "apiClient").mockResolvedValueOnce(mockResponse);

      await getTickers(params);

      expect(api.apiClient).toHaveBeenCalledWith(
        "/v3/reference/tickers",
        params
      );
    });
  });

  describe("getNextPage", () => {
    it("should fetch next page using provided URL", async () => {
      const nextUrl = "https://api.polygon.io/v3/reference/tickers?cursor=abc";
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
      expect(api.apiClient).toHaveBeenCalledWith("/v3/reference/tickers", {
        search: "Apple",
      });
    });

    it("should allow custom params with search", async () => {
      const mockResponse = { results: [], status: "OK" };
      vi.spyOn(api, "apiClient").mockResolvedValueOnce(mockResponse);

      await searchTickers("Tech", { limit: 50 });

      expect(api.apiClient).toHaveBeenCalledWith("/v3/reference/tickers", {
        limit: 50,
        search: "Tech",
      });
    });
  });
});
