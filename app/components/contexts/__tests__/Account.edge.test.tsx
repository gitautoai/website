import { render, screen, waitFor, act } from "@testing-library/react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { AccountContextWrapper, useAccountContext } from "../Account";
import { STORAGE_KEYS } from "@/lib/constants";
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

// Mock component to test useAccountContext hook
const TestComponent = () => {
  const context = useAccountContext();
  return (
    <div>
      <div data-testid="selected-index">{context.selectedIndex?.toString() || "undefined"}</div>
      <div data-testid="installation-ids">{context.installationIds.join(",")}</div>
      <div data-testid="current-owner-id">{context.currentOwnerId?.toString() || "null"}</div>
      <div data-testid="current-owner-type">{context.currentOwnerType || "null"}</div>
      <div data-testid="current-installation-id">
        {context.currentInstallationId?.toString() || "null"}
      </div>
      <div data-testid="current-stripe-customer-id">
        {context.currentStripeCustomerId || "null"}
      </div>
      <button 
        data-testid="set-selected-index" 
        onClick={() => context.setSelectedIndex(1)}
      >
        Set Selected Index
      </button>
      <button 
        data-testid="clear-owner" 
        onClick={() => context.setCurrentOwnerName(null)}
      >
        Clear Owner
      </button>
      <button 
        data-testid="clear-repo" 
        onClick={() => context.setCurrentRepoName(null)}
      >
        Clear Repo
      </button>
    </div>
  );
};

