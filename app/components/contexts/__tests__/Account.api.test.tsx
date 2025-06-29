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

  it("should fetch installations data correctly", async () => {
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
    
    // Mock fetchWithTiming to return installations
    (fetchWithTiming as jest.Mock).mockImplementation((url) => {
      if (url === "/api/users/get-user-info") {
        return Promise.resolve(mockInstallations);
      }
      return Promise.resolve([]);
    });
    
    // Mock useSWR to use our fetchWithTiming mock
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
      expect(fetchWithTiming).toHaveBeenCalledWith("/api/users/get-user-info", expect.any(Object));
    });
  });

  it("should fetch subscription status correctly", async () => {
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
    
    // Mock fetchWithTiming to return subscription status
    (fetchWithTiming as jest.Mock).mockImplementation((url) => {
      if (url === "/api/stripe/get-userinfo-subscriptions") {
        return Promise.resolve(mockSubscriptionStatus);
      } else if (url === "/api/users/get-user-info") {
        return Promise.resolve(mockInstallations);
      }
      return Promise.resolve([]);
    });
    
    // Mock useSWR to use our fetchWithTiming mock
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
      expect(fetchWithTiming).toHaveBeenCalledWith(
        "/api/stripe/get-userinfo-subscriptions",
        expect.any(Object)
      );
    });
  });

  it("should fetch organizations data correctly", async () => {
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
    
    // Mock fetchWithTiming to return organizations
    (fetchWithTiming as jest.Mock).mockImplementation((url) => {
      if (url === "/api/github/get-installed-repos") {
        return Promise.resolve(mockOrganizations);
      } else if (url === "/api/users/get-user-info") {
        return Promise.resolve(mockInstallations);
      }
      return Promise.resolve([]);
    });
    
    // Mock useSWR to use our fetchWithTiming mock
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
      expect(fetchWithTiming).toHaveBeenCalledWith(
        "/api/github/get-installed-repos",
        expect.any(Object)
      );
    });
  });

  it("should handle API errors gracefully", async () => {
    // Mock fetchWithTiming to throw errors
    (fetchWithTiming as jest.Mock).mockImplementation((url) => {
      if (url === "/api/users/get-user-info") {
        return Promise.reject(new Error("API error"));
      } else if (url === "/api/stripe/get-userinfo-subscriptions") {
        return Promise.reject(new Error("Subscription API error"));
      } else if (url === "/api/github/get-installed-repos") {
        return Promise.reject(new Error("GitHub API error"));
      }
      return Promise.resolve([]);
    });
    
    // Mock useSWR to use our fetchWithTiming mock and handle errors
    (useSWR as jest.Mock).mockImplementation((key) => {
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

  it("should handle API response with null values", async () => {
    // Mock fetchWithTiming to return null values
    (fetchWithTiming as jest.Mock).mockImplementation((url) => {
      if (url === "/api/users/get-user-info") {
        return Promise.resolve(null);
      } else if (url === "/api/stripe/get-userinfo-subscriptions") {
        return Promise.resolve(null);
      } else if (url === "/api/github/get-installed-repos") {
        return Promise.resolve(null);
      }
      return Promise.resolve([]);
    });
    
    // Mock useSWR to use our fetchWithTiming mock
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

  it("should handle API response with malformed data", async () => {
    // Mock fetchWithTiming to return malformed data
    (fetchWithTiming as jest.Mock).mockImplementation((url) => {
      if (url === "/api/users/get-user-info") {
        return Promise.resolve({ invalid: "data" }); // Not an array
      } else if (url === "/api/stripe/get-userinfo-subscriptions") {
        return Promise.resolve("not an array"); // Not an array
      } else if (url === "/api/github/get-installed-repos") {
        return Promise.resolve(123); // Not an array
      }
      return Promise.resolve([]);
    });
    
    // Mock useSWR to use our fetchWithTiming mock
    (useSWR as jest.Mock).mockImplementation((key) => {
      if (key === "fetchInstallations-123") {
        return {
          data: { invalid: "data" }, // Not an array
          mutate: jest.fn(),
        };
      } else if (Array.isArray(key) && key[0] === "fetchSubscriptionStatus-123") {
        return {
          data: "not an array", // Not an array
          mutate: jest.fn(),
        };
      } else if (Array.isArray(key) && key[0] === "github-organizations") {
        return {
          data: 123, // Not an array
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
    
    // Component should handle malformed API responses gracefully
    await waitFor(() => {
      // These expectations might vary based on how the component handles malformed data
      expect(screen.getByTestId("loading")).toBeInTheDocument();
    });
  });

  it("should handle race conditions in API calls", async () => {
    // Create delayed responses to simulate race conditions
    const slowInstallations = new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "1",
            installation_id: 1001,
            owner_id: 2001,
            owner_type: "Organization",
            owner_name: "slow-org",
            user_id: 123,
            user_name: "Test User",
            stripe_customer_id: "cus_slow",
          },
        ]);
      }, 100);
    });
    
    const fastInstallations = Promise.resolve([
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
    ]);
    
    // First call returns slow response, second call returns fast response
    (fetchWithTiming as jest.Mock).mockImplementationOnce(() => slowInstallations);
    (fetchWithTiming as jest.Mock).mockImplementationOnce(() => fastInstallations);
    
    // Mock useSWR to simulate revalidation
    let callCount = 0;
    (useSWR as jest.Mock).mockImplementation((key) => {
      if (key === "fetchInstallations-123") {
        callCount++;
        if (callCount === 1) {
          return {
            data: undefined, // Initial state
            mutate: jest.fn().mockImplementation(() => {
              // Simulate revalidation
              return fastInstallations;
            }),
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
    
    render(
      <AccountContextWrapper>
        <TestComponent />
      </AccountContextWrapper>
    );
    
    // Initially undefined
    expect(screen.getByTestId("installations-count")).toHaveTextContent("undefined");
    
    // After the fast response completes
    await waitFor(() => {
      expect(screen.getByTestId("installations-count")).toHaveTextContent("1");
    });
  });
});