import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StockCard } from "./StockCard";
import type { Ticker } from "../types/ticker";

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

describe("StockCard", () => {
    it("renders ticker symbol and company name", () => {
        render(<StockCard ticker={mockTicker} />);

        expect(screen.getByText("AAPL")).toBeInTheDocument();
        expect(screen.getByText("Apple Inc.")).toBeInTheDocument();
    });

    it("applies correct styling to ticker symbol", () => {
        render(<StockCard ticker={mockTicker} />);

        const tickerElement = screen.getByText("AAPL");
        expect(tickerElement).toHaveClass(
            "text-lg",
            "font-bold",
            "text-light-blue"
        );
    });

    it("applies correct styling to company name", () => {
        render(<StockCard ticker={mockTicker} />);

        const nameElement = screen.getByText("Apple Inc.");
        expect(nameElement).toHaveClass(
            "text-sm",
            "text-muted-foreground",
            "line-clamp-2"
        );
    });

    it("renders with hover effects", () => {
        render(<StockCard ticker={mockTicker} />);

        const card = screen.getByText("AAPL").closest(".transition-transform");
        expect(card).toHaveClass("hover:scale-105", "cursor-pointer");
    });

    it("handles long company names with line clamping", () => {
        const longNameTicker: Ticker = {
            ...mockTicker,
            name: "This is a very long company name that should be truncated with line clamping to prevent overflow",
        };

        render(<StockCard ticker={longNameTicker} />);

        const nameElement = screen.getByText(longNameTicker.name);
        expect(nameElement).toHaveClass("line-clamp-2");
    });

    it("renders different ticker symbols correctly", () => {
        const differentTicker: Ticker = {
            ...mockTicker,
            ticker: "MSFT",
            name: "Microsoft Corporation",
        };

        render(<StockCard ticker={differentTicker} />);

        expect(screen.getByText("MSFT")).toBeInTheDocument();
        expect(screen.getByText("Microsoft Corporation")).toBeInTheDocument();
    });
});