describe("AccountContext Edge Cases", () => {
  // Clear mocks and localStorage before each test
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

  it("should handle empty installations array", async () => {
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
    
    (useSWR as jest.Mock).mockImplementation((key) => {
      if (key === "fetchInstallations-123") {
        return {
          data: [], // Empty installations array
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
      expect(screen.getByTestId("installation-ids")).toHaveTextContent("");
      expect(screen.getByTestId("selected-index")).toHaveTextContent("undefined");
    });
  });

  it("should handle missing owner in localStorage", async () => {
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
    
    (useSWR as jest.Mock).mockImplementation((key) => {
      if (key === "fetchInstallations-123") {
        return {
          data: mockInstallations,
          mutate: jest.fn(),
        };
      }
      return { data: undefined, mutate: jest.fn() };
    });
    
    // Set only repo in localStorage, not owner
    localStorageMock.setItem(STORAGE_KEYS.CURRENT_REPO_NAME, "repo1");
    
    render(
      <AccountContextWrapper>
        <TestComponent />
      </AccountContextWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId("selected-index")).toHaveTextContent("0");
      expect(localStorageMock.getItem(STORAGE_KEYS.CURRENT_OWNER_NAME)).toBe("org1");
    });
  });

  it("should handle owner not found in installations", async () => {
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
    
    (useSWR as jest.Mock).mockImplementation((key) => {
      if (key === "fetchInstallations-123") {
        return {
          data: mockInstallations,
          mutate: jest.fn(),
        };
      }
      return { data: undefined, mutate: jest.fn() };
    });
    
    // Set non-existent owner in localStorage
    localStorageMock.setItem(STORAGE_KEYS.CURRENT_OWNER_NAME, "non-existent-org");
    
    render(
      <AccountContextWrapper>
        <TestComponent />
      </AccountContextWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId("selected-index")).toHaveTextContent("0");
      expect(localStorageMock.getItem(STORAGE_KEYS.CURRENT_OWNER_NAME)).toBe("org1");
    });
  });

  it("should update currentOwnerId and currentOwnerType when organizations are available", async () => {
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
    
    // Set initial owner
    localStorageMock.setItem(STORAGE_KEYS.CURRENT_OWNER_NAME, "org1");
    
    render(
      <AccountContextWrapper>
        <TestComponent />
      </AccountContextWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId("current-owner-id")).toHaveTextContent("2001");
      expect(screen.getByTestId("current-owner-type")).toHaveTextContent("Organization");
    });
  });

  it("should update currentInstallationId and currentStripeCustomerId when installations are available", async () => {
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
      expect(screen.getByTestId("current-installation-id")).toHaveTextContent("1001");
      expect(screen.getByTestId("current-stripe-customer-id")).toHaveTextContent("cus_123");
    });
  });

  it("should handle clearing owner name", async () => {
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
    
    // Set initial values in localStorage
    localStorageMock.setItem(STORAGE_KEYS.CURRENT_OWNER_NAME, "org1");
    localStorageMock.setItem(STORAGE_KEYS.CURRENT_REPO_NAME, "repo1");
    
    render(
      <AccountContextWrapper>
        <TestComponent />
      </AccountContextWrapper>
    );
    
    // Clear owner
    act(() => {
      screen.getByTestId("clear-owner").click();
    });
    
    await waitFor(() => {
      expect(localStorageMock.getItem(STORAGE_KEYS.CURRENT_OWNER_NAME)).toBeNull();
      expect(localStorageMock.getItem(STORAGE_KEYS.CURRENT_REPO_NAME)).toBeNull();
    });
  });

  it("should handle clearing repo name", async () => {
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
    
    // Set initial values in localStorage
    localStorageMock.setItem(STORAGE_KEYS.CURRENT_OWNER_NAME, "org1");
    localStorageMock.setItem(STORAGE_KEYS.CURRENT_REPO_NAME, "repo1");
    
    render(
      <AccountContextWrapper>
        <TestComponent />
      </AccountContextWrapper>
    );
    
    // Clear repo
    act(() => {
      screen.getByTestId("clear-repo").click();
    });
    
    await waitFor(() => {
      expect(localStorageMock.getItem(STORAGE_KEYS.CURRENT_OWNER_NAME)).toBe("org1");
      expect(localStorageMock.getItem(STORAGE_KEYS.CURRENT_REPO_NAME)).toBeNull();
    });
  });

  it("should handle saved repo not found in organizations", async () => {
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
    
    // Set non-existent repo in localStorage
    localStorageMock.setItem(STORAGE_KEYS.CURRENT_OWNER_NAME, "org1");
    localStorageMock.setItem(STORAGE_KEYS.CURRENT_REPO_NAME, "non-existent-repo");
    
    render(
      <AccountContextWrapper>
        <TestComponent />
      </AccountContextWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId("current-owner-id")).toHaveTextContent("2001");
      // Should default to first repo
      expect(localStorageMock.getItem(STORAGE_KEYS.CURRENT_REPO_NAME)).toBe("repo1");
    });
  });

  it("should handle empty organizations array", async () => {
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
    
    (useSWR as jest.Mock).mockImplementation((key) => {
      if (Array.isArray(key) && key[0] === "github-organizations") {
        return {
          data: [], // Empty organizations array
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
      expect(screen.getByTestId("current-owner-id")).toHaveTextContent("null");
      expect(screen.getByTestId("current-owner-type")).toHaveTextContent("null");
    });
  });

  it("should handle organization with empty repositories array", async () => {
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
    
    const mockOrganizations = [
      {
        ownerId: 2001,
        ownerName: "org1",
        ownerType: "Organization",
        repositories: [], // Empty repositories array
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
    
    // Set owner in localStorage
    localStorageMock.setItem(STORAGE_KEYS.CURRENT_OWNER_NAME, "org1");
    
    render(
      <AccountContextWrapper>
        <TestComponent />
      </AccountContextWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId("current-owner-id")).toHaveTextContent("2001");
      expect(screen.getByTestId("current-owner-type")).toHaveTextContent("Organization");
      // Repo should be null since there are no repositories
      expect(localStorageMock.getItem(STORAGE_KEYS.CURRENT_REPO_NAME)).toBeNull();
    });
  });

  it("should handle localStorage errors gracefully", async () => {
    // Mock localStorage.getItem to throw an error
    const originalGetItem = localStorageMock.getItem;
    localStorageMock.getItem = jest.fn().mockImplementation(() => {
      throw new Error("localStorage error");
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
      
      // Component should render without crashing
      expect(screen.getByTestId("current-owner-id")).toBeInTheDocument();
      expect(screen.getByTestId("current-owner-type")).toBeInTheDocument();
    } finally {
      // Restore localStorage and console.error
      localStorageMock.getItem = originalGetItem;
      console.error = originalConsoleError;
    }
  });

  it("should handle undefined organizations gracefully", async () => {
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
      data: undefined, // No organizations data
      mutate: jest.fn(),
    }));
    
    render(
      <AccountContextWrapper>
        <TestComponent />
      </AccountContextWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId("current-owner-id")).toHaveTextContent("null");
      expect(screen.getByTestId("current-owner-type")).toHaveTextContent("null");
    });
  });
});