import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "./contexts/ToastContext";
import App from "./App";

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
            <ToastProvider>{component}</ToastProvider>
        </QueryClientProvider>
    );
};

describe("App", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("shows splash screen initially", () => {
        renderWithQueryClient(<App />);
        expect(screen.getByAltText("Nasdaq Logo")).toBeInTheDocument();
        expect(screen.getByText("Omar Mohamed -")).toBeInTheDocument();
    });

    it("transitions to main app after splash completes", () => {
        renderWithQueryClient(<App />);

        expect(screen.getByAltText("Nasdaq Logo")).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(screen.queryByAltText("Nasdaq Logo")).not.toBeInTheDocument();

        // Check that the loading state appears (Explore component is rendered)
        expect(screen.getByRole("status")).toBeInTheDocument();
    });
});
