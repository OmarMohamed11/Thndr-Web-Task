import { describe, it, expect } from "vitest";
import type { Ticker } from "./ticker";

describe("Ticker Type", () => {
  it("should have correct type structure", () => {
    const mockTicker: Ticker = {
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
    };

    expect(mockTicker.ticker).toBe("AAPL");
    expect(mockTicker.name).toBe("Apple Inc.");
    expect(mockTicker.market).toBe("stocks");
    expect(mockTicker.locale).toBe("us");
    expect(mockTicker.primary_exchange).toBe("NASDAQ");
    expect(mockTicker.type).toBe("CS");
    expect(mockTicker.active).toBe(true);
    expect(mockTicker.currency_name).toBe("us dollar");
    expect(mockTicker.currency_symbol).toBe("$");
    expect(mockTicker.last_updated_utc).toBe("2023-01-01T00:00:00Z");
  });

  it("should allow all required fields", () => {
    const minimalTicker: Ticker = {
      ticker: "TEST",
      name: "Test Company",
      market: "stocks",
      locale: "us",
      primary_exchange: "NYSE",
      type: "CS",
      active: false,
      currency_name: "us dollar",
      currency_symbol: "$",
      last_updated_utc: "2023-12-31T23:59:59Z",
    };

    expect(minimalTicker).toBeDefined();
    expect(typeof minimalTicker.ticker).toBe("string");
    expect(typeof minimalTicker.name).toBe("string");
    expect(typeof minimalTicker.market).toBe("string");
    expect(typeof minimalTicker.locale).toBe("string");
    expect(typeof minimalTicker.primary_exchange).toBe("string");
    expect(typeof minimalTicker.type).toBe("string");
    expect(typeof minimalTicker.active).toBe("boolean");
    expect(typeof minimalTicker.currency_name).toBe("string");
    expect(typeof minimalTicker.currency_symbol).toBe("string");
    expect(typeof minimalTicker.last_updated_utc).toBe("string");
  });

  it("should handle different market types", () => {
    const crypto: Ticker = {
      ticker: "BTC",
      name: "Bitcoin",
      market: "crypto",
      locale: "global",
      primary_exchange: "COINBASE",
      type: "CRYPTO",
      active: true,
      currency_name: "us dollar",
      currency_symbol: "$",
      last_updated_utc: "2023-01-01T00:00:00Z",
    };

    expect(crypto.market).toBe("crypto");
    expect(crypto.type).toBe("CRYPTO");
  });

  it("should handle different locales", () => {
    const internationalTicker: Ticker = {
      ticker: "TSCO",
      name: "Tesco PLC",
      market: "stocks",
      locale: "gb",
      primary_exchange: "LSE",
      type: "CS",
      active: true,
      currency_name: "british pound",
      currency_symbol: "£",
      last_updated_utc: "2023-01-01T00:00:00Z",
    };

    expect(internationalTicker.locale).toBe("gb");
    expect(internationalTicker.currency_symbol).toBe("£");
  });
});
