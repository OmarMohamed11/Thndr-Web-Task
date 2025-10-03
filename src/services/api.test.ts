import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient, fetchFromUrl, ApiError } from "./api";

global.fetch = vi.fn();

describe("apiClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully fetch data from API", async () => {
    const mockData = { status: "OK", results: [] };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await apiClient("/v3/reference/tickers", { limit: 10 });

    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("should append query parameters correctly", async () => {
    const mockData = { status: "OK" };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    await apiClient("/v3/reference/tickers", {
      market: "stocks",
      limit: 100,
      active: true,
    });

    const calledUrl = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    expect(calledUrl).toContain("market=stocks");
    expect(calledUrl).toContain("limit=100");
    expect(calledUrl).toContain("active=true");
  });

  it("should filter out undefined parameters", async () => {
    const mockData = { status: "OK" };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    await apiClient("/v3/reference/tickers", {
      market: "stocks",
      search: undefined,
    });

    const calledUrl = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    expect(calledUrl).toContain("market=stocks");
    expect(calledUrl).not.toContain("search");
  });

  it("should throw ApiError when response is not ok", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    await expect(apiClient("/v3/reference/tickers")).rejects.toThrow(ApiError);
    await expect(apiClient("/v3/reference/tickers")).rejects.toThrow(
      "API request failed: Not Found"
    );
  });

  it("should throw ApiError on network failure", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Network error")
    );

    await expect(apiClient("/v3/reference/tickers")).rejects.toThrow(ApiError);
  });
});

describe("fetchFromUrl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch data from full URL with API key appended", async () => {
    const mockData = { status: "OK", results: [] };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchFromUrl(
      "https://api.polygon.io/v3/reference/tickers?limit=100"
    );

    expect(result).toEqual(mockData);
    const calledUrl = (global.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string;
    expect(calledUrl).toContain("apiKey=");
  });

  it("should throw ApiError on failure", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(
      fetchFromUrl("https://api.polygon.io/v3/reference/tickers")
    ).rejects.toThrow(ApiError);
  });
});

describe("ApiError", () => {
  it("should create error with message, status, and statusText", () => {
    const error = new ApiError("Test error", 404, "Not Found");

    expect(error.message).toBe("Test error");
    expect(error.status).toBe(404);
    expect(error.statusText).toBe("Not Found");
    expect(error.name).toBe("ApiError");
  });
});
