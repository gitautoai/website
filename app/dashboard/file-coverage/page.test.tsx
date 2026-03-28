jest.mock("@/app/actions/github/get-owner-ids", () => ({ getOwnerIds: jest.fn() }));
jest.mock("@/app/actions/github/get-installed-repos", () => ({ getInstalledRepos: jest.fn() }));
jest.mock("@/app/actions/supabase/installations/get-installations-by-owner-ids", () => ({
  getInstallationsByOwnerIds: jest.fn(),
}));
jest.mock("@/app/actions/supabase/owners/get-owners", () => ({ getOwners: jest.fn() }));
jest.mock("@/app/actions/stripe/check-active-subscription", () => ({
  checkActiveSubscription: jest.fn(),
}));
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({ data: null, status: "unauthenticated" })),
  signOut: jest.fn(),
}));
jest.mock("swr", () => jest.fn(() => ({ data: undefined, error: undefined })));
jest.mock("@/app/components/contexts/Account");
jest.mock("@/app/actions/supabase/coverage/toggle-exclusion");
jest.mock("@/app/actions/sync-repository-files", () => ({
  syncRepositoryFiles: jest.fn(),
}));
jest.mock("@/app/hooks/use-setup-workflow", () => ({
  useSetupWorkflow: jest.fn(),
}));
jest.mock("@/app/components/DocsLink", () => () => null);
jest.mock("@/app/components/ErrorBanner", () => () => null);
jest.mock("@/app/components/LoadingSpinner", () => () => null);
jest.mock("@/app/components/Modal", () => () => null);
jest.mock("@/app/components/Toast", () => () => null);
jest.mock("@/app/dashboard/components/RepositorySelector", () => () => null);
jest.mock("./components/ActionsDropdown", () => () => null);
jest.mock("./components/CoverageStats", () => () => null);
jest.mock("./components/TableHeader", () => () => null);
jest.mock("./components/TableRow", () => () => null);
jest.mock("./handlers/fetch-coverage-data", () => ({
  fetchCoverageData: jest.fn().mockResolvedValue([]),
}));

import { render, screen } from "@testing-library/react";
import { useAccountContext } from "@/app/components/contexts/Account";
import { useSetupWorkflow } from "@/app/hooks/use-setup-workflow";
import CoveragePage from "./page";

const mockUseAccountContext = useAccountContext as jest.MockedFunction<typeof useAccountContext>;
const mockUseSetupWorkflow = useSetupWorkflow as jest.MockedFunction<typeof useSetupWorkflow>;

describe("CoveragePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAccountContext.mockReturnValue({
      currentOwnerId: "owner-1",
      currentRepoId: "repo-1",
      currentRepoName: "test-repo",
      currentOwnerName: "test-owner",
      currentInstallationId: 123,
      organizations: [
        { ownerName: "test-owner", repositories: [{ repoId: "repo-1", repoName: "test-repo" }] },
      ],
      userLogin: "user1",
      userName: "Test User",
    } as any);

    mockUseSetupWorkflow.mockReturnValue({
      isSettingUp: false,
      getRepoStatus: jest.fn(() => null),
      checkSetupPR: jest.fn(),
      triggerSetup: jest.fn(),
      SetupModals: () => <></>,
    });

    Object.defineProperty(window, "localStorage", {
      value: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn(), clear: jest.fn() },
    });
  });

  it("renders without crashing", () => {
    render(<CoveragePage />);
    expect(screen.getByText("Coverage Dashboard")).toBeInTheDocument();
  });
});
