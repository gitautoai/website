import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useAccountContext } from "@/app/components/contexts/Account";
import { getTriggerSettings } from "@/app/actions/supabase/get-trigger-settings";
import { saveTriggerSettings } from "@/app/actions/supabase/save-trigger-settings";
import { createOrUpdateSchedule } from "@/app/actions/aws/create-or-update-schedule";
import { deleteSchedule } from "@/app/actions/aws/delete-schedule";
import { slackUs } from "@/app/actions/slack/slack-us";
import TriggersPage from "./page";

jest.mock("@/config", () => ({
  PRODUCT_NAME: "GitAuto",
}));
jest.mock("@/app/components/contexts/Account");
jest.mock("@/app/actions/supabase/get-trigger-settings");
jest.mock("@/app/actions/supabase/save-trigger-settings");
jest.mock("@/app/actions/aws/create-or-update-schedule");
jest.mock("@/app/actions/aws/delete-schedule");
jest.mock("@/app/actions/slack/slack-us");
jest.mock("@/app/components/LoadingSpinner", () => {
  return function LoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});
jest.mock("@/app/settings/components/RepositorySelector", () => {
  return function RepositorySelector({ onRepoChange }: { onRepoChange: () => void }) {
    return (
      <div data-testid="repository-selector">
        <button onClick={onRepoChange}>Change Repository</button>
      </div>
    );
  };
});
jest.mock("@/app/settings/components/TriggerToggle", () => {
  return function TriggerToggle({
    title,
    description,
    isEnabled,
    isDisabled,
    onToggle,
  }: {
    title: string;
    description: string;
    isEnabled: boolean;
    isDisabled: boolean;
    onToggle: () => void;
  }) {
    return (
      <div data-testid={`trigger-toggle-${title.toLowerCase().replace(/\s+/g, "-")}`}>
        <span>{title}</span>
        <span>{description}</span>
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
    currentOwnerType: "Organization",
    currentOwnerName: "test-org",
    currentRepoId: 456,
    currentRepoName: "test-repo",
    userId: "user123",
    userName: "testuser",
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
    
    Object.defineProperty(window, "Intl", {
      value: {
        DateTimeFormat: jest.fn(() => ({
          resolvedOptions: jest.fn(() => ({ timeZone: "America/New_York" })),
        })),
      },
      writable: true,
    });
    
    jest.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(300);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render the page title and description", () => {
    render(<TriggersPage />);
    
    expect(screen.getByText("Trigger settings")).toBeInTheDocument();
    expect(screen.getByText(/These settings control when GitAuto will automatically analyze/)).toBeInTheDocument();
  });

  it("should show loading spinner initially", () => {
    render(<TriggersPage />);
    
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should fetch trigger settings on mount", async () => {
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(mockGetTriggerSettings).toHaveBeenCalledWith(123, 456);
    });
  });

  it("should not fetch settings when currentOwnerId or currentRepoId is missing", () => {
    mockUseAccountContext.mockReturnValue({
      ...mockAccountContext,
      currentOwnerId: null,
      currentRepoId: null,
    });
    
    render(<TriggersPage />);
    
    expect(mockGetTriggerSettings).not.toHaveBeenCalled();
  });

  it("should handle fetch settings error gracefully", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    mockGetTriggerSettings.mockRejectedValue(new Error("Failed to fetch"));
    
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to fetch trigger settings:", expect.any(Error));
    });
    
    consoleErrorSpy.mockRestore();
  });

  it("should render all trigger toggles", async () => {
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("trigger-toggle-on-review-comment")).toBeInTheDocument();
      expect(screen.getByTestId("trigger-toggle-on-test-failure")).toBeInTheDocument();
      expect(screen.getByTestId("trigger-toggle-on-push")).toBeInTheDocument();
      expect(screen.getByTestId("trigger-toggle-on-merge")).toBeInTheDocument();
      expect(screen.getByTestId("trigger-toggle-on-schedule")).toBeInTheDocument();
    });
  });

  it("should toggle trigger settings and save", async () => {
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("trigger-toggle-on-push")).toBeInTheDocument();
    });
    
    const pushToggle = screen.getByTestId("trigger-toggle-on-push").querySelector("button");
    fireEvent.click(pushToggle!);
    
    await waitFor(() => {
      expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
        123,
        456,
        "test-repo",
        "user123",
        "testuser",
        {
          ...mockTriggerSettings,
          triggerOnCommit: true,
          triggerOnMerged: false,
        }
      );
    });
    
    expect(mockSlackUs).toHaveBeenCalledWith(
      "testuser (user123) updated Commit trigger from false to true for test-org/test-repo"
    );
  });

  it("should disable triggerOnMerged when enabling triggerOnCommit", async () => {
    mockGetTriggerSettings.mockResolvedValue({
      ...mockTriggerSettings,
      triggerOnMerged: true,
    });
    
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("trigger-toggle-on-push")).toBeInTheDocument();
    });
    
    const pushToggle = screen.getByTestId("trigger-toggle-on-push").querySelector("button");
    fireEvent.click(pushToggle!);
    
    await waitFor(() => {
      expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
        123,
        456,
        "test-repo",
        "user123",
        "testuser",
        expect.objectContaining({
          triggerOnCommit: true,
          triggerOnMerged: false,
        })
      );
    });
  });

  it("should disable triggerOnCommit when enabling triggerOnMerged", async () => {
    mockGetTriggerSettings.mockResolvedValue({
      ...mockTriggerSettings,
      triggerOnCommit: true,
    });
    
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("trigger-toggle-on-merge")).toBeInTheDocument();
    });
    
    const mergeToggle = screen.getByTestId("trigger-toggle-on-merge").querySelector("button");
    fireEvent.click(mergeToggle!);
    
    await waitFor(() => {
      expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
        123,
        456,
        "test-repo",
        "user123",
        "testuser",
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
      expect(screen.getByTestId("trigger-toggle-on-schedule")).toBeInTheDocument();
    });
    
    const scheduleToggle = screen.getByTestId("trigger-toggle-on-schedule").querySelector("button");
    fireEvent.click(scheduleToggle!);
    
    await waitFor(() => {
      expect(mockCreateOrUpdateSchedule).toHaveBeenCalledWith({
        ownerId: 123,
        ownerType: "Organization",
        ownerName: "test-org",
        repoId: 456,
        repoName: "test-repo",
        scheduleTime: "09:00",
        includeWeekends: false,
      });
    });
  });

  it("should delete AWS schedule when disabling schedule trigger", async () => {
    mockGetTriggerSettings.mockResolvedValue({
      ...mockTriggerSettings,
      triggerOnSchedule: true,
    });
    
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("trigger-toggle-on-schedule")).toBeInTheDocument();
    });
    
    const scheduleToggle = screen.getByTestId("trigger-toggle-on-schedule").querySelector("button");
    fireEvent.click(scheduleToggle!);
    
    await waitFor(() => {
      expect(mockDeleteSchedule).toHaveBeenCalledWith(123, 456);
    });
  });

  it("should show schedule configuration when schedule trigger is enabled", async () => {
    mockGetTriggerSettings.mockResolvedValue({
      ...mockTriggerSettings,
      triggerOnSchedule: true,
    });
    
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByLabelText("Daily run time")).toBeInTheDocument();
      expect(screen.getByLabelText("Include weekends")).toBeInTheDocument();
    });
  });

  it("should handle schedule time change", async () => {
    mockGetTriggerSettings.mockResolvedValue({
      ...mockTriggerSettings,
      triggerOnSchedule: true,
    });
    
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByLabelText("Daily run time")).toBeInTheDocument();
    });
    
    const timeInput = screen.getByLabelText("Daily run time");
    fireEvent.change(timeInput, { target: { value: "14:30" } });
    
    await waitFor(() => {
      expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
        123,
        456,
        "test-repo",
        "user123",
        "testuser",
        expect.objectContaining({
          scheduleTime: "14:30",
        })
      );
    });
    
    expect(mockSlackUs).toHaveBeenCalledWith(
      "testuser (user123) updated Schedule time from 09:00 to 14:30 for test-org/test-repo"
    );
  });

  it("should handle include weekends change", async () => {
    mockGetTriggerSettings.mockResolvedValue({
      ...mockTriggerSettings,
      triggerOnSchedule: true,
    });
    
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByLabelText("Include weekends")).toBeInTheDocument();
    });
    
    const weekendsCheckbox = screen.getByLabelText("Include weekends");
    fireEvent.click(weekendsCheckbox);
    
    await waitFor(() => {
      expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
        123,
        456,
        "test-repo",
        "user123",
        "testuser",
        expect.objectContaining({
          scheduleIncludeWeekends: true,
        })
      );
    });
    
    expect(mockSlackUs).toHaveBeenCalledWith(
      "testuser (user123) updated Include weekends from false to true for test-org/test-repo"
    );
  });

  it("should not save settings when required context values are missing", async () => {
    mockUseAccountContext.mockReturnValue({
      ...mockAccountContext,
      currentOwnerId: null,
    });
    
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("trigger-toggle-on-push")).toBeInTheDocument();
    });
    
    const pushToggle = screen.getByTestId("trigger-toggle-on-push").querySelector("button");
    fireEvent.click(pushToggle!);
    
    expect(mockSaveTriggerSettings).not.toHaveBeenCalled();
  });

  it("should handle save settings error gracefully", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    mockSaveTriggerSettings.mockRejectedValue(new Error("Save failed"));
    
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("trigger-toggle-on-push")).toBeInTheDocument();
    });
    
    const pushToggle = screen.getByTestId("trigger-toggle-on-push").querySelector("button");
    fireEvent.click(pushToggle!);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error saving trigger settings:", expect.any(Error));
    });
    
    consoleErrorSpy.mockRestore();
  });

  it("should show saving state during save operations", async () => {
    let resolveSave: () => void;
    const savePromise = new Promise<void>((resolve) => {
      resolveSave = resolve;
    });
    mockSaveTriggerSettings.mockReturnValue(savePromise);
    
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("trigger-toggle-on-push")).toBeInTheDocument();
    });
    
    const pushToggle = screen.getByTestId("trigger-toggle-on-push").querySelector("button");
    fireEvent.click(pushToggle!);
    
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    
    resolveSave!();
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });
  });

  it("should handle repository change", async () => {
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("repository-selector")).toBeInTheDocument();
    });
    
    const changeRepoButton = screen.getByText("Change Repository");
    fireEvent.click(changeRepoButton);
    
    await waitFor(() => {
      expect(mockGetTriggerSettings).toHaveBeenCalledTimes(2);
    });
  });

  it("should handle repository change error gracefully", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    mockGetTriggerSettings
      .mockResolvedValueOnce(mockTriggerSettings)
      .mockRejectedValueOnce(new Error("Fetch failed"));
    
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("repository-selector")).toBeInTheDocument();
    });
    
    const changeRepoButton = screen.getByText("Change Repository");
    fireEvent.click(changeRepoButton);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to fetch trigger settings:", expect.any(Error));
    });
    
    consoleErrorSpy.mockRestore();
  });

  it("should display timezone information", async () => {
    render(<TriggersPage />);
    
    mockGetTriggerSettings.mockResolvedValue({
      ...mockTriggerSettings,
      triggerOnSchedule: true,
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Time is based on America\/New_York \(UTC-5\)/)).toBeInTheDocument();
    });
  });

  it("should handle timezone detection error gracefully", async () => {
    Object.defineProperty(window, "Intl", {
      value: {
        DateTimeFormat: jest.fn(() => {
          throw new Error("Timezone error");
        }),
      },
      writable: true,
    });
    
    mockGetTriggerSettings.mockResolvedValue({
      ...mockTriggerSettings,
      triggerOnSchedule: true,
    });
    
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Time is based on your local timezone/)).toBeInTheDocument();
    });
  });

  it("should disable inputs during save operations", async () => {
    let resolveSave: () => void;
    const savePromise = new Promise<void>((resolve) => {
      resolveSave = resolve;
    });
    mockSaveTriggerSettings.mockReturnValue(savePromise);
    
    mockGetTriggerSettings.mockResolvedValue({
      ...mockTriggerSettings,
      triggerOnSchedule: true,
    });
    
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByLabelText("Daily run time")).toBeInTheDocument();
    });
    
    const timeInput = screen.getByLabelText("Daily run time");
    fireEvent.change(timeInput, { target: { value: "14:30" } });
    
    expect(timeInput).toBeDisabled();
    expect(screen.getByLabelText("Include weekends")).toBeDisabled();
    
    resolveSave!();
    await waitFor(() => {
      expect(timeInput).not.toBeDisabled();
      expect(screen.getByLabelText("Include weekends")).not.toBeDisabled();
    });
  });

  it("should handle positive timezone offset", () => {
    jest.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(-540); // UTC+9
    
    mockGetTriggerSettings.mockResolvedValue({
      ...mockTriggerSettings,
      triggerOnSchedule: true,
    });
    
    render(<TriggersPage />);
    
    expect(screen.getByText(/Time is based on America\/New_York \(UTC\+9\)/)).toBeInTheDocument();
  });
});
