import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TriggersPage from "./page";
import { useAccountContext } from "@/app/components/contexts/Account";
import { getTriggerSettings } from "@/app/actions/supabase/get-trigger-settings";
import { saveTriggerSettings } from "@/app/actions/supabase/save-trigger-settings";
import { createOrUpdateSchedule } from "@/app/actions/aws/create-or-update-schedule";
import { deleteSchedule } from "@/app/actions/aws/delete-schedule";
import { slackUs } from "@/app/actions/slack/slack-us";

// Mock all dependencies
jest.mock("@/app/components/contexts/Account");
jest.mock("@/app/actions/supabase/get-trigger-settings");
jest.mock("@/app/actions/supabase/save-trigger-settings");
jest.mock("@/app/actions/aws/create-or-update-schedule");
jest.mock("@/app/actions/aws/delete-schedule");
jest.mock("@/app/actions/slack/slack-us");
jest.mock("@/app/components/LoadingSpinner", () => {
  return function MockLoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});
jest.mock("@/app/settings/components/RepositorySelector", () => {
  return function MockRepositorySelector({ onRepoChange }: { onRepoChange: () => void }) {
    return (
      <div data-testid="repository-selector">
        <button onClick={onRepoChange}>Change Repo</button>
      </div>
    );
  };
});
jest.mock("@/app/settings/components/TriggerToggle", () => {
  return function MockTriggerToggle({
    title,
    isEnabled,
    onToggle,
    isDisabled,
  }: {
    title: string;
    isEnabled: boolean;
    onToggle: () => void;
    isDisabled: boolean;
  }) {
    return (
      <div data-testid={`trigger-toggle-${title.toLowerCase().replace(/\s+/g, "-")}`}>
        <span>{title}</span>
        <button onClick={onToggle} disabled={isDisabled}>
          {isEnabled ? "Enabled" : "Disabled"}
        </button>
      </div>
    );
  };
});

const mockUseAccountContext = useAccountContext as jest.MockedFunction<typeof useAccountContext>;
const mockGetTriggerSettings = getTriggerSettings as jest.MockedFunction<typeof getTriggerSettings>;
const mockSaveTriggerSettings = saveTriggerSettings as jest.MockedFunction<typeof saveTriggerSettings>;
const mockCreateOrUpdateSchedule = createOrUpdateSchedule as jest.MockedFunction<typeof createOrUpdateSchedule>;
const mockDeleteSchedule = deleteSchedule as jest.MockedFunction<typeof deleteSchedule>;
const mockSlackUs = slackUs as jest.MockedFunction<typeof slackUs>;

