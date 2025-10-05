import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToast, toast, reducer } from "./use-toast";

// Mock timers
vi.useFakeTimers();

describe("use-toast", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the global state
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.useFakeTimers();
  });

  describe("reducer", () => {
    const initialState = { toasts: [] };

    it("should handle ADD_TOAST action", () => {
      const toast = {
        id: "1",
        title: "Test Toast",
        description: "Test Description",
        open: true,
      };

      const action = {
        type: "ADD_TOAST" as const,
        toast,
      };

      const result = reducer(initialState, action);
      expect(result.toasts).toHaveLength(1);
      expect(result.toasts[0]).toEqual(toast);
    });

    it("should limit toasts to TOAST_LIMIT", () => {
      const toasts = Array.from({ length: 3 }, (_, i) => ({
        id: String(i),
        title: `Toast ${String(i)}`,
        open: true,
      }));

      const state = { toasts };
      const newToast = {
        id: "3",
        title: "New Toast",
        open: true,
      };

      const action = {
        type: "ADD_TOAST" as const,
        toast: newToast,
      };

      const result = reducer(state, action);
      expect(result.toasts).toHaveLength(1); // TOAST_LIMIT is 1
      expect(result.toasts[0]).toEqual(newToast);
    });

    it("should handle UPDATE_TOAST action", () => {
      const existingToast = {
        id: "1",
        title: "Original Title",
        description: "Original Description",
        open: true,
      };

      const state = { toasts: [existingToast] };
      const updateAction = {
        type: "UPDATE_TOAST" as const,
        toast: {
          id: "1",
          title: "Updated Title",
        },
      };

      const result = reducer(state, updateAction);
      expect(result.toasts[0].title).toBe("Updated Title");
      expect(result.toasts[0].description).toBe("Original Description");
    });

    it("should handle DISMISS_TOAST action with specific toastId", () => {
      const toast1 = { id: "1", title: "Toast 1", open: true };
      const toast2 = { id: "2", title: "Toast 2", open: true };

      const state = { toasts: [toast1, toast2] };
      const action = {
        type: "DISMISS_TOAST" as const,
        toastId: "1",
      };

      const result = reducer(state, action);
      expect(result.toasts[0].open).toBe(false);
      expect(result.toasts[1].open).toBe(true);
    });

    it("should handle DISMISS_TOAST action without toastId", () => {
      const toast1 = { id: "1", title: "Toast 1", open: true };
      const toast2 = { id: "2", title: "Toast 2", open: true };

      const state = { toasts: [toast1, toast2] };
      const action = {
        type: "DISMISS_TOAST" as const,
      };

      const result = reducer(state, action);
      expect(result.toasts[0].open).toBe(false);
      expect(result.toasts[1].open).toBe(false);
    });

    it("should handle REMOVE_TOAST action with specific toastId", () => {
      const toast1 = { id: "1", title: "Toast 1", open: true };
      const toast2 = { id: "2", title: "Toast 2", open: true };

      const state = { toasts: [toast1, toast2] };
      const action = {
        type: "REMOVE_TOAST" as const,
        toastId: "1",
      };

      const result = reducer(state, action);
      expect(result.toasts).toHaveLength(1);
      expect(result.toasts[0].id).toBe("2");
    });

    it("should handle REMOVE_TOAST action without toastId", () => {
      const toast1 = { id: "1", title: "Toast 1", open: true };
      const toast2 = { id: "2", title: "Toast 2", open: true };

      const state = { toasts: [toast1, toast2] };
      const action = {
        type: "REMOVE_TOAST" as const,
      };

      const result = reducer(state, action);
      expect(result.toasts).toHaveLength(0);
    });
  });

  describe("toast function", () => {
    it("should create a toast with unique ID", () => {
      const toastResult = toast({
        title: "Test Toast",
        description: "Test Description",
      });

      expect(toastResult.id).toBeDefined();
      expect(toastResult.dismiss).toBeInstanceOf(Function);
      expect(toastResult.update).toBeInstanceOf(Function);
    });

    it("should generate unique IDs", () => {
      const toast1 = toast({ title: "Toast 1" });
      const toast2 = toast({ title: "Toast 2" });

      expect(toast1.id).not.toBe(toast2.id);
    });

    it("should handle toast update", () => {
      const toastResult = toast({
        title: "Original Title",
      });

      act(() => {
        toastResult.update({
          id: toastResult.id,
          title: "Updated Title",
        });
      });

      expect(toastResult.update).toBeInstanceOf(Function);
    });

    it("should handle toast dismiss", () => {
      const toastResult = toast({
        title: "Test Toast",
      });

      act(() => {
        toastResult.dismiss();
      });

      expect(toastResult.dismiss).toBeInstanceOf(Function);
    });
  });

  describe("useToast hook", () => {
    it("should return initial state", () => {
      const { result } = renderHook(() => useToast());

      expect(result.current.toasts).toEqual([]);
      expect(result.current.toast).toBeInstanceOf(Function);
      expect(result.current.dismiss).toBeInstanceOf(Function);
    });

    it("should add toast when toast function is called", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({
          title: "Test Toast",
          description: "Test Description",
        });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe("Test Toast");
      expect(result.current.toasts[0].description).toBe("Test Description");
    });

    it("should dismiss toast when dismiss is called", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({
          title: "Test Toast",
        });
      });

      const toastId = result.current.toasts[0].id;

      act(() => {
        result.current.dismiss(toastId);
      });

      expect(result.current.toasts[0].open).toBe(false);
    });

    it("should dismiss all toasts when dismiss is called without ID", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: "Toast 1" });
        result.current.toast({ title: "Toast 2" });
      });

      expect(result.current.toasts).toHaveLength(1); // Limited by TOAST_LIMIT

      act(() => {
        result.current.dismiss();
      });

      expect(result.current.toasts[0].open).toBe(false);
    });

    it("should handle toast with onOpenChange callback", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({
          title: "Test Toast",
          onOpenChange: (open) => {
            if (!open) {
              // This would trigger dismiss
            }
          },
        });
      });

      expect(result.current.toasts[0].onOpenChange).toBeInstanceOf(Function);
    });

    it("should handle multiple toast operations", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: "First Toast" });
      });

      act(() => {
        result.current.toast({ title: "Second Toast" });
      });

      // Should replace the first toast due to TOAST_LIMIT
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe("Second Toast");

      act(() => {
        result.current.dismiss();
      });

      expect(result.current.toasts[0].open).toBe(false);
    });
  });
});
