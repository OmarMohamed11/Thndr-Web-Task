import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "./loading-spinner";

describe("LoadingSpinner", () => {
    it("renders with default size", () => {
        render(<LoadingSpinner />);
        expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("has accessible label", () => {
        render(<LoadingSpinner />);
        expect(screen.getByLabelText("Loading")).toBeInTheDocument();
    });

    it("renders with small size", () => {
        const { container } = render(<LoadingSpinner size="sm" />);
        const spinner = container.querySelector(".h-4");
        expect(spinner).toBeInTheDocument();
    });

    it("renders with medium size", () => {
        const { container } = render(<LoadingSpinner size="md" />);
        const spinner = container.querySelector(".h-8");
        expect(spinner).toBeInTheDocument();
    });

    it("renders with large size", () => {
        const { container } = render(<LoadingSpinner size="lg" />);
        const spinner = container.querySelector(".h-12");
        expect(spinner).toBeInTheDocument();
    });

    it("applies custom className", () => {
        const { container } = render(
            <LoadingSpinner className="custom-class" />
        );
        expect(container.firstChild).toHaveClass("custom-class");
    });

    it("has pulse animation", () => {
        const { container } = render(<LoadingSpinner />);
        const spinner = container.querySelector(".animate-pulse");
        expect(spinner).toBeInTheDocument();
    });
});
