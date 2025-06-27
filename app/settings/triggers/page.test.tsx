import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TriggersPage from "./page";

// Mock all the action imports
jest.mock("@/app/actions/supabase/get-trigger-settings");
jest.mock("@/app/actions/supabase/save-trigger-settings");
jest.mock("@/app/actions/aws/create-or-update-schedule");
jest.mock("@/app/actions/aws/delete-schedule");
jest.mock("@/app/actions/slack/slack-us");

// Mock the context
jest.mock("@/app/components/contexts/Account", () => ({
  useAccountContext: () => ({
    currentOwnerId: 123,
    currentOwnerType: "Organization",
    currentOwnerName: "test-org",
    currentRepoId: 456,
    currentRepoName: "test-repo",
    userId: 789,
    userName: "testuser",
  }),
}));

// Mock the components
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

// Import the mocked functions
import { getTriggerSettings } from "@/app/actions/supabase/get-trigger-settings";
import { saveTriggerSettings } from "@/app/actions/supabase/save-trigger-settings";
import { createOrUpdateSchedule } from "@/app/actions/aws/create-or-update-schedule";
import { deleteSchedule } from "@/app/actions/aws/delete-schedule";
import { slackUs } from "@/app/actions/slack/slack-us";

const mockGetTriggerSettings = getTriggerSettings as jest.MockedFunction<typeof getTriggerSettings>;
const mockSaveTriggerSettings = saveTriggerSettings as jest.MockedFunction<typeof saveTriggerSettings>;
const mockCreateOrUpdateSchedule = createOrUpdateSchedule as jest.MockedFunction<typeof createOrUpdateSchedule>;
const mockDeleteSchedule = deleteSchedule as jest.MockedFunction<typeof deleteSchedule>;
const mockSlackUs = slackUs as jest.MockedFunction<typeof slackUs>;

