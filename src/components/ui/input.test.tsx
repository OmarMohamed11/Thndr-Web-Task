import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./input";

describe("Input", () => {
    it("renders input element", () => {
        render(<Input placeholder="Search" />);
        expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    });

    it("accepts user input", async () => {
        const user = userEvent.setup();
        render(<Input placeholder="Search" />);

        const input = screen.getByPlaceholderText("Search");
        await user.type(input, "AAPL");

        expect(input).toHaveValue("AAPL");
    });

    it("applies custom className", () => {
        render(<Input className="custom-class" data-testid="input" />);
        expect(screen.getByTestId("input")).toHaveClass("custom-class");
    });

    it("can be disabled", () => {
        render(<Input disabled placeholder="Search" />);
        expect(screen.getByPlaceholderText("Search")).toBeDisabled();
    });

    it("forwards ref", () => {
        const ref = { current: null };
        render(<Input ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it("supports different input types", () => {
        render(<Input type="email" data-testid="email-input" />);
        expect(screen.getByTestId("email-input")).toHaveAttribute(
            "type",
            "email"
        );
    });
});
