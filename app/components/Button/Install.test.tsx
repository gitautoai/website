import { render, screen, fireEvent } from "@testing-library/react";
import InstallButton from "./Install";
import { ABSOLUTE_URLS } from "@/config";

const mockCapture = jest.fn();

jest.mock("posthog-js/react", () => ({
  usePostHog: () => ({
    capture: mockCapture,
  }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

describe("InstallButton", () => {
  beforeEach(() => {
    mockCapture.mockClear();
    Object.defineProperty(window, "location", {
      value: { href: "http://test.com" },
      writable: true,
    });
  });

  it("renders with correct text and attributes", () => {
    render(<InstallButton text="Install GitAuto" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveTextContent("Install GitAuto");
  });

  it("renders GitHub logo image with correct props", () => {
    render(<InstallButton text="Install GitAuto" />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "/icons/github.svg");
    expect(image).toHaveAttribute("alt", "Github Logo");
    expect(image).toHaveAttribute("width", "30");
    expect(image).toHaveAttribute("height", "30");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveClass("invert");
  });

  it("tracks click event with PostHog", () => {
    render(<InstallButton text="Install GitAuto" />);

    const link = screen.getByRole("link");
    fireEvent.click(link);

    expect(mockCapture).toHaveBeenCalledWith("$click", {
      $event_type: "github_app_install",
      $current_url: "http://test.com",
    });
  });
});