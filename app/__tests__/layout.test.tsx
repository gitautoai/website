import { render, screen } from "@testing-library/react";
import RootLayout from "../layout";
import * as config from "@/config";

// Mock the components and providers
jest.mock("next/font/google", () => ({
  Inter: () => ({ className: "inter" }),
}));

jest.mock("next/script", () => ({
  __esModule: true,
  default: ({ children, id }: { children: React.ReactNode; id: string }) => (
    <script id={id}>{children}</script>
  ),
}));

jest.mock("@/components/Navbar", () => ({
  __esModule: true,
  default: () => <div data-testid="navbar">Navbar</div>,
}));

jest.mock("@/components/Footer", () => ({
  __esModule: true,
  default: () => <div data-testid="footer">Footer</div>,
}));

jest.mock("@/components/PostHog", () => ({
  PHProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="ph-provider">{children}</div>
  ),
}));

jest.mock("@/components/SessionProvider", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="session-provider">{children}</div>
  ),
}));

jest.mock("@/components/Context/Account", () => ({
  AccountContextWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="account-context">{children}</div>
  ),
}));

jest.mock("@/components/Intercom", () => ({
  __esModule: true,
  default: () => <div data-testid="intercom">Intercom</div>,
}));

jest.mock("../providers", () => ({
  Providers: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
}));

jest.mock("@vercel/speed-insights/next", () => ({
  SpeedInsights: () => <div data-testid="speed-insights">SpeedInsights</div>,
}));

jest.mock("@vercel/analytics/react", () => ({
  Analytics: () => <div data-testid="analytics">Analytics</div>,
}));

describe("RootLayout", () => {
  const mockChildren = <div data-testid="children">Test Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the layout with all required components in development", () => {
    jest.spyOn(config, "isPrd", "get").mockReturnValue(false);

    render(<RootLayout>{mockChildren}</RootLayout>);

    // Check basic structure
    expect(document.querySelector("html")).toHaveAttribute("lang", "en");
    expect(document.querySelector("body")).toHaveClass("inter");

    // Check if main components are rendered
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByTestId("children")).toBeInTheDocument();
    expect(screen.getByTestId("intercom")).toBeInTheDocument();

    // Check providers
    expect(screen.getByTestId("ph-provider")).toBeInTheDocument();
    expect(screen.getByTestId("session-provider")).toBeInTheDocument();
    expect(screen.getByTestId("account-context")).toBeInTheDocument();
    expect(screen.getByTestId("providers")).toBeInTheDocument();

    // Check production-only components are not rendered
    expect(screen.queryByTestId("speed-insights")).not.toBeInTheDocument();
    expect(screen.queryByTestId("analytics")).not.toBeInTheDocument();
    expect(document.querySelector("#apollo-script")).not.toBeInTheDocument();
  });

  it("renders production-specific components when in production", () => {
    jest.spyOn(config, "isPrd", "get").mockReturnValue(true);

    render(<RootLayout>{mockChildren}</RootLayout>);

    // Check production-specific components
    expect(screen.getByTestId("speed-insights")).toBeInTheDocument();
    expect(screen.getByTestId("analytics")).toBeInTheDocument();
    expect(document.querySelector("#apollo-script")).toBeInTheDocument();
  });

  it("renders children within the main element", () => {
    jest.spyOn(config, "isPrd", "get").mockReturnValue(false);

    render(<RootLayout>{mockChildren}</RootLayout>);

    const main = screen.getByRole("main");
    expect(main).toHaveClass("px-4 sm:px-8 md:px-16");
    expect(main).toContainElement(screen.getByTestId("children"));
  });

  it("applies correct body classes", () => {
    jest.spyOn(config, "isPrd", "get").mockReturnValue(false);

    render(<RootLayout>{mockChildren}</RootLayout>);

    const body = document.querySelector("body");
    expect(body).toHaveClass("inter");
    expect(body).toHaveClass("w-full");
    expect(body).toHaveClass("min-h-screen");
    expect(body).toHaveClass("text-base");
    expect(body).toHaveClass("sm:text-sm");
    expect(body).toHaveClass("md:text-xl");
  });
});