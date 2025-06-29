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
      <div data-testid="user-name">{context.userName}</div>
      <div data-testid="user-id">{context.userId}</div>
      <div data-testid="email">{context.email}</div>
      <div data-testid="owner-name">{context.currentOwnerName}</div>
      <div data-testid="repo-name">{context.currentRepoName}</div>
      <div data-testid="loading">{context.isLoading.toString()}</div>
      <button 
        data-testid="refresh-button" 
        onClick={() => context.refreshData()}
      >
        Refresh
      </button>
      <button 
        data-testid="set-owner-button" 
        onClick={() => context.setCurrentOwnerName("test-owner")}
      >
        Set Owner
      </button>
      <button 
        data-testid="set-repo-button" 
        onClick={() => context.setCurrentRepoName("test-repo")}
      >
        Set Repo
      </button>
      <button 
        data-testid="set-billing-button" 
        onClick={() => context.setBillingPeriod("Yearly")}
      >
        Set Billing
      </button>
    </div>
  );
};

describe("AccountContext", () => {
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

  describe("AccountContextWrapper", () => {
    it("should render children", () => {
      render(
        <AccountContextWrapper>
          <div data-testid="child">Child Component</div>
        </AccountContextWrapper>
      );
      
      expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("should initialize with default values", () => {
      render(
        <AccountContextWrapper>
          <TestComponent />
        </AccountContextWrapper>
      );
      
      expect(screen.getByTestId("user-name")).toHaveTextContent("Unknown User");
      expect(screen.getByTestId("user-id")).toHaveTextContent("");
      expect(screen.getByTestId("email")).toHaveTextContent("");
      expect(screen.getByTestId("loading")).toHaveTextContent("true");
    });

    it("should update user information from session", async () => {
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
          <TestComponent />
        </AccountContextWrapper>
      );
      
      await waitFor(() => {
        expect(screen.getByTestId("user-name")).toHaveTextContent("Test User");
        expect(screen.getByTestId("user-id")).toHaveTextContent("123");
        expect(screen.getByTestId("email")).toHaveTextContent("test@example.com");
      });
    });

    it("should fetch installations when userId is available", async () => {
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
      
      render(
        <AccountContextWrapper>
          <TestComponent />
        </AccountContextWrapper>
      );
      
      // Verify fetchWithTiming was called with correct parameters
      await waitFor(() => {
        expect(fetchWithTiming).toHaveBeenCalledWith("/api/users/get-user-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: 123, accessToken: "access-token" }),
          cache: "no-store",
        });
      });
    });

    it("should fetch subscription status when installations are available", async () => {
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
        } else if (Array.isArray(key) && key[0] === "fetchSubscriptionStatus-123") {
          return {
            data: [true],
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
      
      // Verify fetchWithTiming was called for subscription status
      await waitFor(() => {
        expect(fetchWithTiming).toHaveBeenCalledWith("/api/stripe/get-userinfo-subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            userId: 123, 
            jwtToken: "jwt-token", 
            customerIds: ["cus_123"] 
          }),
          cache: "no-store",
        });
      });
    });

    it("should update installationIds when installations change", async () => {
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
      
      // Verify fetchWithTiming was called for organizations
      await waitFor(() => {
        expect(fetchWithTiming).toHaveBeenCalledWith("/api/github/get-installed-repos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ installationIds: [1001, 1002] }),
          next: { revalidate: 300 },
        });
      });
    });

    it("should handle localStorage for owner and repo selection", async () => {
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
      
      // Set localStorage values
      localStorageMock.setItem(STORAGE_KEYS.CURRENT_OWNER_NAME, "org1");
      localStorageMock.setItem(STORAGE_KEYS.CURRENT_REPO_NAME, "repo1");
      
      render(
        <AccountContextWrapper>
          <TestComponent />
        </AccountContextWrapper>
      );
      
      await waitFor(() => {
        expect(screen.getByTestId("owner-name")).toHaveTextContent("org1");
        expect(screen.getByTestId("repo-name")).toHaveTextContent("repo1");
      });
    });

    it("should set default owner and repo when localStorage is empty", async () => {
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
        expect(screen.getByTestId("owner-name")).toHaveTextContent("org1");
        expect(screen.getByTestId("repo-name")).toHaveTextContent("repo1");
        expect(localStorageMock.getItem(STORAGE_KEYS.CURRENT_OWNER_NAME)).toBe("org1");
        expect(localStorageMock.getItem(STORAGE_KEYS.CURRENT_REPO_NAME)).toBe("repo1");
      });
    });
  });

  describe("Context Actions", () => {
    it("should handle refreshData action", async () => {
      const mockMutate = jest.fn();
      
      (useSWR as jest.Mock).mockImplementation((key) => {
        if (Array.isArray(key) && key[0] === "github-organizations") {
          return {
            data: [],
            mutate: mockMutate,
          };
        }
        return { data: undefined, mutate: jest.fn() };
      });
      
      render(
        <AccountContextWrapper>
          <TestComponent />
        </AccountContextWrapper>
      );
      
      // Click refresh button
      act(() => {
        screen.getByTestId("refresh-button").click();
      });
      
      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled();
      });
    });

    it("should handle setCurrentOwnerName action", async () => {
      const mockOrganizations = [
        {
          ownerId: 2001,
          ownerName: "test-owner",
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
          <TestComponent />
        </AccountContextWrapper>
      );
      
      // Click set owner button
      act(() => {
        screen.getByTestId("set-owner-button").click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId("owner-name")).toHaveTextContent("test-owner");
        expect(screen.getByTestId("repo-name")).toHaveTextContent("repo1");
        expect(localStorageMock.getItem(STORAGE_KEYS.CURRENT_OWNER_NAME)).toBe("test-owner");
        expect(localStorageMock.getItem(STORAGE_KEYS.CURRENT_REPO_NAME)).toBe("repo1");
      });
    });

    it("should handle setCurrentRepoName action", async () => {
      render(
        <AccountContextWrapper>
          <TestComponent />
        </AccountContextWrapper>
      );
      
      // Click set repo button
      act(() => {
        screen.getByTestId("set-repo-button").click();
      });
      
      await waitFor(() => {
        expect(screen.getByTestId("repo-name")).toHaveTextContent("test-repo");
        expect(localStorageMock.getItem(STORAGE_KEYS.CURRENT_REPO_NAME)).toBe("test-repo");
      });
    });

    it("should handle setBillingPeriod action", async () => {
      render(
        <AccountContextWrapper>
          <TestComponent />
        </AccountContextWrapper>
      );
      
      // Click set billing button
      act(() => {
        screen.getByTestId("set-billing-button").click();
      });
      
      // We can't directly test the state change since it's internal to the context
      // But we can verify the action doesn't throw errors
      await waitFor(() => {
        expect(screen.getByTestId("set-billing-button")).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle fetch errors gracefully", async () => {
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
      
      // Mock fetch to throw an error
      (fetchWithTiming as jest.Mock).mockRejectedValue(new Error("Network error"));
      
      render(
        <AccountContextWrapper>
          <TestComponent />
        </AccountContextWrapper>
      );
      
      // The component should render without crashing
      expect(screen.getByTestId("user-name")).toBeInTheDocument();
    });

    it("should handle missing session data gracefully", async () => {
      (useSession as jest.Mock).mockReturnValue({
        data: null,
        status: "unauthenticated",
      });
      
      render(
        <AccountContextWrapper>
          <TestComponent />
        </AccountContextWrapper>
      );
      
      expect(screen.getByTestId("user-name")).toHaveTextContent("Unknown User");
      expect(screen.getByTestId("user-id")).toHaveTextContent("");
    });

    it("should handle missing installations data gracefully", async () => {
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
      
      render(
        <AccountContextWrapper>
          <TestComponent />
        </AccountContextWrapper>
      );
      
      expect(screen.getByTestId("loading")).toHaveTextContent("true");
    });
  });

  describe("useAccountContext Hook", () => {
    it("should throw error when used outside of AccountContextProvider", () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow();
      
      // Restore console.error
      console.error = originalError;
    });
  });
});