import { render, screen, fireEvent } from "@testing-library/react";
import { usePostHog } from "posthog-js/react";
import InstallButton from "./Install";
import { ABSOLUTE_URLS } from "@/config";

jest.mock("posthog-js/react", () => ({
  usePostHog: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

describe("InstallButton", () => {
  const mockCapture = jest.fn();
  const mockText = "Install GitAuto";

  beforeEach(() => {
    (usePostHog as jest.Mock).mockReturnValue({
      capture: mockCapture,
    });
    Object.defineProperty(window, "location", {
      value: {
        href: "http://test.com",
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders with correct text", () => {
    render(<InstallButton text={mockText} />);
    expect(screen.getByText(mockText)).toBeInTheDocument();
  });

  it("renders GitHub logo image", () => {
    render(<InstallButton text={mockText} />);
    const image = screen.getByAltText("Github Logo");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/icons/github.svg");
    expect(image).toHaveAttribute("width", "30");
    expect(image).toHaveAttribute("height", "30");
    expect(image).toHaveClass("invert");
  });

  it("has correct href and target attributes", () => {
    render(<InstallButton text={mockText} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("tracks click event with PostHog", () => {
    render(<InstallButton text={mockText} />);
    fireEvent.click(screen.getByRole("link"));
    expect(mockCapture).toHaveBeenCalledWith("$click", {
      $event_type: "github_app_install",
      $current_url: "http://test.com",
    });
  });
});