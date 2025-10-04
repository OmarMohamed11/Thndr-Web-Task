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
            "text-light-blue",
            "border-light-blue/30"
        );
    });

    it("applies correct styling to company name", () => {
        render(<StockCard ticker={mockTicker} />);

        const nameElement = screen.getByText("Apple Inc.");
        expect(nameElement).toHaveClass("text-lg", "font-bold", "text-white");
    });

    it("renders with hover effects", () => {
        render(<StockCard ticker={mockTicker} />);

        const card = screen.getByText("AAPL").closest(".group");
        expect(card).toHaveClass("hover:scale-[1.01]", "cursor-pointer");
    });

    it("renders exchange information", () => {
        render(<StockCard ticker={mockTicker} />);

        expect(screen.getByText("NASDAQ")).toBeInTheDocument();
    });

    it("trims long company names", () => {
        const longNameTicker: Ticker = {
            ...mockTicker,
            name: "This is a very long company name that should be truncated",
        };

        render(<StockCard ticker={longNameTicker} />);

        // Should show trimmed name with ellipsis
        expect(
            screen.getByText("This is a very long company na...")
        ).toBeInTheDocument();

        // Should have title attribute with full name
        const nameElement = screen.getByTitle(longNameTicker.name);
        expect(nameElement).toBeInTheDocument();
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
