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

// Mock component to test API data
const TestComponent = () => {
  const context = useAccountContext();
  return (
    <div>
      <div data-testid="installations-count">
        {context.installations ? context.installations.length : "undefined"}
      </div>
      <div data-testid="organizations-count">
        {context.organizations ? context.organizations.length : "0"}
      </div>
      <div data-testid="subscribed-count">
        {context.installationsSubscribed ? context.installationsSubscribed.length : "null"}
      </div>
      <div data-testid="loading">{context.isLoading.toString()}</div>
    </div>
  );
};

describe("AccountContext API Integration", () => {
  // Clear mocks and localStorage before each test
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Default mock implementations
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
    
    (useSWR as jest.Mock).mockImplementation(() => ({
      data: undefined,
      mutate: jest.fn(),
    }));
    
    (fetchWithTiming as jest.Mock).mockResolvedValue([]);
  });

  it("should handle installations data from SWR", async () => {
    const mockInstallations = [
      {
        id: "1",
        installation_id: 1001,
        owner_id: 2001,
        owner_type: "Organization",
        owner_name: "org1",
        user_id: 123,
        user_name: "Test User",
        stripe_customer_id: "cus_123",
      },
      {
        id: "2",
        installation_id: 1002,
        owner_id: 2002,
        owner_type: "User",
        owner_name: "user1",
        user_id: 123,
        user_name: "Test User",
        stripe_customer_id: "cus_456",
      },
    ];
    
    (useSWR as jest.Mock).mockImplementation((key) => {
      if (key === "fetchInstallations-123") {
        return {
          data: mockInstallations,
          mutate: jest.fn(),
        };
      }
      return { data: undefined, mutate: jest.fn() };
    });
    
    render(
      <AccountContextWrapper>
        <TestComponent />
      </AccountContextWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId("installations-count")).toHaveTextContent("2");
    });
  });

  it("should handle subscription status data from SWR", async () => {
    const mockInstallations = [
      {
        id: "1",
        installation_id: 1001,
        owner_id: 2001,
        owner_type: "Organization",
        owner_name: "org1",
        user_id: 123,
        user_name: "Test User",
        stripe_customer_id: "cus_123",
      },
      {
        id: "2",
        installation_id: 1002,
        owner_id: 2002,
        owner_type: "User",
        owner_name: "user1",
        user_id: 123,
        user_name: "Test User",
        stripe_customer_id: "cus_456",
      },
    ];
    
    const mockSubscriptionStatus = [true, false];
    
    (useSWR as jest.Mock).mockImplementation((key) => {
      if (key === "fetchInstallations-123") {
        return {
          data: mockInstallations,
          mutate: jest.fn(),
        };
      } else if (Array.isArray(key) && key[0] === "fetchSubscriptionStatus-123") {
        return {
          data: mockSubscriptionStatus,
          mutate: jest.fn(),
        };
      }
      return { data: undefined, mutate: jest.fn() };
    });
    
    render(
      <AccountContextWrapper>
        <TestComponent />
      </AccountContextWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId("subscribed-count")).toHaveTextContent("2");
    });
  });

  it("should handle organizations data from SWR", async () => {
    const mockInstallations = [
      {
        id: "1",
        installation_id: 1001,
        owner_id: 2001,
        owner_type: "Organization",
        owner_name: "org1",
        user_id: 123,
        user_name: "Test User",
        stripe_customer_id: "cus_123",
      },
    ];
    
    const mockOrganizations = [
      {
        ownerId: 2001,
        ownerName: "org1",
        ownerType: "Organization",
        repositories: [
          { repoId: 3001, repoName: "repo1" },
          { repoId: 3002, repoName: "repo2" },
        ],
      },
    ];
    
    (useSWR as jest.Mock).mockImplementation((key) => {
      if (key === "fetchInstallations-123") {
        return {
          data: mockInstallations,
          mutate: jest.fn(),
        };
      } else if (Array.isArray(key) && key[0] === "github-organizations") {
        return {
          data: mockOrganizations,
          mutate: jest.fn(),
        };
      }
      return { data: undefined, mutate: jest.fn() };
    });
    
    render(
      <AccountContextWrapper>
        <TestComponent />
      </AccountContextWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId("organizations-count")).toHaveTextContent("1");
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });
  });

  it("should handle SWR errors gracefully", async () => {
    // Mock useSWR to return error state
    (useSWR as jest.Mock).mockImplementation(() => {
      return {
        data: undefined,
        error: new Error("SWR error"),
        mutate: jest.fn(),
      };
    });
    
    render(
      <AccountContextWrapper>
        <TestComponent />
      </AccountContextWrapper>
    );
    
    // Component should render without crashing despite API errors
    await waitFor(() => {
      expect(screen.getByTestId("installations-count")).toHaveTextContent("undefined");
      expect(screen.getByTestId("organizations-count")).toHaveTextContent("0");
      expect(screen.getByTestId("subscribed-count")).toHaveTextContent("null");
      expect(screen.getByTestId("loading")).toHaveTextContent("true");
    });
  });

  it("should handle SWR with null values", async () => {
    // Mock useSWR to return null values
    (useSWR as jest.Mock).mockImplementation(() => ({
      data: null,
      mutate: jest.fn(),
    }));
    
    render(
      <AccountContextWrapper>
        <TestComponent />
      </AccountContextWrapper>
    );
    
    // Component should handle null API responses gracefully
    await waitFor(() => {
      expect(screen.getByTestId("installations-count")).toHaveTextContent("undefined");
      expect(screen.getByTestId("organizations-count")).toHaveTextContent("0");
      expect(screen.getByTestId("subscribed-count")).toHaveTextContent("null");
      expect(screen.getByTestId("loading")).toHaveTextContent("true");
    });
  });

  it("should handle malformed installations data gracefully", async () => {
    // Mock useSWR to return malformed data for installations
    (useSWR as jest.Mock).mockImplementation((key) => {
      if (key === "fetchInstallations-123") {
        return {
          data: { invalid: "data" }, // Not an array
          mutate: jest.fn(),
        };
      }
      return { data: undefined, mutate: jest.fn() };
    });
    
    // Suppress console errors for this test
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    try {
      render(
        <AccountContextWrapper>
          <TestComponent />
        </AccountContextWrapper>
      );
      
      // Component should handle malformed API responses gracefully
      await waitFor(() => {
        expect(screen.getByTestId("loading")).toBeInTheDocument();
      });
    } finally {
      // Restore console.error
      console.error = originalConsoleError;
    }
  });

  it("should handle race conditions in SWR calls", async () => {
    let callCount = 0;
    
    // Mock useSWR to simulate revalidation
    (useSWR as jest.Mock).mockImplementation((key) => {
      if (key === "fetchInstallations-123") {
        callCount++;
        if (callCount === 1) {
          return {
            data: undefined, // Initial state
            mutate: jest.fn(),
          };
        } else {
          return {
            data: [
              {
                id: "2",
                installation_id: 1002,
                owner_id: 2002,
                owner_type: "User",
                owner_name: "fast-org",
                user_id: 123,
                user_name: "Test User",
                stripe_customer_id: "cus_fast",
              },
            ],
            mutate: jest.fn(),
          };
        }
      }
      return { data: undefined, mutate: jest.fn() };
    });
    
    const { rerender } = render(
      <AccountContextWrapper>
        <TestComponent />
      </AccountContextWrapper>
    );
    
    // Initially undefined
    expect(screen.getByTestId("installations-count")).toHaveTextContent("undefined");
    
    // Trigger rerender to simulate SWR revalidation
    rerender(
      <AccountContextWrapper>
        <TestComponent />
      </AccountContextWrapper>
    );
    
    // After the response completes
    await waitFor(() => {
      expect(screen.getByTestId("installations-count")).toHaveTextContent("1");
    });
  });

  it("should handle empty arrays from SWR", async () => {
    (useSWR as jest.Mock).mockImplementation((key) => {
      if (key === "fetchInstallations-123") {
        return {
          data: [], // Empty array
          mutate: jest.fn(),
        };
      } else if (Array.isArray(key) && key[0] === "github-organizations") {
        return {
          data: [], // Empty array
          mutate: jest.fn(),
        };
      }
      return { data: undefined, mutate: jest.fn() };
    });
    
    render(
      <AccountContextWrapper>
        <TestComponent />
      </AccountContextWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId("installations-count")).toHaveTextContent("0");
      expect(screen.getByTestId("organizations-count")).toHaveTextContent("0");
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });
  });

  it("should handle partial data loading states", async () => {
    // First render with installations but no organizations
    (useSWR as jest.Mock).mockImplementation((key) => {
      if (key === "fetchInstallations-123") {
        return {
          data: [
            {
              id: "1",
              installation_id: 1001,
              owner_id: 2001,
              owner_type: "Organization",
              owner_name: "org1",
              user_id: 123,
              user_name: "Test User",
              stripe_customer_id: "cus_123",
            },
          ],
          mutate: jest.fn(),
        };
      }
      return { data: undefined, mutate: jest.fn() };
    });
    
    render(
      <AccountContextWrapper>
        <TestComponent />
      </AccountContextWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId("installations-count")).toHaveTextContent("1");
      expect(screen.getByTestId("organizations-count")).toHaveTextContent("0");
      expect(screen.getByTestId("loading")).toHaveTextContent("true"); // Still loading organizations
    });
  });
});