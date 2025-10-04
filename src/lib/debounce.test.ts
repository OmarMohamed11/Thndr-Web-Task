import { vi } from "vitest";
import { debounce } from "./debounce";

describe("debounce", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should delay function execution", () => {
        const mockFn = vi.fn();
        const debouncedFn = debounce(mockFn, 100);

        debouncedFn("test");
        expect(mockFn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(100);
        expect(mockFn).toHaveBeenCalledWith("test");
    });

    it("should cancel previous calls when called multiple times", () => {
        const mockFn = vi.fn();
        const debouncedFn = debounce(mockFn, 100);

        debouncedFn("first");
        debouncedFn("second");
        debouncedFn("third");

        vi.advanceTimersByTime(100);
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith("third");
    });

    it("should handle multiple arguments", () => {
        const mockFn = vi.fn();
        const debouncedFn = debounce(mockFn, 100);

        debouncedFn("arg1", "arg2", "arg3");

        vi.advanceTimersByTime(100);
        expect(mockFn).toHaveBeenCalledWith("arg1", "arg2", "arg3");
    });
});
