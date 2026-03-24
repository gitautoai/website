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
jest.mock("@/app/actions/aws/create-or-update-schedule");
jest.mock("@/app/actions/aws/disable-schedules");
jest.mock("@/app/actions/aws/schedule-exists");
jest.mock("@/app/actions/supabase/credits/has-purchased-credits");
jest.mock("@/app/actions/supabase/schedule-pauses/add-schedule-pause");
jest.mock("@/app/actions/supabase/schedule-pauses/delete-schedule-pause");
jest.mock("@/app/actions/supabase/schedule-pauses/get-all-schedule-pauses", () => ({
  getAllSchedulePauses: jest.fn().mockResolvedValue([]),
}));
jest.mock("@/app/actions/supabase/repositories/get-all-trigger-settings", () => ({
  getAllTriggerSettings: jest.fn().mockResolvedValue([]),
}));
jest.mock("@/app/actions/supabase/repositories/upsert-repository");
jest.mock("@/app/actions/slack/slack-us");
jest.mock("@/app/hooks/use-setup-workflow", () => ({
  useSetupWorkflow: jest.fn(),
}));
jest.mock("@/app/components/LoadingSpinner", () => () => null);
jest.mock("@/app/components/Modal", () => () => null);
jest.mock("@/app/settings/components/RepositorySelector", () => () => null);

import { render, screen, waitFor } from "@testing-library/react";
import { useAccountContext } from "@/app/components/contexts/Account";
import { useSetupWorkflow } from "@/app/hooks/use-setup-workflow";
import TriggersPage from "./page";

const mockUseAccountContext = useAccountContext as jest.MockedFunction<typeof useAccountContext>;
const mockUseSetupWorkflow = useSetupWorkflow as jest.MockedFunction<typeof useSetupWorkflow>;

describe("TriggersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAccountContext.mockReturnValue({
      currentOwnerId: "owner-1",
      currentOwnerType: "Organization",
      currentOwnerName: "test-owner",
      organizations: [
        { ownerName: "test-owner", repositories: [{ repoId: "repo-1", repoName: "test-repo" }] },
      ],
      userId: "user-1",
      userLogin: "user1",
      userName: "Test User",
      currentInstallationId: 123,
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

  it("renders without crashing", async () => {
    render(<TriggersPage />);
    expect(screen.getByText("Trigger settings")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("test-repo")).toBeInTheDocument();
    });
  });
});
