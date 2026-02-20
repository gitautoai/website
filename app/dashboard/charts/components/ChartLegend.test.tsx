import { render, screen } from "@testing-library/react";
import ChartLegend from "./ChartLegend";

describe("ChartLegend", () => {
  it("renders all three coverage types in correct order", () => {
    render(<ChartLegend />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent("Statement Coverage");
    expect(items[1]).toHaveTextContent("Function Coverage");
    expect(items[2]).toHaveTextContent("Branch Coverage");
  });

  it("renders with correct colors", () => {
    render(<ChartLegend />);

    expect(screen.getByText("Statement Coverage")).toHaveStyle({ color: "#8884d8" });
    expect(screen.getByText("Function Coverage")).toHaveStyle({ color: "#82ca9d" });
    expect(screen.getByText("Branch Coverage")).toHaveStyle({ color: "#ffc658" });
  });
});
