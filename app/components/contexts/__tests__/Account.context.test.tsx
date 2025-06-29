import { render, screen, waitFor } from "@testing-library/react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { AccountContextWrapper, useAccountContext } from "../Account";
import { fetchWithTiming } from "@/utils/fetch";

// Mock dependencies
jest.mock("next-auth/react");
jest.mock("swr");
jest.mock("@/utils/fetch");

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Test component that uses the context
const TestConsumer = () => {
  const context = useAccountContext();
  return (
    <div>
      <div data-testid="user-name">{context.userName}</div>
      <div data-testid="user-id">{context.userId?.toString() || "null"}</div>
      <div data-testid="email">{context.email || "null"}</div>
      <div data-testid="jwt-token">{context.jwtToken || "null"}</div>
      <div data-testid="access-token">{context.accessToken || "null"}</div>
      <div data-testid="billing-period">{context.billingPeriod}</div>
      <div data-testid="is-loading">{context.isLoading.toString()}</div>
    </div>
  );
};

// Nested test component to test context inheritance
const NestedComponent = () => {
  return (
    <div>
      <div data-testid="nested">Nested Component</div>
      <TestConsumer />
    </div>
  );
};

describe("AccountContext Provider and Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Default mock implementations
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });
    
    (useSWR as jest.Mock).mockImplementation(() => ({
      data: undefined,
      mutate: jest.fn(),
    }));
    
    (fetchWithTiming as jest.Mock).mockResolvedValue([]);
  });

  it("should provide default context values", async () => {
    render(
      <AccountContextWrapper>
        <TestConsumer />
      </AccountContextWrapper>
    );
    
    expect(screen.getByTestId("user-name")).toHaveTextContent("Unknown User");
    expect(screen.getByTestId("user-id")).toHaveTextContent("null");
    expect(screen.getByTestId("email")).toHaveTextContent("null");
    expect(screen.getByTestId("jwt-token")).toHaveTextContent("null");
    expect(screen.getByTestId("access-token")).toHaveTextContent("null");
    expect(screen.getByTestId("billing-period")).toHaveTextContent("Monthly");
    expect(screen.getByTestId("is-loading")).toHaveTextContent("true");
  });

  it("should update context values from session", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          userId: 123,
          name: "Test User",
          email: "test@example.com",
        },
        jwtToken: "jwt-token",
        accessToken: "access-token",
      },
      status: "authenticated",
    });
    
    render(
      <AccountContextWrapper>
        <TestConsumer />
      </AccountContextWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId("user-name")).toHaveTextContent("Test User");
      expect(screen.getByTestId("user-id")).toHaveTextContent("123");
      expect(screen.getByTestId("email")).toHaveTextContent("test@example.com");
      expect(screen.getByTestId("jwt-token")).toHaveTextContent("jwt-token");
      expect(screen.getByTestId("access-token")).toHaveTextContent("access-token");
    });
  });

  it("should provide context to nested components", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          userId: 123,
          name: "Test User",
          email: "test@example.com",
        },
        jwtToken: "jwt-token",
        accessToken: "access-token",
      },
      status: "authenticated",
    });
    
    render(
      <AccountContextWrapper>
        <NestedComponent />
      </AccountContextWrapper>
    );
    
    expect(screen.getByTestId("nested")).toHaveTextContent("Nested Component");
    
    await waitFor(() => {
      expect(screen.getByTestId("user-name")).toHaveTextContent("Test User");
      expect(screen.getByTestId("user-id")).toHaveTextContent("123");
    });
  });

  it("should throw error when useAccountContext is used outside provider", () => {
    // Suppress console errors for this test
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    try {
      expect(() => {
        render(<TestConsumer />);
      }).toThrow();
    } finally {
      // Restore console.error
      console.error = originalConsoleError;
    }
  });

  it("should handle multiple consumers of the same context", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          userId: 123,
          name: "Test User",
          email: "test@example.com",
        },
        jwtToken: "jwt-token",
        accessToken: "access-token",
      },
      status: "authenticated",
    });
    
    render(
      <AccountContextWrapper>
        <div>
          <TestConsumer />
          <TestConsumer />
        </div>
      </AccountContextWrapper>
    );
    
    // Should have two elements with the same content
    const userNameElements = screen.getAllByTestId("user-name");
    expect(userNameElements).toHaveLength(2);
    
    await waitFor(() => {
      userNameElements.forEach(element => {
        expect(element).toHaveTextContent("Test User");
      });
    });
  });

  it("should handle context updates affecting all consumers", async () => {
    // Start with no session
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });
    
    const { rerender } = render(
      <AccountContextWrapper>
        <div>
          <TestConsumer />
          <TestConsumer />
        </div>
      </AccountContextWrapper>
    );
    
    // Initial state
    const userNameElements = screen.getAllByTestId("user-name");
    userNameElements.forEach(element => {
      expect(element).toHaveTextContent("Unknown User");
    });
    
    // Update session
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          userId: 123,
          name: "Updated User",
          email: "updated@example.com",
        },
        jwtToken: "updated-jwt",
        accessToken: "updated-access",
      },
      status: "authenticated",
    });
    
    // Rerender with updated session
    rerender(
      <AccountContextWrapper>
        <div>
          <TestConsumer />
          <TestConsumer />
        </div>
      </AccountContextWrapper>
    );
    
    // All consumers should be updated
    await waitFor(() => {
      const updatedUserNameElements = screen.getAllByTestId("user-name");
      updatedUserNameElements.forEach(element => {
        expect(element).toHaveTextContent("Updated User");
      });
    });
  });

  it("should handle organizations data loading state", async () => {
    // Mock organizations data
    const mockOrganizations = [
      {
        ownerId: 2001,
        ownerName: "org1",
        ownerType: "Organization",
        repositories: [
          { repoId: 3001, repoName: "repo1" },
        ],
      },
    ];

    (useSWR as jest.Mock).mockImplementation((key) => {
      if (Array.isArray(key) && key[0] === "github-organizations") {
        return {
          data: mockOrganizations,
          mutate: jest.fn(),
        };
      }
      return { data: undefined, mutate: jest.fn() };
    });
    
    render(
      <AccountContextWrapper>
        <TestConsumer />
      </AccountContextWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId("is-loading")).toHaveTextContent("false");
    });
  });

  it("should handle empty organizations data", async () => {
    (useSWR as jest.Mock).mockImplementation((key) => {
      if (Array.isArray(key) && key[0] === "github-organizations") {
        return {
          data: [],
          mutate: jest.fn(),
        };
      }
      return { data: undefined, mutate: jest.fn() };
    });
    
    render(
      <AccountContextWrapper>
        <TestConsumer />
      </AccountContextWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId("is-loading")).toHaveTextContent("false");
    });
  });
});