import React from "react";
import { render, screen, act } from "@testing-library/react";
import { vi, expect, afterEach, beforeEach, describe, it } from "vitest";
import Splash from "./Splash";

describe("Splash", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders splash screen with logo and developer info", () => {
    const mockOnComplete = vi.fn();
    render(<Splash onComplete={mockOnComplete} />);

    expect(screen.getByAltText("Nasdaq Logo")).toBeInTheDocument();
    expect(screen.getByText("Omar Mohamed -")).toBeInTheDocument();

    const githubLink = screen.getByRole("link", { name: /@OmarMohamed11/ });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/OmarMohamed11"
    );
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("calls onComplete after 2 seconds", () => {
    const mockOnComplete = vi.fn();
    render(<Splash onComplete={mockOnComplete} />);

    expect(mockOnComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  }, 10000);

  it("applies fade-out animation before calling onComplete", () => {
    const mockOnComplete = vi.fn();
    render(<Splash onComplete={mockOnComplete} />);

    const splashContainer = screen.getByTestId("splash-container");
    expect(splashContainer).toHaveClass("opacity-100");

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(splashContainer).toHaveClass("opacity-0");

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  }, 10000);

  it("has correct styling classes", () => {
    const mockOnComplete = vi.fn();
    render(<Splash onComplete={mockOnComplete} />);

    const splashContainer = screen.getByTestId("splash-container");
    expect(splashContainer).toHaveClass(
      "fixed",
      "inset-0",
      "bg-gradient-to-br",
      "from-slate-900",
      "via-slate-800",
      "to-slate-900",
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "z-50",
      "transition-opacity",
      "duration-500",
      "backdrop-blur-sm",
      "opacity-100"
    );

    const logo = screen.getByAltText("Nasdaq Logo");
    expect(logo).toHaveClass(
      "w-48",
      "h-48",
      "md:w-56",
      "md:h-56",
      "drop-shadow-2xl"
    );
  });

  it("cleans up timers on unmount", () => {
    const mockOnComplete = vi.fn();
    const { unmount } = render(<Splash onComplete={mockOnComplete} />);

    unmount();

    vi.advanceTimersByTime(5000);
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it("github link has hover effects", () => {
    const mockOnComplete = vi.fn();
    render(<Splash onComplete={mockOnComplete} />);

    const githubLink = screen.getByRole("link", { name: /@OmarMohamed11/ });
    expect(githubLink).toHaveClass(
      "text-light-blue",
      "hover:text-white",
      "transition-colors",
      "duration-300",
      "underline"
    );
  });
});
