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
jest.mock("@/app/actions/supabase/repo-coverage/get-repo-coverage");
jest.mock("@/app/actions/supabase/total-repo-coverage/get-total-coverage");
jest.mock("@/app/hooks/use-setup-workflow", () => ({
  useSetupWorkflow: jest.fn(),
}));
jest.mock("@/app/components/DocsLink", () => () => null);
jest.mock("@/app/components/ErrorBanner", () => () => null);
jest.mock("@/app/components/LoadingSpinner", () => () => null);
jest.mock("@/app/components/PeriodSelector", () => ({
  __esModule: true,
  default: ({ selectedPeriod: _selectedPeriod, onPeriodChange: _onPeriodChange }: any) => null,
  calculatePeriodDates: jest.fn(() => ({
    startDate: "2024-01-01",
    endDate: "2024-12-31",
  })),
}));
jest.mock("@/app/dashboard/components/RepositorySelector", () => () => null);
jest.mock("./components/CoverageChart", () => () => null);
jest.mock("./components/CoverageStats", () => () => null);

import { render, screen, waitFor } from "@testing-library/react";
import { useAccountContext } from "@/app/components/contexts/Account";
import { getRepoCoverage } from "@/app/actions/supabase/repo-coverage/get-repo-coverage";
import { useSetupWorkflow } from "@/app/hooks/use-setup-workflow";
import { Tables } from "@/types/supabase";
import ChartsPage from "./page";

const mockUseAccountContext = useAccountContext as jest.MockedFunction<typeof useAccountContext>;
const mockGetRepoCoverage = getRepoCoverage as jest.MockedFunction<typeof getRepoCoverage>;
const mockUseSetupWorkflow = useSetupWorkflow as jest.MockedFunction<typeof useSetupWorkflow>;

const mockTriggerSetup = jest.fn();
const mockCheckSetupPR = jest.fn();

describe("ChartsPage", () => {
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
      lines_covered: 750,
      lines_total: 1000,
      functions_covered: 70,
      functions_total: 100,
      branches_covered: 130,
      branches_total: 200,
      created_at: "2024-01-15T00:00:00Z",
    },
  ];

  const defaultAccountContext = {
    currentOwnerId: "owner-1",
    currentRepoId: null,
    currentRepoName: "__ALL__",
    currentOwnerName: "test-owner",
    currentInstallationId: 123,
    organizations: [
      {
        ownerName: "test-owner",
        repositories: [
          { repoId: "repo-1", repoName: "repo-one" },
          { repoId: "repo-2", repoName: "repo-two" },
        ],
      },
    ],
    userLogin: "user1",
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Default: no setup PRs for any repo
    mockUseSetupWorkflow.mockReturnValue({
      isSettingUp: false,
      getRepoStatus: jest.fn(() => null),
      checkSetupPR: mockCheckSetupPR,
      triggerSetup: mockTriggerSetup,
      SetupModals: () => <></>,
    });

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
    it("shows setup button for repos with no data", async () => {
      mockUseAccountContext.mockReturnValue(defaultAccountContext);
      mockGetRepoCoverage.mockResolvedValue([]);

      render(<ChartsPage />);

      await waitFor(() => {
        expect(screen.getByText("repo-one")).toBeInTheDocument();
        expect(screen.getByText("repo-two")).toBeInTheDocument();
      });

      // Should show setup buttons for both repos
      const setupButtons = screen.getAllByText(/No coverage data yet/);
      expect(setupButtons).toHaveLength(2);
    });

    it("shows real data for repos with data and setup button for repos without", async () => {
      mockUseAccountContext.mockReturnValue(defaultAccountContext);
      mockGetRepoCoverage
        .mockResolvedValueOnce(mockRealData) // repo-one
        .mockResolvedValueOnce([]); // repo-two

      render(<ChartsPage />);

      await waitFor(() => {
        expect(screen.getByText("repo-one")).toBeInTheDocument();
        expect(screen.getByText("repo-two")).toBeInTheDocument();
      });

      expect(screen.getByText(/Showing 1 data points/)).toBeInTheDocument();
      expect(screen.getByText(/No coverage data yet/)).toBeInTheDocument();
    });

    it("shows real data for all repos when all have data", async () => {
      mockUseAccountContext.mockReturnValue(defaultAccountContext);
      mockGetRepoCoverage.mockResolvedValue(mockRealData);

      render(<ChartsPage />);

      await waitFor(() => {
        expect(screen.getByText("repo-one")).toBeInTheDocument();
        expect(screen.getByText("repo-two")).toBeInTheDocument();
      });

      const dataMessages = screen.getAllByText(/Showing 1 data points/);
      expect(dataMessages).toHaveLength(2);
      expect(screen.queryByText(/No coverage data yet/)).not.toBeInTheDocument();
    });
  });

  describe("setup PR status", () => {
    it("shows 'in progress' message when repo has open setup PR", async () => {
      mockUseAccountContext.mockReturnValue(defaultAccountContext);
      mockGetRepoCoverage.mockResolvedValue([]);
      mockUseSetupWorkflow.mockReturnValue({
        isSettingUp: false,
        getRepoStatus: jest.fn((repoName: string) =>
          repoName === "repo-one"
            ? {
                status: "open" as const,
                url: "https://github.com/pr/1",
                number: 1,
                title: "Set up test coverage workflow",
              }
            : null,
        ),
        checkSetupPR: mockCheckSetupPR,
        triggerSetup: mockTriggerSetup,
        SetupModals: () => <></>,
      });

      render(<ChartsPage />);

      await waitFor(() => {
        expect(screen.getByText("repo-one")).toBeInTheDocument();
      });

      // repo-one should show "in progress", repo-two should show setup button
      expect(screen.getByText(/CI workflow setup in progress/)).toBeInTheDocument();
      expect(screen.getByText(/No coverage data yet/)).toBeInTheDocument();
    });

    it("shows bot message when repo has closed setup PR", async () => {
      mockUseAccountContext.mockReturnValue(defaultAccountContext);
      mockGetRepoCoverage.mockResolvedValue([]);
      mockUseSetupWorkflow.mockReturnValue({
        isSettingUp: false,
        getRepoStatus: jest.fn((repoName: string) =>
          repoName === "repo-one"
            ? { status: "closed" as const, message: "No testable code found in this repository." }
            : null,
        ),
        checkSetupPR: mockCheckSetupPR,
        triggerSetup: mockTriggerSetup,
        SetupModals: () => <></>,
      });

      render(<ChartsPage />);

      await waitFor(() => {
        expect(screen.getByText("repo-one")).toBeInTheDocument();
      });

      // repo-one should show the bot's message
      expect(screen.getByText("No testable code found in this repository.")).toBeInTheDocument();
      // repo-two should still show setup button
      expect(screen.getByText(/No coverage data yet/)).toBeInTheDocument();
    });

    it("checks setup PRs on load for repos with no data", async () => {
      mockUseAccountContext.mockReturnValue(defaultAccountContext);
      mockGetRepoCoverage.mockResolvedValue([]);

      render(<ChartsPage />);

      await waitFor(() => {
        expect(mockCheckSetupPR).toHaveBeenCalledWith({
          ownerName: "test-owner",
          repoName: "repo-one",
          installationId: 123,
        });
        expect(mockCheckSetupPR).toHaveBeenCalledWith({
          ownerName: "test-owner",
          repoName: "repo-two",
          installationId: 123,
        });
      });
    });
  });
});
