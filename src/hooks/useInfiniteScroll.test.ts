import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useInfiniteScroll } from "./useInfiniteScroll";

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
});

// Mock global IntersectionObserver
Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: mockIntersectionObserver,
});

describe("useInfiniteScroll", () => {
    const mockFetchNextPage = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("returns a ref callback function", () => {
        const { result } = renderHook(() =>
            useInfiniteScroll({
                hasNextPage: true,
                isFetchingNextPage: false,
                fetchNextPage: mockFetchNextPage,
            })
        );

        expect(result.current.lastElementRef).toBeInstanceOf(Function);
    });

    it("creates IntersectionObserver when ref is called with a node", () => {
        const { result } = renderHook(() =>
            useInfiniteScroll({
                hasNextPage: true,
                isFetchingNextPage: false,
                fetchNextPage: mockFetchNextPage,
            })
        );

        const mockNode = document.createElement("div");
        result.current.lastElementRef(mockNode);

        expect(mockIntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            expect.objectContaining({
                threshold: 0.1,
                rootMargin: "100px",
            })
        );
    });

    it("does not create observer when isFetchingNextPage is true", () => {
        const { result } = renderHook(() =>
            useInfiniteScroll({
                hasNextPage: true,
                isFetchingNextPage: true,
                fetchNextPage: mockFetchNextPage,
            })
        );

        const mockNode = document.createElement("div");
        result.current.lastElementRef(mockNode);

        expect(mockIntersectionObserver).not.toHaveBeenCalled();
    });

    it("calls fetchNextPage when element intersects and hasNextPage is true", () => {
        const { result } = renderHook(() =>
            useInfiniteScroll({
                hasNextPage: true,
                isFetchingNextPage: false,
                fetchNextPage: mockFetchNextPage,
            })
        );

        const mockNode = document.createElement("div");
        result.current.lastElementRef(mockNode);

        // Get the intersection callback that was passed to IntersectionObserver
        const intersectionCallback = mockIntersectionObserver.mock.calls[0][0];

        // Simulate intersection
        intersectionCallback([{ isIntersecting: true }]);

        expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
    });

    it("does not call fetchNextPage when element intersects but hasNextPage is false", () => {
        const { result } = renderHook(() =>
            useInfiniteScroll({
                hasNextPage: false,
                isFetchingNextPage: false,
                fetchNextPage: mockFetchNextPage,
            })
        );

        const mockNode = document.createElement("div");
        result.current.lastElementRef(mockNode);

        // Get the intersection callback
        const intersectionCallback = mockIntersectionObserver.mock.calls[0][0];

        // Simulate intersection
        intersectionCallback([{ isIntersecting: true }]);

        expect(mockFetchNextPage).not.toHaveBeenCalled();
    });

    it("does not call fetchNextPage when element does not intersect", () => {
        const { result } = renderHook(() =>
            useInfiniteScroll({
                hasNextPage: true,
                isFetchingNextPage: false,
                fetchNextPage: mockFetchNextPage,
            })
        );

        const mockNode = document.createElement("div");
        result.current.lastElementRef(mockNode);

        // Get the intersection callback
        const intersectionCallback = mockIntersectionObserver.mock.calls[0][0];

        // Simulate no intersection
        intersectionCallback([{ isIntersecting: false }]);

        expect(mockFetchNextPage).not.toHaveBeenCalled();
    });

    it("uses custom threshold and rootMargin when provided", () => {
        const { result } = renderHook(() =>
            useInfiniteScroll({
                hasNextPage: true,
                isFetchingNextPage: false,
                fetchNextPage: mockFetchNextPage,
                threshold: 0.5,
                rootMargin: "200px",
            })
        );

        const mockNode = document.createElement("div");
        result.current.lastElementRef(mockNode);

        expect(mockIntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            expect.objectContaining({
                threshold: 0.5,
                rootMargin: "200px",
            })
        );
    });

    it("disconnects previous observer when ref is called again", () => {
        const mockObserver = {
            observe: vi.fn(),
            unobserve: vi.fn(),
            disconnect: vi.fn(),
        };

        mockIntersectionObserver.mockReturnValue(mockObserver);

        const { result } = renderHook(() =>
            useInfiniteScroll({
                hasNextPage: true,
                isFetchingNextPage: false,
                fetchNextPage: mockFetchNextPage,
            })
        );

        const mockNode1 = document.createElement("div");
        const mockNode2 = document.createElement("div");

        // First call
        result.current.lastElementRef(mockNode1);
        expect(mockObserver.disconnect).not.toHaveBeenCalled();

        // Second call should disconnect previous observer
        result.current.lastElementRef(mockNode2);
        expect(mockObserver.disconnect).toHaveBeenCalledTimes(1);
    });
});
