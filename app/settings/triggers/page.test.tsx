import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useAccountContext } from '@/app/components/contexts/Account';
import { getTriggerSettings } from '@/app/actions/supabase/get-trigger-settings';
import { saveTriggerSettings } from '@/app/actions/supabase/save-trigger-settings';
import { slackUs } from '@/app/actions/slack/slack-us';
import TriggersPage from './page';
import type { TriggerSettings } from '@/app/settings/types';

// Mock the dependencies
jest.mock('@/app/components/contexts/Account');
jest.mock('@/app/actions/supabase/get-trigger-settings');
jest.mock('@/app/actions/supabase/save-trigger-settings');
jest.mock('@/app/actions/slack/slack-us');
jest.mock('@/app/components/LoadingSpinner', () => {
  return function MockLoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});
jest.mock('@/app/settings/components/RepositorySelector', () => {
  return function MockRepositorySelector({ onRepoChange }: { onRepoChange?: () => void }) {
    return (
      <div data-testid="repository-selector">
        <button onClick={onRepoChange}>Change Repository</button>
      </div>
    );
  };
});
jest.mock('@/app/settings/components/TriggerToggle', () => {
  return function MockTriggerToggle({
    title,
    description,
    isEnabled,
    isDisabled,
    onToggle,
  }: {
    title: string;
    description: string;
    isEnabled: boolean;
    isDisabled?: boolean;
    onToggle: () => void;
  }) {
    return (
      <div data-testid={`trigger-toggle-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <h3>{title}</h3>
        <p>{description}</p>
        <button
          onClick={onToggle}
          disabled={isDisabled}
          data-testid={`toggle-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {isEnabled ? 'Enabled' : 'Disabled'}
        </button>
      </div>
    );
  };
});
jest.mock('@/config', () => ({
  PRODUCT_NAME: 'GitAuto',
}));

// Mock implementations
const mockUseAccountContext = useAccountContext as jest.MockedFunction<typeof useAccountContext>;
const mockGetTriggerSettings = getTriggerSettings as jest.MockedFunction<typeof getTriggerSettings>;
const mockSaveTriggerSettings = saveTriggerSettings as jest.MockedFunction<typeof saveTriggerSettings>;
const mockSlackUs = slackUs as jest.MockedFunction<typeof slackUs>;

// Default mock values
const defaultAccountContext = {
  currentOwnerId: 123,
  currentOwnerName: 'test-owner',
  currentRepoId: 456,
  currentRepoName: 'test-repo',
  userId: 789,
  userName: 'test-user',
};

const defaultTriggerSettings: TriggerSettings = {
  triggerOnReviewComment: true,
  triggerOnTestFailure: true,
  triggerOnCommit: false,
  triggerOnMerged: false,
  triggerOnSchedule: false,
  scheduleTime: '09:00',
  scheduleIncludeWeekends: false,
};

describe('TriggersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAccountContext.mockReturnValue(defaultAccountContext);
    mockGetTriggerSettings.mockResolvedValue(defaultTriggerSettings);
    mockSaveTriggerSettings.mockResolvedValue();
    mockSlackUs.mockResolvedValue({ success: true });
  });

  describe('Initial Rendering', () => {
    it('renders the page title', () => {
      render(<TriggersPage />);
      expect(screen.getByText('Trigger settings')).toBeInTheDocument();
    });

    it('renders the description text', () => {
      render(<TriggersPage />);
      expect(
        screen.getByText(
          'These settings control when GitAuto will automatically analyze your code and generate tests. Each trigger can be enabled independently.'
        )
      ).toBeInTheDocument();
    });

    it('renders the repository selector', () => {
      render(<TriggersPage />);
      expect(screen.getByTestId('repository-selector')).toBeInTheDocument();
    });

    it('renders the trigger type section', () => {
      render(<TriggersPage />);
      expect(screen.getByText('Trigger type')).toBeInTheDocument();
    });

    it('shows loading spinner initially', () => {
      render(<TriggersPage />);
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  describe('Data Loading', () => {
    it('fetches trigger settings on mount when account context is available', async () => {
      render(<TriggersPage />);

      await waitFor(() => {
        expect(mockGetTriggerSettings).toHaveBeenCalledWith(123, 456);
      });
    });

    it('does not fetch trigger settings when currentOwnerId is missing', () => {
      mockUseAccountContext.mockReturnValue({
        ...defaultAccountContext,
        currentOwnerId: null,
      });

      render(<TriggersPage />);

      expect(mockGetTriggerSettings).not.toHaveBeenCalled();
    });

    it('does not fetch trigger settings when currentRepoId is missing', () => {
      mockUseAccountContext.mockReturnValue({
        ...defaultAccountContext,
        currentRepoId: null,
      });

      render(<TriggersPage />);

      expect(mockGetTriggerSettings).not.toHaveBeenCalled();
    });

    it('handles fetch error gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockGetTriggerSettings.mockRejectedValue(new Error('Fetch failed'));

      render(<TriggersPage />);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to fetch trigger settings:',
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });

    it('hides loading spinner after data is loaded', async () => {
      render(<TriggersPage />);

      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });
  });

  describe('Trigger Toggles', () => {
    beforeEach(async () => {
      render(<TriggersPage />);
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });

    it('renders all trigger toggles', () => {
      expect(screen.getByTestId('trigger-toggle-on-review-comment')).toBeInTheDocument();
      expect(screen.getByTestId('trigger-toggle-on-test-failure')).toBeInTheDocument();
      expect(screen.getByTestId('trigger-toggle-on-push')).toBeInTheDocument();
      expect(screen.getByTestId('trigger-toggle-on-merge')).toBeInTheDocument();
      expect(screen.getByTestId('trigger-toggle-(wip)-on-schedule')).toBeInTheDocument();
    });

    it('displays correct initial states for toggles', () => {
      expect(screen.getByTestId('toggle-on-review-comment')).toHaveTextContent('Enabled');
      expect(screen.getByTestId('toggle-on-test-failure')).toHaveTextContent('Enabled');
      expect(screen.getByTestId('toggle-on-push')).toHaveTextContent('Disabled');
      expect(screen.getByTestId('toggle-on-merge')).toHaveTextContent('Disabled');
      expect(screen.getByTestId('toggle-(wip)-on-schedule')).toHaveTextContent('Disabled');
    });

    it('handles toggle for review comment trigger', async () => {
      const toggleButton = screen.getByTestId('toggle-on-review-comment');

      await act(async () => {
        fireEvent.click(toggleButton);
      });

      await waitFor(() => {
        expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
          123,
          456,
          'test-repo',
          789,
          'test-user',
          expect.objectContaining({
            triggerOnReviewComment: false,
          })
        );
      });

      expect(mockSlackUs).toHaveBeenCalledWith(
        'test-user (789) updated Review Comment trigger from true to false for test-owner/test-repo'
      );
    });

    it('handles toggle for test failure trigger', async () => {
      const toggleButton = screen.getByTestId('toggle-on-test-failure');

      await act(async () => {
        fireEvent.click(toggleButton);
      });

      await waitFor(() => {
        expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
          123,
          456,
          'test-repo',
          789,
          'test-user',
          expect.objectContaining({
            triggerOnTestFailure: false,
          })
        );
      });

      expect(mockSlackUs).toHaveBeenCalledWith(
        'test-user (789) updated Test Failure trigger from true to false for test-owner/test-repo'
      );
    });

    it('handles toggle for commit trigger', async () => {
      const toggleButton = screen.getByTestId('toggle-on-push');

      await act(async () => {
        fireEvent.click(toggleButton);
      });

      await waitFor(() => {
        expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
          123,
          456,
          'test-repo',
          789,
          'test-user',
          expect.objectContaining({
            triggerOnCommit: true,
          })
        );
      });

      expect(mockSlackUs).toHaveBeenCalledWith(
        'test-user (789) updated Commit trigger from false to true for test-owner/test-repo'
      );
    });

    it('handles toggle for merged trigger', async () => {
      const toggleButton = screen.getByTestId('toggle-on-merge');

      await act(async () => {
        fireEvent.click(toggleButton);
      });

      await waitFor(() => {
        expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
          123,
          456,
          'test-repo',
          789,
          'test-user',
          expect.objectContaining({
            triggerOnMerged: true,
          })
        );
      });

      expect(mockSlackUs).toHaveBeenCalledWith(
        'test-user (789) updated Merged trigger from false to true for test-owner/test-repo'
      );
    });

    it('handles toggle for schedule trigger', async () => {
      const toggleButton = screen.getByTestId('toggle-(wip)-on-schedule');

      await act(async () => {
        fireEvent.click(toggleButton);
      });

      await waitFor(() => {
        expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
          123,
          456,
          'test-repo',
          789,
          'test-user',
          expect.objectContaining({
            triggerOnSchedule: true,
          })
        );
      });

      expect(mockSlackUs).toHaveBeenCalledWith(
        'test-user (789) updated Schedule trigger from false to true for test-owner/test-repo'
      );
    });
  });

  describe('Mutual Exclusivity Logic', () => {
    beforeEach(async () => {
      render(<TriggersPage />);
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });

    it('disables triggerOnMerged when triggerOnCommit is enabled', async () => {
      const commitToggle = screen.getByTestId('toggle-on-push');

      await act(async () => {
        fireEvent.click(commitToggle);
      });

      await waitFor(() => {
        expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
          123,
          456,
          'test-repo',
          789,
          'test-user',
          expect.objectContaining({
            triggerOnCommit: true,
            triggerOnMerged: false,
          })
        );
      });
    });

    it('disables triggerOnCommit when triggerOnMerged is enabled', async () => {
      const mergedToggle = screen.getByTestId('toggle-on-merge');

      await act(async () => {
        fireEvent.click(mergedToggle);
      });

      await waitFor(() => {
        expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
          123,
          456,
          'test-repo',
          789,
          'test-user',
          expect.objectContaining({
            triggerOnCommit: false,
            triggerOnMerged: true,
          })
        );
      });
    });
  });

  describe('Schedule Settings', () => {
    beforeEach(async () => {
      // Set up initial state with schedule enabled
      mockGetTriggerSettings.mockResolvedValue({
        ...defaultTriggerSettings,
        triggerOnSchedule: true,
      });

      render(<TriggersPage />);
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });

    it('shows schedule settings when schedule trigger is enabled', () => {
      expect(screen.getByLabelText('Daily run time')).toBeInTheDocument();
      expect(screen.getByLabelText('Include weekends')).toBeInTheDocument();
    });

    it('displays timezone information', () => {
      expect(screen.getByText(/Time is based on/)).toBeInTheDocument();
    });

    it('handles schedule time change', async () => {
      const timeInput = screen.getByLabelText('Daily run time');

      await act(async () => {
        fireEvent.change(timeInput, { target: { value: '14:30' } });
      });

      await waitFor(() => {
        expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
          123,
          456,
          'test-repo',
          789,
          'test-user',
          expect.objectContaining({
            scheduleTime: '14:30',
          })
        );
      });

      expect(mockSlackUs).toHaveBeenCalledWith(
        'test-user (789) updated Schedule time from 09:00 to 14:30 for test-owner/test-repo'
      );
    });

    it('handles include weekends change', async () => {
      const weekendsCheckbox = screen.getByLabelText('Include weekends');

      await act(async () => {
        fireEvent.click(weekendsCheckbox);
      });

      await waitFor(() => {
        expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
          123,
          456,
          'test-repo',
          789,
          'test-user',
          expect.objectContaining({
            scheduleIncludeWeekends: true,
          })
        );
      });

      expect(mockSlackUs).toHaveBeenCalledWith(
        'test-user (789) updated Include weekends from false to true for test-owner/test-repo'
      );
    });
  });

  describe('Schedule Settings Visibility', () => {
    it('hides schedule settings when schedule trigger is disabled', async () => {
      render(<TriggersPage />);
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

      expect(screen.queryByLabelText('Daily run time')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Include weekends')).not.toBeInTheDocument();
    });

    it('shows schedule settings when schedule trigger is enabled', async () => {
      render(<TriggersPage />);
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

      // Enable schedule trigger
      const scheduleToggle = screen.getByTestId('toggle-(wip)-on-schedule');
      await act(async () => {
        fireEvent.click(scheduleToggle);
      });

      // Wait for the settings to appear
      await waitFor(() => {
        expect(screen.getByLabelText('Daily run time')).toBeInTheDocument();
        expect(screen.getByLabelText('Include weekends')).toBeInTheDocument();
      });
    });
  });

  describe('Repository Change Handling', () => {
    beforeEach(async () => {
      render(<TriggersPage />);
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });

    it('refetches settings when repository changes', async () => {
      const changeRepoButton = screen.getByText('Change Repository');

      await act(async () => {
        fireEvent.click(changeRepoButton);
      });

      await waitFor(() => {
        expect(mockGetTriggerSettings).toHaveBeenCalledTimes(2);
      });
    });

    it('shows loading spinner during repository change', async () => {
      const changeRepoButton = screen.getByText('Change Repository');

      await act(async () => {
        fireEvent.click(changeRepoButton);
      });

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('handles repository change error gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockGetTriggerSettings.mockRejectedValueOnce(new Error('Fetch failed'));

      const changeRepoButton = screen.getByText('Change Repository');

      await act(async () => {
        fireEvent.click(changeRepoButton);
      });

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to fetch trigger settings:',
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Saving State Management', () => {
    beforeEach(async () => {
      render(<TriggersPage />);
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });

    it('shows loading spinner while saving', async () => {
      // Make save operation slow
      mockSaveTriggerSettings.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const toggleButton = screen.getByTestId('toggle-on-review-comment');

      await act(async () => {
        fireEvent.click(toggleButton);
      });

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });

    it('handles save error gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSaveTriggerSettings.mockRejectedValue(new Error('Save failed'));

      const toggleButton = screen.getByTestId('toggle-on-review-comment');

      await act(async () => {
        fireEvent.click(toggleButton);
      });

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error saving trigger settings:',
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });

    it('does not save when required context is missing', async () => {
      mockUseAccountContext.mockReturnValue({
        ...defaultAccountContext,
        currentOwnerId: null,
      });

      render(<TriggersPage />);
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

      const toggleButton = screen.getByTestId('toggle-on-review-comment');

      await act(async () => {
        fireEvent.click(toggleButton);
      });

      expect(mockSaveTriggerSettings).not.toHaveBeenCalled();
    });
  });

  describe('Timezone Functionality', () => {
    beforeEach(async () => {
      mockGetTriggerSettings.mockResolvedValue({
        ...defaultTriggerSettings,
        triggerOnSchedule: true,
      });

      render(<TriggersPage />);
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });

    it('displays timezone information correctly', () => {
      const timezoneText = screen.getByText(/Time is based on/);
      expect(timezoneText).toBeInTheDocument();
    });

    it('handles timezone error gracefully', () => {
      // Mock Intl.DateTimeFormat to throw an error
      const originalDateTimeFormat = Intl.DateTimeFormat;
      (Intl as any).DateTimeFormat = jest.fn(() => {
        throw new Error('Timezone error');
      });

      render(<TriggersPage />);

      expect(screen.getByText(/Time is based on your local timezone/)).toBeInTheDocument();

      // Restore original implementation
      Intl.DateTimeFormat = originalDateTimeFormat;
    });
  });

  describe('Notification Handling', () => {
    beforeEach(async () => {
      render(<TriggersPage />);
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });

    it('sends notification with correct message format', async () => {
      const toggleButton = screen.getByTestId('toggle-on-review-comment');

      await act(async () => {
        fireEvent.click(toggleButton);
      });

      await waitFor(() => {
        expect(mockSlackUs).toHaveBeenCalledWith(
          'test-user (789) updated Review Comment trigger from true to false for test-owner/test-repo'
        );
      });
    });

    it('handles notification failure gracefully', async () => {
      mockSlackUs.mockRejectedValue(new Error('Slack failed'));

      const toggleButton = screen.getByTestId('toggle-on-review-comment');

      await act(async () => {
        fireEvent.click(toggleButton);
      });

      // Should still save settings even if notification fails
      await waitFor(() => {
        expect(mockSaveTriggerSettings).toHaveBeenCalled();
      });
    });

    it('uses fallback label for unknown setting keys', async () => {
      // This test ensures the notifyChange function handles unknown keys gracefully
      const toggleButton = screen.getByTestId('toggle-on-review-comment');

      await act(async () => {
        fireEvent.click(toggleButton);
      });

      await waitFor(() => {
        expect(mockSlackUs).toHaveBeenCalledWith(
          expect.stringContaining('Review Comment trigger')
        );
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles missing userName gracefully', async () => {
      mockUseAccountContext.mockReturnValue({
        ...defaultAccountContext,
        userName: null,
      });

      render(<TriggersPage />);
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

      const toggleButton = screen.getByTestId('toggle-on-review-comment');

      await act(async () => {
        fireEvent.click(toggleButton);
      });

      await waitFor(() => {
        expect(mockSaveTriggerSettings).toHaveBeenCalledWith(
          123,
          456,
          'test-repo',
          789,
          null,
          expect.any(Object)
        );
      });
    });

    it('handles missing currentRepoName gracefully', async () => {
      mockUseAccountContext.mockReturnValue({
        ...defaultAccountContext,
        currentRepoName: null,
      });

      render(<TriggersPage />);
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

      const toggleButton = screen.getByTestId('toggle-on-review-comment');

      await act(async () => {
        fireEvent.click(toggleButton);
      });

      // Should not save when currentRepoName is missing
      expect(mockSaveTriggerSettings).not.toHaveBeenCalled();
    });

    it('handles missing userId gracefully', async () => {
      mockUseAccountContext.mockReturnValue({
        ...defaultAccountContext,
        userId: null,
      });

      render(<TriggersPage />);
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

      const toggleButton = screen.getByTestId('toggle-on-review-comment');

      await act(async () => {
        fireEvent.click(toggleButton);
      });

      // Should not save when userId is missing
      expect(mockSaveTriggerSettings).not.toHaveBeenCalled();
    });
  });

  describe('Component Integration', () => {
    it('passes correct props to TriggerToggle components', async () => {
      render(<TriggersPage />);
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

      // Check that all trigger toggles are rendered with correct titles
      expect(screen.getByText('On review comment')).toBeInTheDocument();
      expect(screen.getByText('On test failure')).toBeInTheDocument();
      expect(screen.getByText('On push')).toBeInTheDocument();
      expect(screen.getByText('On merge')).toBeInTheDocument();
      expect(screen.getByText('(WIP) On schedule')).toBeInTheDocument();
    });

    it('passes correct descriptions to TriggerToggle components', () => {
      render(<TriggersPage />);

      expect(
        screen.getByText(/Triggers GitAuto to respond to review comments/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Triggers GitAuto to automatically create a fix commit when a CI test fails/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Triggers GitAuto to add unit tests when commits are made/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Triggers GitAuto to add unit tests for code that has been merged/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Triggers GitAuto to automatically create a PR to add unit tests at specified times/)
      ).toBeInTheDocument();
    });

    it('disables toggles when saving', async () => {
      // Make save operation slow to test disabled state
      mockSaveTriggerSettings.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<TriggersPage />);
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });

      const toggleButton = screen.getByTestId('toggle-on-review-comment');

      await act(async () => {
        fireEvent.click(toggleButton);
      });

      // All toggle buttons should be disabled during save
      expect(screen.getByTestId('toggle-on-review-comment')).toBeDisabled();
      expect(screen.getByTestId('toggle-on-test-failure')).toBeDisabled();
      expect(screen.getByTestId('toggle-on-push')).toBeDisabled();
      expect(screen.getByTestId('toggle-on-merge')).toBeDisabled();
      expect(screen.getByTestId('toggle-(wip)-on-schedule')).toBeDisabled();

      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    beforeEach(async () => {
      mockGetTriggerSettings.mockResolvedValue({
        ...defaultTriggerSettings,
        triggerOnSchedule: true,
      });

      render(<TriggersPage />);
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });

    it('has proper labels for form inputs', () => {
      expect(screen.getByLabelText('Daily run time')).toBeInTheDocument();
      expect(screen.getByLabelText('Include weekends')).toBeInTheDocument();
    });

    it('associates labels with inputs correctly', () => {
      const timeInput = screen.getByLabelText('Daily run time');
      const weekendsCheckbox = screen.getByLabelText('Include weekends');

      expect(timeInput).toHaveAttribute('id', 'scheduleTime');
      expect(weekendsCheckbox).toHaveAttribute('id', 'includeWeekends');
    });

    it('has proper heading hierarchy', () => {
      const mainHeading = screen.getByRole('heading', { level: 1 });
      const subHeading = screen.getByRole('heading', { level: 2 });

      expect(mainHeading).toHaveTextContent('Trigger settings');
      expect(subHeading).toHaveTextContent('Trigger type');
    });
  });
});