describe("TriggersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetTriggerSettings.mockResolvedValue({
      triggerOnReviewComment: true,
      triggerOnTestFailure: true,
      triggerOnCommit: false,
      triggerOnPrChange: false,
      triggerOnMerged: false,
      triggerOnSchedule: false,
      scheduleTime: "09:00",
      scheduleIncludeWeekends: false,
    });
    mockSaveTriggerSettings.mockResolvedValue();
    mockCreateOrUpdateSchedule.mockResolvedValue();
    mockDeleteSchedule.mockResolvedValue();
    mockSlackUs.mockResolvedValue();
  });

  it("should render the page title", async () => {
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByText("Trigger settings")).toBeInTheDocument();
    });
  });

  it("should render repository selector", async () => {
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("repository-selector")).toBeInTheDocument();
    });
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

  it("should render all trigger toggles", async () => {
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("trigger-toggle-on-review-comment")).toBeInTheDocument();
      expect(screen.getByTestId("trigger-toggle-on-test-failure")).toBeInTheDocument();
      expect(screen.getByTestId("trigger-toggle-on-pr-change")).toBeInTheDocument();
      expect(screen.getByTestId("trigger-toggle-on-merge")).toBeInTheDocument();
      expect(screen.getByTestId("trigger-toggle-on-schedule")).toBeInTheDocument();
    });
  });

  it("should handle toggle changes", async () => {
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("trigger-toggle-on-review-comment")).toBeInTheDocument();
    });

    const reviewCommentToggle = screen.getByTestId("trigger-toggle-on-review-comment");
    const toggleButton = reviewCommentToggle.querySelector("button");
    
    fireEvent.click(toggleButton!);

    await waitFor(() => {
      expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
        123,
        456,
        "test-repo",
        789,
        "testuser",
        expect.objectContaining({
          triggerOnReviewComment: false, // Should be toggled
        })
      );
    });
  });

  it("should handle mutual exclusivity between triggerOnMerged and triggerOnPrChange", async () => {
    mockGetTriggerSettings.mockResolvedValue({
      triggerOnReviewComment: true,
      triggerOnTestFailure: true,
      triggerOnCommit: false,
      triggerOnPrChange: true, // Initially enabled
      triggerOnMerged: false,
      triggerOnSchedule: false,
      scheduleTime: "09:00",
      scheduleIncludeWeekends: false,
    });

    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("trigger-toggle-on-merge")).toBeInTheDocument();
    });

    const mergeToggle = screen.getByTestId("trigger-toggle-on-merge");
    const toggleButton = mergeToggle.querySelector("button");
    
    fireEvent.click(toggleButton!);

    await waitFor(() => {
      expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
        123,
        456,
        "test-repo",
        789,
        "testuser",
        expect.objectContaining({
          triggerOnMerged: true,
          triggerOnPrChange: false, // Should be disabled when merge is enabled
        })
      );
    });
  });

  it("should handle schedule toggle and create AWS schedule", async () => {
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("trigger-toggle-on-schedule")).toBeInTheDocument();
    });

    const scheduleToggle = screen.getByTestId("trigger-toggle-on-schedule");
    const toggleButton = scheduleToggle.querySelector("button");
    
    fireEvent.click(toggleButton!);

    await waitFor(() => {
      expect(mockSaveTriggerSettings).toHaveBeenCalled();
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

  it("should delete AWS schedule when schedule is disabled", async () => {
    mockGetTriggerSettings.mockResolvedValue({
      triggerOnReviewComment: true,
      triggerOnTestFailure: true,
      triggerOnCommit: false,
      triggerOnPrChange: false,
      triggerOnMerged: false,
      triggerOnSchedule: true, // Initially enabled
      scheduleTime: "09:00",
      scheduleIncludeWeekends: false,
    });

    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("trigger-toggle-on-schedule")).toBeInTheDocument();
    });

    const scheduleToggle = screen.getByTestId("trigger-toggle-on-schedule");
    const toggleButton = scheduleToggle.querySelector("button");
    
    fireEvent.click(toggleButton!);

    await waitFor(() => {
      expect(mockSaveTriggerSettings).toHaveBeenCalled();
      expect(mockDeleteSchedule).toHaveBeenCalledWith(123, 456);
    });
  });

  it("should render schedule configuration when schedule is enabled", async () => {
    mockGetTriggerSettings.mockResolvedValue({
      triggerOnReviewComment: true,
      triggerOnTestFailure: true,
      triggerOnCommit: false,
      triggerOnPrChange: false,
      triggerOnMerged: false,
      triggerOnSchedule: true,
      scheduleTime: "14:30",
      scheduleIncludeWeekends: true,
    });

    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue("14:30")).toBeInTheDocument();
      expect(screen.getByRole("checkbox", { name: /include weekends/i })).toBeChecked();
    });
  });

  it("should handle schedule time changes", async () => {
    mockGetTriggerSettings.mockResolvedValue({
      triggerOnReviewComment: true,
      triggerOnTestFailure: true,
      triggerOnCommit: false,
      triggerOnPrChange: false,
      triggerOnMerged: false,
      triggerOnSchedule: true,
      scheduleTime: "09:00",
      scheduleIncludeWeekends: false,
    });

    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue("09:00")).toBeInTheDocument();
    });

    const timeInput = screen.getByDisplayValue("09:00");
    fireEvent.change(timeInput, { target: { value: "15:30" } });

    await waitFor(() => {
      expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
        123,
        456,
        "test-repo",
        789,
        "testuser",
        expect.objectContaining({
          scheduleTime: "15:30",
        })
      );
    });
  });

  it("should handle weekend checkbox changes", async () => {
    mockGetTriggerSettings.mockResolvedValue({
      triggerOnReviewComment: true,
      triggerOnTestFailure: true,
      triggerOnCommit: false,
      triggerOnPrChange: false,
      triggerOnMerged: false,
      triggerOnSchedule: true,
      scheduleTime: "09:00",
      scheduleIncludeWeekends: false,
    });

    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByRole("checkbox", { name: /include weekends/i })).toBeInTheDocument();
    });

    const weekendCheckbox = screen.getByRole("checkbox", { name: /include weekends/i });
    fireEvent.click(weekendCheckbox);

    await waitFor(() => {
      expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
        123,
        456,
        "test-repo",
        789,
        "testuser",
        expect.objectContaining({
          scheduleIncludeWeekends: true,
        })
      );
    });
  });

  it("should handle repository change", async () => {
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("repository-selector")).toBeInTheDocument();
    });

    const changeRepoButton = screen.getByText("Change Repo");
    fireEvent.click(changeRepoButton);

    await waitFor(() => {
      expect(mockGetTriggerSettings).toHaveBeenCalledTimes(2); // Initial load + repo change
    });
  });

  it("should send slack notifications on changes", async () => {
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("trigger-toggle-on-review-comment")).toBeInTheDocument();
    });

    const reviewCommentToggle = screen.getByTestId("trigger-toggle-on-review-comment");
    const toggleButton = reviewCommentToggle.querySelector("button");
    
    fireEvent.click(toggleButton!);

    await waitFor(() => {
      expect(mockSlackUs).toHaveBeenCalledWith(
        expect.stringContaining("testuser (789) updated Review Comment trigger from true to false for test-org/test-repo")
      );
    });
  });

  it("should handle errors gracefully", async () => {
    mockGetTriggerSettings.mockRejectedValue(new Error("Failed to fetch"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch trigger settings:", expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it("should show timezone information", async () => {
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Time is based on/)).toBeInTheDocument();
    });
  });

  it("should disable controls when saving", async () => {
    render(<TriggersPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId("trigger-toggle-on-review-comment")).toBeInTheDocument();
    });

    // Mock a slow save operation
    mockSaveTriggerSettings.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    const reviewCommentToggle = screen.getByTestId("trigger-toggle-on-review-comment");
    const toggleButton = reviewCommentToggle.querySelector("button");
    
    fireEvent.click(toggleButton!);

    // Should show loading spinner while saving
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });
});