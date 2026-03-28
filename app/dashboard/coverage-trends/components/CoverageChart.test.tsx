Object.defineProperty(window, "matchMedia", {
  value: (query: string) => ({
    matches: query === "(min-width: 768px)",
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }),
});

jest.mock("recharts", () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: ({ name, dataKey }: { name: string; dataKey: string }) => (
    <div data-testid={`line-${dataKey}`}>{name}</div>
  ),
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}));
jest.mock("./ChartLegend", () => {
  const ChartLegend = () => <div data-testid="chart-legend" />;
  ChartLegend.displayName = "ChartLegend";
  return ChartLegend;
});

import React from "react";
import { render, screen } from "@testing-library/react";
import { Tables } from "@/types/supabase";
import CoverageChart from "./CoverageChart";

const makeData = (overrides: Partial<Tables<"repo_coverage">> = {}): Tables<"repo_coverage"> => ({
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

describe("CoverageChart", () => {
  it("renders chart with all coverage lines when all metrics are available", () => {
    const data = [makeData()];

    render(<CoverageChart data={data} />);

    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByTestId("line-statement")).toBeInTheDocument();
    expect(screen.getByTestId("line-function")).toBeInTheDocument();
    expect(screen.getByTestId("line-branch")).toBeInTheDocument();
  });

  it("hides function line when functions_total is 0", () => {
    const data = [makeData({ functions_total: 0, functions_covered: 0 })];

    render(<CoverageChart data={data} />);

    expect(screen.getByTestId("line-statement")).toBeInTheDocument();
    expect(screen.queryByTestId("line-function")).not.toBeInTheDocument();
    expect(screen.getByTestId("line-branch")).toBeInTheDocument();
    expect(screen.getByText(/Function coverage is not shown/)).toBeInTheDocument();
  });

  it("hides branch line when branches_total is 0", () => {
    const data = [makeData({ branches_total: 0, branches_covered: 0 })];

    render(<CoverageChart data={data} />);

    expect(screen.getByTestId("line-statement")).toBeInTheDocument();
    expect(screen.getByTestId("line-function")).toBeInTheDocument();
    expect(screen.queryByTestId("line-branch")).not.toBeInTheDocument();
    expect(screen.getByText(/Branch coverage is not shown/)).toBeInTheDocument();
  });

  it("hides both function and branch lines when neither is measured", () => {
    const data = [
      makeData({
        functions_total: 0,
        functions_covered: 0,
        branches_total: 0,
        branches_covered: 0,
      }),
    ];

    render(<CoverageChart data={data} />);

    expect(screen.getByTestId("line-statement")).toBeInTheDocument();
    expect(screen.queryByTestId("line-function")).not.toBeInTheDocument();
    expect(screen.queryByTestId("line-branch")).not.toBeInTheDocument();
    expect(screen.getByText(/Function and Branch coverage is not shown/)).toBeInTheDocument();
  });

  it("renders the chart title", () => {
    render(<CoverageChart data={[makeData()]} />);

    expect(screen.getByText("Coverage Trends Over Time")).toBeInTheDocument();
  });

  it("does not show missing metric message when all metrics are available", () => {
    render(<CoverageChart data={[makeData()]} />);

    expect(screen.queryByText(/coverage is not shown/)).not.toBeInTheDocument();
  });
});
