// Mock all GitHub actions and dependencies BEFORE imports
jest.mock("@/app/actions/github/get-owner-ids", () => ({
  getOwnerIds: jest.fn(),
}));
jest.mock("@/app/actions/github/get-installed-repos", () => ({
  getInstalledRepos: jest.fn(),
}));
jest.mock("@/app/actions/supabase/installations/get-installations-by-owner-ids", () => ({
  getInstallationsByOwnerIds: jest.fn(),
}));
jest.mock("@/app/actions/supabase/owners/get-owners", () => ({
  getOwners: jest.fn(),
}));
jest.mock("@/app/actions/stripe/check-active-subscription", () => ({
  checkActiveSubscription: jest.fn(),
}));
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({ data: null, status: "unauthenticated" })),
  signOut: jest.fn(),
}));
jest.mock("swr", () => jest.fn(() => ({ data: undefined, error: undefined })));
jest.mock("@/app/components/contexts/Account");
jest.mock("@/app/actions/supabase/coverage/get-repo-coverage");
jest.mock("./utils/generate-dummy-data");
jest.mock("@/app/components/DocsLink", () => () => null);
jest.mock("@/app/components/ErrorBanner", () => () => null);
jest.mock("@/app/components/LoadingSpinner", () => () => null);
jest.mock("@/app/components/PeriodSelector", () => ({
  __esModule: true,
  default: ({ selectedPeriod, onPeriodChange }: any) => null,
  calculatePeriodDates: jest.fn(() => ({
    startDate: "2024-01-01",
    endDate: "2024-12-31",
  })),
}));
jest.mock("@/app/settings/components/RepositorySelector", () => () => null);
jest.mock("./components/CoverageChart", () => () => null);
jest.mock("./components/CoverageStats", () => () => null);

import { render, screen, waitFor } from "@testing-library/react";
import { useAccountContext } from "@/app/components/contexts/Account";
import { getRepoCoverage } from "@/app/actions/supabase/coverage/get-repo-coverage";
import { Tables } from "@/types/supabase";
import ChartsPage from "./page";
import { generateDummyData } from "./utils/generate-dummy-data";

const mockUseAccountContext = useAccountContext as jest.MockedFunction<typeof useAccountContext>;
const mockGetRepoCoverage = getRepoCoverage as jest.MockedFunction<typeof getRepoCoverage>;
const mockGenerateDummyData = generateDummyData as jest.MockedFunction<typeof generateDummyData>;

