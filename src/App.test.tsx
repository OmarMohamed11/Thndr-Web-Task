import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import App from "./App";

describe("App", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("shows splash screen initially", () => {
        render(<App />);
        expect(screen.getByAltText("Nasdaq Logo")).toBeInTheDocument();
        expect(screen.getByText("Omar Mohamed -")).toBeInTheDocument();
    });

    it("transitions to main app after splash completes", () => {
        render(<App />);

        expect(screen.getByAltText("Nasdaq Logo")).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(screen.queryByAltText("Nasdaq Logo")).not.toBeInTheDocument();
        expect(screen.getByText("Nasdaq Stocks")).toBeInTheDocument();
        expect(screen.getByText("Coming soon...")).toBeInTheDocument();
    }, 10000);
});