describe("TriggersPage", () => {
  const mockAccountContext = {
    currentOwnerId: 123,
    currentOwnerName: "test-owner",
    currentRepoId: 456,
    currentRepoName: "test-repo",
    userId: "user-123",
    userName: "test-user",
  };

  const mockTriggerSettings = {
    triggerOnReviewComment: true,
    triggerOnTestFailure: true,
    triggerOnCommit: false,
    triggerOnMerged: false,
    triggerOnSchedule: false,
    scheduleTime: "09:00",
    scheduleIncludeWeekends: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAccountContext.mockReturnValue(mockAccountContext);
    mockGetTriggerSettings.mockResolvedValue(mockTriggerSettings);
    mockSaveTriggerSettings.mockResolvedValue();
    mockCreateOrUpdateSchedule.mockResolvedValue();
    mockDeleteSchedule.mockResolvedValue();
    mockSlackUs.mockResolvedValue();
  });

  it("should render the page title", () => {
    render(<TriggersPage />);
    expect(screen.getByText("Trigger settings")).toBeInTheDocument();
  });

  it("should show loading spinner initially", () => {
    render(<TriggersPage />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should load trigger settings on mount", async () => {
    render(<TriggersPage />);

    await waitFor(() => {
      expect(mockGetTriggerSettings).toHaveBeenCalledWith(123, 456);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });
  });

  it("should not load settings when currentOwnerId or currentRepoId is missing", () => {
    mockUseAccountContext.mockReturnValue({
      ...mockAccountContext,
      currentOwnerId: null,
      currentRepoId: null,
    });

    render(<TriggersPage />);

    expect(mockGetTriggerSettings).not.toHaveBeenCalled();
  });

  it("should handle toggle for review comment trigger", async () => {
    render(<TriggersPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    const reviewCommentToggle = screen.getByTestId("trigger-toggle-on-review-comment");
    const toggleButton = reviewCommentToggle.querySelector("button");
    
    fireEvent.click(toggleButton!);

    await waitFor(() => {
      expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
        123,
        456,
        "test-repo",
        "user-123",
        "test-user",
        expect.objectContaining({
          triggerOnReviewComment: false,
        })
      );
    });

    expect(mockSlackUs).toHaveBeenCalledWith(
      "test-user (user-123) updated Review Comment trigger from true to false for test-owner/test-repo"
    );
  });

  it("should disable triggerOnMerged when enabling triggerOnCommit", async () => {
    const settingsWithMergedEnabled = {
      ...mockTriggerSettings,
      triggerOnMerged: true,
    };
    mockGetTriggerSettings.mockResolvedValue(settingsWithMergedEnabled);

    render(<TriggersPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    const commitToggle = screen.getByTestId("trigger-toggle-on-push");
    const toggleButton = commitToggle.querySelector("button");
    
    fireEvent.click(toggleButton!);

    await waitFor(() => {
      expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
        123,
        456,
        "test-repo",
        "user-123",
        "test-user",
        expect.objectContaining({
          triggerOnCommit: true,
          triggerOnMerged: false,
        })
      );
    });
  });

  it("should disable triggerOnCommit when enabling triggerOnMerged", async () => {
    const settingsWithCommitEnabled = {
      ...mockTriggerSettings,
      triggerOnCommit: true,
    };
    mockGetTriggerSettings.mockResolvedValue(settingsWithCommitEnabled);

    render(<TriggersPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    const mergedToggle = screen.getByTestId("trigger-toggle-on-merge");
    const toggleButton = mergedToggle.querySelector("button");
    
    fireEvent.click(toggleButton!);

    await waitFor(() => {
      expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
        123,
        456,
        "test-repo",
        "user-123",
        "test-user",
        expect.objectContaining({
          triggerOnCommit: false,
          triggerOnMerged: true,
        })
      );
    });
  });

  it("should create AWS schedule when enabling schedule trigger", async () => {
    render(<TriggersPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    const scheduleToggle = screen.getByTestId("trigger-toggle-on-schedule");
    const toggleButton = scheduleToggle.querySelector("button");
    
    fireEvent.click(toggleButton!);

    await waitFor(() => {
      expect(mockCreateOrUpdateSchedule).toHaveBeenCalledWith({
        ownerId: 123,
        repoId: 456,
        scheduleTime: "09:00",
        includeWeekends: false,
      });
    });
  });

  it("should delete AWS schedule when disabling schedule trigger", async () => {
    const settingsWithScheduleEnabled = {
      ...mockTriggerSettings,
      triggerOnSchedule: true,
    };
    mockGetTriggerSettings.mockResolvedValue(settingsWithScheduleEnabled);

    render(<TriggersPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    const scheduleToggle = screen.getByTestId("trigger-toggle-on-schedule");
    const toggleButton = scheduleToggle.querySelector("button");
    
    fireEvent.click(toggleButton!);

    await waitFor(() => {
      expect(mockDeleteSchedule).toHaveBeenCalledWith(123, 456);
    });
  });

  it("should show schedule configuration when schedule trigger is enabled", async () => {
    const settingsWithScheduleEnabled = {
      ...mockTriggerSettings,
      triggerOnSchedule: true,
    };
    mockGetTriggerSettings.mockResolvedValue(settingsWithScheduleEnabled);

    render(<TriggersPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    expect(screen.getByLabelText("Daily run time")).toBeInTheDocument();
    expect(screen.getByLabelText("Include weekends")).toBeInTheDocument();
  });

  it("should handle schedule time change", async () => {
    const settingsWithScheduleEnabled = {
      ...mockTriggerSettings,
      triggerOnSchedule: true,
    };
    mockGetTriggerSettings.mockResolvedValue(settingsWithScheduleEnabled);

    render(<TriggersPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    const timeInput = screen.getByLabelText("Daily run time");
    fireEvent.change(timeInput, { target: { value: "14:30" } });

    await waitFor(() => {
      expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
        123,
        456,
        "test-repo",
        "user-123",
        "test-user",
        expect.objectContaining({
          scheduleTime: "14:30",
        })
      );
    });
  });

  it("should handle include weekends change", async () => {
    const settingsWithScheduleEnabled = {
      ...mockTriggerSettings,
      triggerOnSchedule: true,
    };
    mockGetTriggerSettings.mockResolvedValue(settingsWithScheduleEnabled);

    render(<TriggersPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    const weekendsCheckbox = screen.getByLabelText("Include weekends");
    fireEvent.click(weekendsCheckbox);

    await waitFor(() => {
      expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
        123,
        456,
        "test-repo",
        "user-123",
        "test-user",
        expect.objectContaining({
          scheduleIncludeWeekends: true,
        })
      );
    });
  });

  it("should handle repository change", async () => {
    render(<TriggersPage />);

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    const repoSelector = screen.getByTestId("repository-selector");
    const changeButton = repoSelector.querySelector("button");
    
    fireEvent.click(changeButton!);

    await waitFor(() => {
      expect(mockGetTriggerSettings).toHaveBeenCalledTimes(2);
    });
  });

  it("should handle errors gracefully", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    mockGetTriggerSettings.mockRejectedValue(new Error("Failed to fetch"));

    render(<TriggersPage />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to fetch trigger settings:", expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});