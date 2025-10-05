import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

// Mock Radix UI components
vi.mock("@radix-ui/react-alert-dialog", () => ({
  Root: ({ children, ...props }: React.ComponentPropsWithoutRef<"div">) => (
    <div data-testid="alert-dialog-root" {...props}>
      {children}
    </div>
  ),
  Trigger: ({
    children,
    ...props
  }: React.ComponentPropsWithoutRef<"button">) => (
    <button data-testid="alert-dialog-trigger" {...props}>
      {children}
    </button>
  ),
  Portal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="alert-dialog-portal">{children}</div>
  ),
  Overlay: ({ children, ...props }: React.ComponentPropsWithoutRef<"div">) => (
    <div data-testid="alert-dialog-overlay" {...props}>
      {children}
    </div>
  ),
  Content: ({ children, ...props }: React.ComponentPropsWithoutRef<"div">) => (
    <div data-testid="alert-dialog-content" {...props}>
      {children}
    </div>
  ),
  Title: ({ children, ...props }: React.ComponentPropsWithoutRef<"div">) => (
    <div data-testid="alert-dialog-title" {...props}>
      {children}
    </div>
  ),
  Description: ({
    children,
    ...props
  }: React.ComponentPropsWithoutRef<"div">) => (
    <div data-testid="alert-dialog-description" {...props}>
      {children}
    </div>
  ),
  Action: ({
    children,
    ...props
  }: React.ComponentPropsWithoutRef<"button">) => (
    <button data-testid="alert-dialog-action" {...props}>
      {children}
    </button>
  ),
  Cancel: ({
    children,
    ...props
  }: React.ComponentPropsWithoutRef<"button">) => (
    <button data-testid="alert-dialog-cancel" {...props}>
      {children}
    </button>
  ),
}));

describe("AlertDialog", () => {
  it("renders alert dialog components", () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Test Title</AlertDialogTitle>
            <AlertDialogDescription>Test Description</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByTestId("alert-dialog-root")).toBeInTheDocument();
    expect(screen.getByTestId("alert-dialog-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("alert-dialog-content")).toBeInTheDocument();
    expect(screen.getByTestId("alert-dialog-title")).toBeInTheDocument();
    expect(screen.getByTestId("alert-dialog-description")).toBeInTheDocument();
    expect(screen.getByTestId("alert-dialog-cancel")).toBeInTheDocument();
    expect(screen.getByTestId("alert-dialog-action")).toBeInTheDocument();
  });

  it("renders trigger button with correct text", () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Test Title</AlertDialogTitle>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByText("Open Dialog")).toBeInTheDocument();
  });

  it("renders title and description", () => {
    render(
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Test Title</AlertDialogTitle>
            <AlertDialogDescription>Test Description</AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("renders action and cancel buttons", () => {
    render(
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });

  it("handles button clicks", () => {
    const onCancel = vi.fn();
    const onAction = vi.fn();

    render(
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onAction}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    fireEvent.click(screen.getByText("Cancel"));
    fireEvent.click(screen.getByText("Continue"));

    expect(onCancel).toHaveBeenCalled();
    expect(onAction).toHaveBeenCalled();
  });

  it("applies custom className to components", () => {
    render(
      <AlertDialog>
        <AlertDialogContent className="custom-content">
          <AlertDialogHeader className="custom-header">
            <AlertDialogTitle className="custom-title">
              Test Title
            </AlertDialogTitle>
            <AlertDialogDescription className="custom-description">
              Test Description
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="custom-footer">
            <AlertDialogCancel className="custom-cancel">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="custom-action">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByTestId("alert-dialog-content")).toHaveClass(
      "custom-content"
    );
    expect(screen.getByTestId("alert-dialog-title")).toHaveClass(
      "custom-title"
    );
    expect(screen.getByTestId("alert-dialog-description")).toHaveClass(
      "custom-description"
    );
    expect(screen.getByTestId("alert-dialog-cancel")).toHaveClass(
      "custom-cancel"
    );
    expect(screen.getByTestId("alert-dialog-action")).toHaveClass(
      "custom-action"
    );
  });

  it("renders without header when not provided", () => {
    render(
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.queryByTestId("alert-dialog-title")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("alert-dialog-description")
    ).not.toBeInTheDocument();
  });

  it("renders without footer when not provided", () => {
    render(
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Test Title</AlertDialogTitle>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.queryByTestId("alert-dialog-cancel")).not.toBeInTheDocument();
    expect(screen.queryByTestId("alert-dialog-action")).not.toBeInTheDocument();
  });
});
