import { render, screen, fireEvent } from "@testing-library/react";
import { usePostHog } from "posthog-js/react";
import { ABSOLUTE_URLS } from "@/config";
import InstallButton from "./Install";

jest.mock("posthog-js/react", () => ({
  usePostHog: jest.fn(),
}));

describe("InstallButton", () => {
  const mockCapture = jest.fn();
  const mockText = "Install GitAuto";
  const mockCurrentUrl = "http://localhost:3000";

  beforeEach(() => {
    (usePostHog as jest.Mock).mockReturnValue({
      capture: mockCapture,
    });

    Object.defineProperty(window, "location", {
      value: {
        href: mockCurrentUrl,
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders with correct text and link", () => {
    render(<InstallButton text={mockText} />);
    
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO);
    expect(link).toHaveAttribute("target", "_blank");
    expect(screen.getByText(mockText)).toBeInTheDocument();
  });

  it("captures click event with PostHog", () => {
    render(<InstallButton text={mockText} />);
    fireEvent.click(screen.getByRole("link"));
    expect(mockCapture).toHaveBeenCalledWith("$click", {
      $event_type: "github_app_install",
      $current_url: mockCurrentUrl,
    });
  });
});