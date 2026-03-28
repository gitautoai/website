jest.mock("@/app/components/SpinnerIcon", () => {
  const SpinnerIcon = () => <div data-testid="spinner" />;
  SpinnerIcon.displayName = "SpinnerIcon";
  return SpinnerIcon;
});

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Tables } from "@/types/supabase";
import ActionsDropdown from "./ActionsDropdown";

const makeCoverage = (overrides: Partial<Tables<"coverages">> = {}): Tables<"coverages"> =>
  ({
    id: 1,
    file_path: "src/index.ts",
    is_excluded_from_testing: false,
    ...overrides,
  }) as Tables<"coverages">;

const defaultProps = {
  isOpen: false,
  onToggleDropdown: jest.fn(),
  selectedRows: [1, 2],
  isCreatingPRs: false,
  onCreatePRs: jest.fn(),
  onToggleExclusion: jest.fn(),
  isTogglingExclusion: false,
  selectedData: [makeCoverage()],
};

describe("ActionsDropdown", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders the Actions button", () => {
    render(<ActionsDropdown {...defaultProps} />);

    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("does not show dropdown items when closed", () => {
    render(<ActionsDropdown {...defaultProps} isOpen={false} />);

    expect(screen.queryByText(/Create PRs/)).not.toBeInTheDocument();
  });

  it("shows dropdown items when open", () => {
    render(<ActionsDropdown {...defaultProps} isOpen={true} />);

    expect(screen.getByText("Create PRs (2)")).toBeInTheDocument();
  });

  it("calls onToggleDropdown when Actions button is clicked", () => {
    const onToggleDropdown = jest.fn();
    render(<ActionsDropdown {...defaultProps} onToggleDropdown={onToggleDropdown} />);

    fireEvent.click(screen.getByText("Actions"));
    expect(onToggleDropdown).toHaveBeenCalledTimes(1);
  });

  it("calls onCreatePRs with true when Create PRs is clicked", () => {
    const onCreatePRs = jest.fn();
    const onToggleDropdown = jest.fn();
    render(
      <ActionsDropdown
        {...defaultProps}
        isOpen={true}
        onCreatePRs={onCreatePRs}
        onToggleDropdown={onToggleDropdown}
      />,
    );

    fireEvent.click(screen.getByText("Create PRs (2)"));
    expect(onCreatePRs).toHaveBeenCalledWith(true);
    expect(onToggleDropdown).toHaveBeenCalled();
  });

  it("shows Exclude button when selected data has included files", () => {
    render(
      <ActionsDropdown
        {...defaultProps}
        isOpen={true}
        selectedData={[makeCoverage({ is_excluded_from_testing: false })]}
      />,
    );

    expect(screen.getByText("Exclude from Testing (2)")).toBeInTheDocument();
  });

  it("shows Include button when selected data has excluded files", () => {
    render(
      <ActionsDropdown
        {...defaultProps}
        isOpen={true}
        selectedData={[makeCoverage({ is_excluded_from_testing: true })]}
      />,
    );

    expect(screen.getByText("Include in Testing (2)")).toBeInTheDocument();
  });

  it("does not show Exclude button when all files are already excluded", () => {
    render(
      <ActionsDropdown
        {...defaultProps}
        isOpen={true}
        selectedData={[makeCoverage({ is_excluded_from_testing: true })]}
      />,
    );

    expect(screen.queryByText(/Exclude from Testing/)).not.toBeInTheDocument();
  });

  it("shows spinner on Actions button when creating PRs", () => {
    render(<ActionsDropdown {...defaultProps} isCreatingPRs={true} />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("shows 'Creating PRs...' when isCreatingPRs is true and dropdown is open", () => {
    render(<ActionsDropdown {...defaultProps} isOpen={true} isCreatingPRs={true} />);

    expect(screen.getByText("Creating PRs...")).toBeInTheDocument();
  });

  it("disables Create PRs button when no rows selected", () => {
    render(<ActionsDropdown {...defaultProps} isOpen={true} selectedRows={[]} />);

    expect(screen.getByText("Create PRs (0)")).toBeDisabled();
  });

  it("calls onToggleExclusion with true when Exclude button is clicked", () => {
    const onToggleExclusion = jest.fn();
    const onToggleDropdown = jest.fn();
    render(
      <ActionsDropdown
        {...defaultProps}
        isOpen={true}
        onToggleExclusion={onToggleExclusion}
        onToggleDropdown={onToggleDropdown}
        selectedData={[makeCoverage({ is_excluded_from_testing: false })]}
      />,
    );

    fireEvent.click(screen.getByText("Exclude from Testing (2)"));
    expect(onToggleExclusion).toHaveBeenCalledWith(true);
    expect(onToggleDropdown).toHaveBeenCalled();
  });

  it("shows both Exclude and Include when selection has mixed files", () => {
    render(
      <ActionsDropdown
        {...defaultProps}
        isOpen={true}
        selectedData={[
          makeCoverage({ is_excluded_from_testing: false }),
          makeCoverage({ id: 2, is_excluded_from_testing: true }),
        ]}
      />,
    );

    expect(screen.getByText("Exclude from Testing (2)")).toBeInTheDocument();
    expect(screen.getByText("Include in Testing (2)")).toBeInTheDocument();
  });
});
