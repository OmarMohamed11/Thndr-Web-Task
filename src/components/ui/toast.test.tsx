import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";

// Mock Radix UI components
vi.mock("@radix-ui/react-toast", () => ({
  Provider: ({ children, ...props }: React.ComponentPropsWithoutRef<"div">) => (
    <div data-testid="toast-provider" {...props}>
      {children}
    </div>
  ),
  Viewport: ({ children, ...props }: React.ComponentPropsWithoutRef<"div">) => (
    <div data-testid="toast-viewport" {...props}>
      {children}
    </div>
  ),
  Root: ({ children, ...props }: React.ComponentPropsWithoutRef<"div">) => (
    <div data-testid="toast-root" {...props}>
      {children}
    </div>
  ),
  Title: ({ children, ...props }: React.ComponentPropsWithoutRef<"div">) => (
    <div data-testid="toast-title" {...props}>
      {children}
    </div>
  ),
  Description: ({
    children,
    ...props
  }: React.ComponentPropsWithoutRef<"div">) => (
    <div data-testid="toast-description" {...props}>
      {children}
    </div>
  ),
  Action: ({
    children,
    ...props
  }: React.ComponentPropsWithoutRef<"button">) => (
    <button data-testid="toast-action" {...props}>
      {children}
    </button>
  ),
  Close: ({ children, ...props }: React.ComponentPropsWithoutRef<"button">) => (
    <button data-testid="toast-close" {...props}>
      {children}
    </button>
  ),
}));

describe("Toast Components", () => {
  describe("ToastProvider", () => {
    it("renders toast provider", () => {
      render(
        <ToastProvider>
          <div>Test Content</div>
        </ToastProvider>
      );

      expect(screen.getByTestId("toast-provider")).toBeInTheDocument();
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <ToastProvider className="custom-provider">
          <div>Test Content</div>
        </ToastProvider>
      );

      expect(screen.getByTestId("toast-provider")).toHaveClass(
        "custom-provider"
      );
    });
  });

  describe("ToastViewport", () => {
    it("renders toast viewport", () => {
      render(<ToastViewport />);

      expect(screen.getByTestId("toast-viewport")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<ToastViewport className="custom-viewport" />);

      expect(screen.getByTestId("toast-viewport")).toHaveClass(
        "custom-viewport"
      );
    });
  });

  describe("Toast", () => {
    it("renders toast with default variant", () => {
      render(
        <Toast>
          <ToastTitle>Test Title</ToastTitle>
        </Toast>
      );

      expect(screen.getByTestId("toast-root")).toBeInTheDocument();
      expect(screen.getByTestId("toast-title")).toBeInTheDocument();
    });

    it("renders toast with destructive variant", () => {
      render(
        <Toast variant="destructive">
          <ToastTitle>Error Title</ToastTitle>
        </Toast>
      );

      expect(screen.getByTestId("toast-root")).toBeInTheDocument();
      expect(screen.getByTestId("toast-title")).toBeInTheDocument();
    });

    it("renders toast with success variant", () => {
      render(
        <Toast variant="success">
          <ToastTitle>Success Title</ToastTitle>
        </Toast>
      );

      expect(screen.getByTestId("toast-root")).toBeInTheDocument();
      expect(screen.getByTestId("toast-title")).toBeInTheDocument();
    });

    it("renders toast with warning variant", () => {
      render(
        <Toast variant="warning">
          <ToastTitle>Warning Title</ToastTitle>
        </Toast>
      );

      expect(screen.getByTestId("toast-root")).toBeInTheDocument();
      expect(screen.getByTestId("toast-title")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <Toast className="custom-toast">
          <ToastTitle>Test Title</ToastTitle>
        </Toast>
      );

      expect(screen.getByTestId("toast-root")).toHaveClass("custom-toast");
    });
  });

  describe("ToastTitle", () => {
    it("renders toast title", () => {
      render(
        <Toast>
          <ToastTitle>Test Title</ToastTitle>
        </Toast>
      );

      expect(screen.getByTestId("toast-title")).toBeInTheDocument();
      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <Toast>
          <ToastTitle className="custom-title">Test Title</ToastTitle>
        </Toast>
      );

      expect(screen.getByTestId("toast-title")).toHaveClass("custom-title");
    });
  });

  describe("ToastDescription", () => {
    it("renders toast description", () => {
      render(
        <Toast>
          <ToastDescription>Test Description</ToastDescription>
        </Toast>
      );

      expect(screen.getByTestId("toast-description")).toBeInTheDocument();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <Toast>
          <ToastDescription className="custom-description">
            Test Description
          </ToastDescription>
        </Toast>
      );

      expect(screen.getByTestId("toast-description")).toHaveClass(
        "custom-description"
      );
    });
  });

  describe("ToastAction", () => {
    it("renders toast action", () => {
      render(
        <Toast>
          <ToastAction>Action</ToastAction>
        </Toast>
      );

      expect(screen.getByTestId("toast-action")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("handles click events", () => {
      const onClick = vi.fn();

      render(
        <Toast>
          <ToastAction onClick={onClick}>Action</ToastAction>
        </Toast>
      );

      fireEvent.click(screen.getByText("Action"));
      expect(onClick).toHaveBeenCalled();
    });

    it("applies custom className", () => {
      render(
        <Toast>
          <ToastAction className="custom-action">Action</ToastAction>
        </Toast>
      );

      expect(screen.getByTestId("toast-action")).toHaveClass("custom-action");
    });
  });

  describe("ToastClose", () => {
    it("renders toast close button", () => {
      render(
        <Toast>
          <ToastClose />
        </Toast>
      );

      expect(screen.getByTestId("toast-close")).toBeInTheDocument();
    });

    it("handles click events", () => {
      const onClick = vi.fn();

      render(
        <Toast>
          <ToastClose onClick={onClick} />
        </Toast>
      );

      fireEvent.click(screen.getByTestId("toast-close"));
      expect(onClick).toHaveBeenCalled();
    });

    it("applies custom className", () => {
      render(
        <Toast>
          <ToastClose className="custom-close" />
        </Toast>
      );

      expect(screen.getByTestId("toast-close")).toHaveClass("custom-close");
    });
  });

  describe("Complete Toast Example", () => {
    it("renders complete toast with all components", () => {
      render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Success!</ToastTitle>
            <ToastDescription>
              Your action was completed successfully.
            </ToastDescription>
            <ToastAction>Undo</ToastAction>
            <ToastClose />
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      expect(screen.getByTestId("toast-provider")).toBeInTheDocument();
      expect(screen.getByTestId("toast-root")).toBeInTheDocument();
      expect(screen.getByTestId("toast-title")).toBeInTheDocument();
      expect(screen.getByTestId("toast-description")).toBeInTheDocument();
      expect(screen.getByTestId("toast-action")).toBeInTheDocument();
      expect(screen.getByTestId("toast-close")).toBeInTheDocument();
      expect(screen.getByTestId("toast-viewport")).toBeInTheDocument();

      expect(screen.getByText("Success!")).toBeInTheDocument();
      expect(
        screen.getByText("Your action was completed successfully.")
      ).toBeInTheDocument();
      expect(screen.getByText("Undo")).toBeInTheDocument();
    });
  });
});
