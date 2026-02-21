import { render, screen } from "@testing-library/react";
import { Tables } from "@/types/supabase";
import CoverageStats from "./CoverageStats";

const makeData = (
  overrides: Partial<Tables<"repo_coverage">> = {},
): Tables<"repo_coverage"> => ({
  id: 1,
  owner_id: 1,
  repo_id: 1,
  owner_name: "test-owner",
  repo_name: "test-repo",
  branch_name: "main",
  created_by: "test",
  language: "javascript",
  line_coverage: 75,
  branch_coverage: 65,
  function_coverage: 70,
  statement_coverage: 75,
  lines_covered: 750,
  lines_total: 1000,
  functions_covered: 70,
  functions_total: 100,
  branches_covered: 130,
  branches_total: 200,
  created_at: "2024-06-15T00:00:00Z",
  ...overrides,
});

describe("CoverageStats", () => {
  it("returns null when data is empty", () => {
    const { container } = render(<CoverageStats data={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders all three coverage stats", () => {
    render(<CoverageStats data={[makeData()]} />);

    expect(screen.getByText("Statement Coverage")).toBeInTheDocument();
    expect(screen.getByText("Function Coverage")).toBeInTheDocument();
    expect(screen.getByText("Branch Coverage")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(screen.getByText("70%")).toBeInTheDocument();
    expect(screen.getByText("65%")).toBeInTheDocument();
  });

  it("shows 'Not measured' when function coverage is not available", () => {
    render(<CoverageStats data={[makeData({ functions_total: 0, functions_covered: 0 })]} />);

    expect(screen.getByText("Not measured by coverage tool")).toBeInTheDocument();
  });

  it("shows 'Not measured' when branch coverage is not available", () => {
    render(<CoverageStats data={[makeData({ branches_total: 0, branches_covered: 0 })]} />);

    expect(screen.getByText("Not measured by coverage tool")).toBeInTheDocument();
  });

  it("shows change indicators when there are multiple data points", () => {
    const data = [
      makeData({ statement_coverage: 70, function_coverage: 60, branch_coverage: 55 }),
      makeData({
        id: 2,
        statement_coverage: 75,
        function_coverage: 70,
        branch_coverage: 65,
        created_at: "2024-06-16T00:00:00Z",
      }),
    ];

    render(<CoverageStats data={data} />);

    // +5% change for statement (75 - 70)
    expect(screen.getByText(/\+5% vs last/)).toBeInTheDocument();
    // +10% change for function (70 - 60) and branch (65 - 55)
    const tenPercentChanges = screen.getAllByText(/\+10% vs last/);
    expect(tenPercentChanges).toHaveLength(2);
  });

  it("shows negative change in red", () => {
    const data = [
      makeData({ statement_coverage: 80 }),
      makeData({
        id: 2,
        statement_coverage: 75,
        created_at: "2024-06-16T00:00:00Z",
      }),
    ];

    render(<CoverageStats data={data} />);

    const changeElement = screen.getByText(/-5% vs last/);
    expect(changeElement).toHaveClass("text-red-600");
  });

  it("shows positive change in green", () => {
    const data = [
      makeData({ statement_coverage: 70 }),
      makeData({
        id: 2,
        statement_coverage: 75,
        created_at: "2024-06-16T00:00:00Z",
      }),
    ];

    render(<CoverageStats data={data} />);

    const changeElement = screen.getByText(/\+5% vs last/);
    expect(changeElement).toHaveClass("text-green-600");
  });

  it("does not show change when there is only one data point", () => {
    render(<CoverageStats data={[makeData()]} />);

    expect(screen.queryByText(/vs last/)).not.toBeInTheDocument();
  });
});