describe("ChartsPage - Demo Data Logic", () => {
  const mockDummyData: Tables<"repo_coverage">[] = [
    {
      id: 1,
      owner_id: 1,
      repo_id: 1,
      owner_name: "test-owner",
      repo_name: "test-repo",
      branch_name: "main",
      created_by: "test",
      language: "javascript",
      line_coverage: 80,
      branch_coverage: 70,
      function_coverage: 75,
      statement_coverage: 80,
      created_at: "2024-01-01T00:00:00Z",
    },
  ];

  const mockRealData: Tables<"repo_coverage">[] = [
    {
      id: 2,
      owner_id: 1,
      repo_id: 1,
      owner_name: "test-owner",
      repo_name: "test-repo",
      branch_name: "main",
      created_by: "test",
      language: "javascript",
      line_coverage: 75,
      branch_coverage: 65,
      function_coverage: 70,
      statement_coverage: 75,
      created_at: "2024-01-15T00:00:00Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateDummyData.mockReturnValue(mockDummyData);

    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
  });

  describe("All Repositories mode", () => {
    it("shows demo data for all repos when NO repos have real data", async () => {
      mockUseAccountContext.mockReturnValue({
        currentOwnerId: "owner-1",
        currentRepoId: null,
        currentRepoName: "__ALL__",
        currentOwnerName: "test-owner",
        organizations: [
          {
            ownerName: "test-owner",
            repositories: [
              { repoId: "repo-1", repoName: "repo-one" },
              { repoId: "repo-2", repoName: "repo-two" },
            ],
          },
        ],
      } as any);

      // Both repos return no data
      mockGetRepoCoverage.mockResolvedValue([]);

      render(<ChartsPage />);

      await waitFor(() => {
        expect(screen.getByText("repo-one")).toBeInTheDocument();
        expect(screen.getByText("repo-two")).toBeInTheDocument();
      });

      // Should show demo data message for both repos
      const demoMessages = screen.getAllByText(/Showing demo data with/);
      expect(demoMessages).toHaveLength(2);
    });

    it("shows real data for repos with data and 'no data' message for repos without when SOME repos have real data", async () => {
      mockUseAccountContext.mockReturnValue({
        currentOwnerId: "owner-1",
        currentRepoId: null,
        currentRepoName: "__ALL__",
        currentOwnerName: "test-owner",
        organizations: [
          {
            ownerName: "test-owner",
            repositories: [
              { repoId: "repo-1", repoName: "repo-one" },
              { repoId: "repo-2", repoName: "repo-two" },
            ],
          },
        ],
      } as any);

      // repo-one has real data, repo-two has no data
      mockGetRepoCoverage
        .mockResolvedValueOnce(mockRealData) // repo-one
        .mockResolvedValueOnce([]); // repo-two

      render(<ChartsPage />);

      await waitFor(() => {
        expect(screen.getByText("repo-one")).toBeInTheDocument();
        expect(screen.getByText("repo-two")).toBeInTheDocument();
      });

      // Should show actual data message for repo-one
      expect(screen.getByText(/Showing 1 actual data points/)).toBeInTheDocument();

      // Should show "no data" message for repo-two (not demo data)
      expect(
        screen.getByText("No coverage data available for this repository yet.")
      ).toBeInTheDocument();

      // Should NOT show demo data messages
      expect(screen.queryByText(/Showing demo data with/)).not.toBeInTheDocument();
    });

    it("shows real data for all repos when ALL repos have real data", async () => {
      mockUseAccountContext.mockReturnValue({
        currentOwnerId: "owner-1",
        currentRepoId: null,
        currentRepoName: "__ALL__",
        currentOwnerName: "test-owner",
        organizations: [
          {
            ownerName: "test-owner",
            repositories: [
              { repoId: "repo-1", repoName: "repo-one" },
              { repoId: "repo-2", repoName: "repo-two" },
            ],
          },
        ],
      } as any);

      // Both repos have real data
      mockGetRepoCoverage.mockResolvedValue(mockRealData);

      render(<ChartsPage />);

      await waitFor(() => {
        expect(screen.getByText("repo-one")).toBeInTheDocument();
        expect(screen.getByText("repo-two")).toBeInTheDocument();
      });

      // Should show actual data messages for both repos
      const actualMessages = screen.getAllByText(/Showing 1 actual data points/);
      expect(actualMessages).toHaveLength(2);

      // Should NOT show demo data or "no data" messages
      expect(screen.queryByText(/Showing demo data with/)).not.toBeInTheDocument();
      expect(
        screen.queryByText("No coverage data available for this repository yet.")
      ).not.toBeInTheDocument();
    });
  });

  describe("Single Repository mode", () => {
    it("shows demo data when repo has no real data", async () => {
      mockUseAccountContext.mockReturnValue({
        currentOwnerId: "owner-1",
        currentRepoId: "repo-1",
        currentRepoName: "repo-one",
        currentOwnerName: "test-owner",
        organizations: [],
      } as any);

      mockGetRepoCoverage.mockResolvedValue([]);

      render(<ChartsPage />);

      await waitFor(() => {
        expect(screen.getByText(/Showing demo data with/)).toBeInTheDocument();
      });
    });

    it("shows real data when repo has data", async () => {
      mockUseAccountContext.mockReturnValue({
        currentOwnerId: "owner-1",
        currentRepoId: "repo-1",
        currentRepoName: "repo-one",
        currentOwnerName: "test-owner",
        organizations: [],
      } as any);

      mockGetRepoCoverage.mockResolvedValue(mockRealData);

      render(<ChartsPage />);

      await waitFor(() => {
        expect(screen.getByText(/Showing 1 actual data points/)).toBeInTheDocument();
      });

      expect(screen.queryByText(/Showing demo data with/)).not.toBeInTheDocument();
    });
  });
});
