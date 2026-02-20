import { render, fireEvent } from "@testing-library/react";
import ToggleSwitch from "./ToggleSwitch";

describe("ToggleSwitch", () => {
  it("should render with checked state", () => {
    const { container } = render(<ToggleSwitch checked={true} onChange={jest.fn()} />);
    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-pink-600");
  });

  it("should render with unchecked state", () => {
    const { container } = render(<ToggleSwitch checked={false} onChange={jest.fn()} />);
    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-gray-300");
  });

  it("should call onChange when clicked", () => {
    const onChange = jest.fn();
    const { container } = render(<ToggleSwitch checked={false} onChange={onChange} />);
    const button = container.querySelector("button")!;
    fireEvent.click(button);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("should show knob translated right when checked", () => {
    const { container } = render(<ToggleSwitch checked={true} onChange={jest.fn()} />);
    const knob = container.querySelector("span");
    expect(knob).toHaveClass("translate-x-6");
  });

  it("should show knob translated left when unchecked", () => {
    const { container } = render(<ToggleSwitch checked={false} onChange={jest.fn()} />);
    const knob = container.querySelector("span");
    expect(knob).toHaveClass("translate-x-1");
  });
});
