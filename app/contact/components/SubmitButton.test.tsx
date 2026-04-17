/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
import { render, screen } from "@testing-library/react";
import { useFormStatus } from "react-dom";
import SubmitButton from "./SubmitButton";

// Mock useFormStatus from react-dom
jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  useFormStatus: jest.fn(),
}));

describe("SubmitButton", () => {
  const mockedUseFormStatus = useFormStatus as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== solitary =====

  it("should render 'Send Message' and be enabled when not pending", () => {
    // Verify that when pending is false, the button shows the default text and is enabled
    mockedUseFormStatus.mockReturnValue({ pending: false });

    render(<SubmitButton />);

    const button = screen.getByRole("button", { name: /send message/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(button).toHaveClass("bg-pink-600");
    expect(button).toHaveClass("hover:bg-pink-700");
    expect(button).not.toHaveClass("bg-gray-400");
  });

  it("should render 'Sending...' and be disabled when pending", () => {
    // Verify that when pending is true, the button shows the loading text and is disabled
    mockedUseFormStatus.mockReturnValue({ pending: true });

    render(<SubmitButton />);

    const button = screen.getByRole("button", { name: /sending\.\.\./i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(button).toHaveClass("bg-gray-400");
    expect(button).toHaveClass("cursor-not-allowed");
    expect(button).not.toHaveClass("bg-pink-600");
  });

  // ===== sociable =====

  it("should render correctly when wrapped in a form", () => {
    // Verify the component doesn't crash and renders when placed inside a form,
    // which is its required environment for useFormStatus
    mockedUseFormStatus.mockReturnValue({ pending: false });

    render(
      <form>
        <SubmitButton />
      </form>
    );

    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });
});
