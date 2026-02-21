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
import DocsLayout from "./layout";

describe("DocsLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue("/docs/getting-started/installation");
    mockUseAccountContext.mockReturnValue({ userId: null, userName: null });
  });

  it("renders children", () => {
    render(
      <DocsLayout>
        <p>Test content</p>
      </DocsLayout>,
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("renders sidebar sections", () => {
    render(
      <DocsLayout>
        <div />
      </DocsLayout>,
    );

    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Triggers")).toBeInTheDocument();
    expect(screen.getByText("Coverage Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Customization")).toBeInTheDocument();
    expect(screen.getByText("Integrations")).toBeInTheDocument();
  });

  it("renders sidebar items in correct order under Triggers", () => {
    render(
      <DocsLayout>
        <div />
      </DocsLayout>,
    );

    expect(screen.getByText("Schedule Trigger")).toBeInTheDocument();
    expect(screen.getByText("Test Failure Trigger")).toBeInTheDocument();
    expect(screen.getByText("Review Comment Trigger")).toBeInTheDocument();
    expect(screen.getByText("Dashboard Trigger")).toBeInTheDocument();
    expect(screen.getByText("Issue Label Trigger")).toBeInTheDocument();
  });

  it("does not include Issue Checkbox Trigger in sidebar", () => {
    render(
      <DocsLayout>
        <div />
      </DocsLayout>,
    );

    expect(screen.queryByText("Issue Checkbox Trigger")).not.toBeInTheDocument();
  });

  it("sends Slack notification when user visits a doc page", () => {
    mockUseAccountContext.mockReturnValue({ userId: "user-123", userName: "testuser" });
    mockUsePathname.mockReturnValue("/docs/triggers/schedule");

    render(
      <DocsLayout>
        <div />
      </DocsLayout>,
    );

    expect(mockSlackUs).toHaveBeenCalledWith(
      "testuser (user-123) visited docs: /docs/triggers/schedule",
    );
  });

  it("does not send Slack notification when userId is null", () => {
    mockUseAccountContext.mockReturnValue({ userId: null, userName: null });

    render(
      <DocsLayout>
        <div />
      </DocsLayout>,
    );

    expect(mockSlackUs).not.toHaveBeenCalled();
  });

  it("does not send Slack notification when userName is null", () => {
    mockUseAccountContext.mockReturnValue({ userId: "user-123", userName: null });

    render(
      <DocsLayout>
        <div />
      </DocsLayout>,
    );

    expect(mockSlackUs).not.toHaveBeenCalled();
  });

  it("highlights the active sidebar link", () => {
    mockUsePathname.mockReturnValue("/docs/getting-started/installation");

    render(
      <DocsLayout>
        <div />
      </DocsLayout>,
    );

    const activeLink = screen.getByText("Installation").closest("a");
    expect(activeLink).toHaveClass("bg-pink-50", "text-pink-600");
  });

  it("renders mobile navigation select", () => {
    render(
      <DocsLayout>
        <div />
      </DocsLayout>,
    );

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
  });
});
