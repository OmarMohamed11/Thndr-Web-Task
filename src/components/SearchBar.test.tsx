import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { SearchBar } from "./SearchBar";

vi.mock("../lib/debounce", () => ({
  debounce: (fn: (...args: unknown[]) => void, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: unknown[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  },
}));

describe("SearchBar", () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders with placeholder text", () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    expect(screen.getByPlaceholderText("Search stocks...")).toBeInTheDocument();
  });

  it("calls onSearch with debounce when user types", () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText("Search stocks...");

    fireEvent.change(input, { target: { value: "AAPL" } });

    expect(mockOnSearch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    vi.runAllTimers();

    expect(mockOnSearch).toHaveBeenCalledWith("AAPL");
  });

  it("shows clear button when there is text", () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText("Search stocks...");

    fireEvent.change(input, { target: { value: "AAPL" } });

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("clears input when clear button is clicked", () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText("Search stocks...");

    fireEvent.change(input, { target: { value: "AAPL" } });
    const clearButton = screen.getByRole("button");
    fireEvent.click(clearButton);

    expect(input).toHaveValue("");
    expect(mockOnSearch).toHaveBeenCalledWith("");
  });

  it("uses custom debounce time", () => {
    render(<SearchBar onSearch={mockOnSearch} debounceMs={500} />);
    const input = screen.getByPlaceholderText("Search stocks...");

    fireEvent.change(input, { target: { value: "AAPL" } });

    vi.advanceTimersByTime(300);
    expect(mockOnSearch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);
    vi.runAllTimers();

    expect(mockOnSearch).toHaveBeenCalledWith("AAPL");
  });
});
