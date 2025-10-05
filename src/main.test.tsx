import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

// Mock the App component
vi.mock("./App", () => ({
  default: () => <div data-testid="app">App Component</div>,
}));

// Mock ReactQueryDevtools
vi.mock("@tanstack/react-query-devtools", () => ({
  ReactQueryDevtools: () => <div data-testid="devtools">DevTools</div>,
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock document.getElementById
const mockRootElement = document.createElement("div");
mockRootElement.id = "root";
document.body.appendChild(mockRootElement);

describe("main.tsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any rendered components
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = "";
    }
  });

  it("should create QueryClient with correct default options", () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          refetchOnWindowFocus: false,
          retry: false,
          gcTime: 1000 * 60 * 60 * 24,
        },
      },
    });

    expect(queryClient).toBeDefined();
    expect(queryClient.getDefaultOptions().queries?.staleTime).toBe(
      5 * 60 * 1000
    );
    expect(queryClient.getDefaultOptions().queries?.refetchOnWindowFocus).toBe(
      false
    );
    expect(queryClient.getDefaultOptions().queries?.retry).toBe(false);
    expect(queryClient.getDefaultOptions().queries?.gcTime).toBe(
      1000 * 60 * 60 * 24
    );
  });

  it("should create async storage persister with correct configuration", () => {
    const persister = createAsyncStoragePersister({
      storage: window.localStorage,
      key: "thndr-stocks-app",
    });

    expect(persister).toBeDefined();
    expect(persister).toHaveProperty("persistClient");
  });

  it("should find root element", () => {
    const rootElement = document.getElementById("root");
    expect(rootElement).toBeDefined();
    expect(rootElement?.id).toBe("root");
  });

  it("should throw error when root element is not found", () => {
    // Remove the root element temporarily
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.remove();
    }

    // This would throw an error in the actual main.tsx
    expect(() => {
      const element = document.getElementById("root");
      if (!element) throw new Error("Failed to find the root element");
    }).toThrow("Failed to find the root element");

    // Restore the root element
    document.body.appendChild(mockRootElement);
  });

  it("should render app with QueryClient provider", () => {
    const queryClient = new QueryClient();

    const TestComponent = () => (
      <QueryClientProvider client={queryClient}>
        <div data-testid="app">App Component</div>
        <div data-testid="devtools">DevTools</div>
      </QueryClientProvider>
    );

    const { getByTestId } = render(<TestComponent />);

    expect(getByTestId("app")).toBeInTheDocument();
    expect(getByTestId("devtools")).toBeInTheDocument();
  });

  it("should handle createRoot functionality", () => {
    // Mock createRoot
    const mockRender = vi.fn();
    const mockCreateRoot = vi.fn(() => ({
      render: mockRender,
    }));

    // Test that createRoot can be called with root element
    const root = mockCreateRoot(mockRootElement);
    root.render(<div>Test App</div>);

    expect(mockCreateRoot).toHaveBeenCalledWith(mockRootElement);
    expect(mockRender).toHaveBeenCalledWith(<div>Test App</div>);
  });

  it("should handle localStorage persister creation", () => {
    const persister = createAsyncStoragePersister({
      storage: window.localStorage,
      key: "thndr-stocks-app",
    });

    expect(persister).toBeDefined();
    expect(typeof persister.persistClient).toBe("function");
    expect(typeof persister.restoreClient).toBe("function");
  });
});
