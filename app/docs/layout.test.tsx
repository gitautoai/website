const mockSlackUs = jest.fn().mockResolvedValue(undefined);
jest.mock("@/app/actions/slack/slack-us", () => ({
  slackUs: (...args: unknown[]) => mockSlackUs(...args),
}));

const mockUseAccountContext = jest.fn();
jest.mock("@/app/components/contexts/Account", () => ({
  useAccountContext: () => mockUseAccountContext(),
}));

const mockUsePathname = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

import { render, screen } from "@testing-library/react";
import DocsLayoutClient from "./components/DocsLayoutClient";

describe("DocsLayoutClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue("/docs/getting-started/installation");
    mockUseAccountContext.mockReturnValue({ userId: null, userName: null });
  });

  it("renders children", () => {
    render(
      <DocsLayoutClient>
        <p>Test content</p>
      </DocsLayoutClient>,
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("renders sidebar sections", () => {
    render(
      <DocsLayoutClient>
        <div />
      </DocsLayoutClient>,
    );

    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Triggers")).toBeInTheDocument();
    expect(screen.getByText("Coverage Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Customization")).toBeInTheDocument();
    expect(screen.getByText("Integrations")).toBeInTheDocument();
  });

  it("renders sidebar items in correct order under Triggers", () => {
    render(
      <DocsLayoutClient>
        <div />
      </DocsLayoutClient>,
    );

    expect(screen.getByText("Schedule Trigger")).toBeInTheDocument();
    expect(screen.getByText("Test Failure Trigger")).toBeInTheDocument();
    expect(screen.getByText("Review Comment Trigger")).toBeInTheDocument();
    expect(screen.getByText("Dashboard Trigger")).toBeInTheDocument();
  });

  it("sends Slack notification when user visits a doc page", () => {
    mockUseAccountContext.mockReturnValue({ userId: "user-123", userName: "testuser" });
    mockUsePathname.mockReturnValue("/docs/triggers/schedule");

    render(
      <DocsLayoutClient>
        <div />
      </DocsLayoutClient>,
    );

    expect(mockSlackUs).toHaveBeenCalledWith(
      "testuser (user-123) visited docs: /docs/triggers/schedule",
    );
  });

  it("does not send Slack notification when userId is null", () => {
    mockUseAccountContext.mockReturnValue({ userId: null, userName: null });

    render(
      <DocsLayoutClient>
        <div />
      </DocsLayoutClient>,
    );

    expect(mockSlackUs).not.toHaveBeenCalled();
  });

  it("does not send Slack notification when userName is null", () => {
    mockUseAccountContext.mockReturnValue({ userId: "user-123", userName: null });

    render(
      <DocsLayoutClient>
        <div />
      </DocsLayoutClient>,
    );

    expect(mockSlackUs).not.toHaveBeenCalled();
  });

  it("highlights the active sidebar link", () => {
    mockUsePathname.mockReturnValue("/docs/getting-started/installation");

    render(
      <DocsLayoutClient>
        <div />
      </DocsLayoutClient>,
    );

    const activeLink = screen.getByText("Installation").closest("a");
    expect(activeLink).toHaveClass("bg-pink-50", "text-pink-600");
  });

  it("renders mobile navigation select", () => {
    render(
      <DocsLayoutClient>
        <div />
      </DocsLayoutClient>,
    );

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
  });
});
