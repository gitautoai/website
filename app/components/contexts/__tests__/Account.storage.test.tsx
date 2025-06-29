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

// Mock component to test localStorage interactions
const TestComponent = () => {
  const context = useAccountContext();
  return (
    <div>
      <div data-testid="owner-name">{context.currentOwnerName || "null"}</div>
      <div data-testid="repo-name">{context.currentRepoName || "null"}</div>
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
        data-testid="clear-owner-button" 
        onClick={() => context.setCurrentOwnerName(null)}
      >
        Clear Owner
      </button>
      <button 
        data-testid="clear-repo-button" 
        onClick={() => context.setCurrentRepoName(null)}
      >
        Clear Repo
      </button>
    </div>
  );
};

describe("AccountContext localStorage Interactions", () => {
  // Real localStorage implementation for these tests
  let originalLocalStorage: Storage;
  
  beforeAll(() => {
    // Save original localStorage
    originalLocalStorage = window.localStorage;
    
    // Create a mock localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          store[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete store[key];
        }),
        clear: jest.fn(() => {
          store = {};
        }),
        key: jest.fn((index: number) => Object.keys(store)[index] || null),
        length: 0,
      };
    })();
    
    // Replace global localStorage with mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    // Set length property based on store size
    Object.defineProperty(localStorageMock, 'length', {
      get: function() { return Object.keys(store).length; }
    });
  });
  
  afterAll(() => {
    // Restore original localStorage
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    
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

  it("should read initial values from localStorage", async () => {
    // Set initial values in localStorage
    window.localStorage.setItem(STORAGE_KEYS.CURRENT_OWNER_NAME, "initial-owner");
    window.localStorage.setItem(STORAGE_KEYS.CURRENT_REPO_NAME, "initial-repo");
    
    const mockOrganizations = [
      {
        ownerId: 2001,
        ownerName: "initial-owner",
        ownerType: "Organization",
        repositories: [
          { repoId: 3001, repoName: "initial-repo" },
          { repoId: 3002, repoName: "other-repo" },
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
    
    await waitFor(() => {
      expect(screen.getByTestId("owner-name")).toHaveTextContent("initial-owner");
      expect(screen.getByTestId("repo-name")).toHaveTextContent("initial-repo");
    });
    
    // Verify localStorage was read
    expect(window.localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.CURRENT_OWNER_NAME);
    expect(window.localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.CURRENT_REPO_NAME);
  });

  it("should write owner name to localStorage when changed", async () => {
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
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.CURRENT_OWNER_NAME,
        "test-owner"
      );
    });
  });

  it("should write repo name to localStorage when changed", async () => {
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
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.CURRENT_REPO_NAME,
        "test-repo"
      );
    });
  });

  it("should remove owner name from localStorage when cleared", async () => {
    // Set initial values in localStorage
    window.localStorage.setItem(STORAGE_KEYS.CURRENT_OWNER_NAME, "initial-owner");
    window.localStorage.setItem(STORAGE_KEYS.CURRENT_REPO_NAME, "initial-repo");
    
    render(
      <AccountContextWrapper>
        <TestComponent />
      </AccountContextWrapper>
    );
    
    // Click clear owner button
    act(() => {
      screen.getByTestId("clear-owner-button").click();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId("owner-name")).toHaveTextContent("null");
      expect(window.localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.CURRENT_OWNER_NAME);
      expect(window.localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.CURRENT_REPO_NAME);
    });
  });

  it("should remove repo name from localStorage when cleared", async () => {
    // Set initial values in localStorage
    window.localStorage.setItem(STORAGE_KEYS.CURRENT_OWNER_NAME, "initial-owner");
    window.localStorage.setItem(STORAGE_KEYS.CURRENT_REPO_NAME, "initial-repo");
    
    render(
      <AccountContextWrapper>
        <TestComponent />
      </AccountContextWrapper>
    );
    
    // Click clear repo button
    act(() => {
      screen.getByTestId("clear-repo-button").click();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId("repo-name")).toHaveTextContent("null");
      expect(window.localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.CURRENT_REPO_NAME);
    });
  });

  it("should handle localStorage errors gracefully", async () => {
    // Make localStorage.getItem throw an error
    window.localStorage.getItem = jest.fn().mockImplementation(() => {
      throw new Error("localStorage error");
    });
    
    render(
      <AccountContextWrapper>
        <TestComponent />
      </AccountContextWrapper>
    );
    
    // Component should render without crashing
    expect(screen.getByTestId("owner-name")).toBeInTheDocument();
    expect(screen.getByTestId("repo-name")).toBeInTheDocument();
  });

  it("should handle localStorage being unavailable", async () => {
    // Temporarily replace localStorage with null to simulate unavailability
    const tempLocalStorage = window.localStorage;
    Object.defineProperty(window, 'localStorage', {
      value: null,
      writable: true
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
      expect(screen.getByTestId("owner-name")).toBeInTheDocument();
      expect(screen.getByTestId("repo-name")).toBeInTheDocument();
    } finally {
      // Restore localStorage and console.error
      Object.defineProperty(window, 'localStorage', {
        value: tempLocalStorage,
        writable: true
      });
      console.error = originalConsoleError;
    }
  });

  it("should handle localStorage quota exceeded error", async () => {
    // Make localStorage.setItem throw a quota exceeded error
    window.localStorage.setItem = jest.fn().mockImplementation(() => {
      const error = new Error("localStorage quota exceeded");
      error.name = "QuotaExceededError";
      throw error;
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
      
      // Click set owner button
      act(() => {
        screen.getByTestId("set-owner-button").click();
      });
      
      // Component should not crash
      await waitFor(() => {
        expect(screen.getByTestId("owner-name")).toBeInTheDocument();
      });
    } finally {
      // Restore console.error
      console.error = originalConsoleError;
    }
  });
});