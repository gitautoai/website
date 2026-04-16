/* eslint-disable @typescript-eslint/no-var-requires */
import { render } from "@testing-library/react";
import GlobalError from "./global-error";
import * as Sentry from "@sentry/nextjs";

// Mock Sentry to verify that exceptions are captured
jest.mock("@sentry/nextjs", () => ({
  captureException: jest.fn(),
}));

// Mock next/error to avoid rendering the actual Next.js error page and to provide a testable element
jest.mock("next/error", () => ({
  __esModule: true,
  default: () => <div data-testid="next-error">Next Error</div>,
}));

describe("GlobalError (app/global-error.jsx)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Verifies that the component renders the Next.js Error component,
  // ensuring the user sees a fallback error UI
  it("renders the Error component", () => {
    const { getByTestId } = render(<GlobalError error={new Error("Test Error")} />);
    expect(getByTestId("next-error")).toBeInTheDocument();
  });

  // Verifies that Sentry.captureException is called with the error prop on mount,
  // ensuring that global errors are reported to Sentry for monitoring
  it("calls Sentry.captureException with the provided error on mount", () => {
    const error = new Error("Test Error");
    render(<GlobalError error={error} />);
    expect(Sentry.captureException).toHaveBeenCalledWith(error);
    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
  });

  // Verifies that Sentry.captureException is called again if the error prop changes,
  // covering the useEffect dependency array [error]
  it("calls Sentry.captureException again when the error prop changes", () => {
    const error1 = new Error("Error 1");
    const error2 = new Error("Error 2");
    const { rerender } = render(<GlobalError error={error1} />);
    expect(Sentry.captureException).toHaveBeenCalledWith(error1);

    rerender(<GlobalError error={error2} />);
    expect(Sentry.captureException).toHaveBeenCalledWith(error2);
    expect(Sentry.captureException).toHaveBeenCalledTimes(2);
  });

  // Verifies behavior when error is not a standard Error object (e.g., a string),
  // as JavaScript allows throwing any value
  it("calls Sentry.captureException even if error is a string", () => {
    const error = "Something went wrong";
    render(<GlobalError error={error} />);
    expect(Sentry.captureException).toHaveBeenCalledWith(error);
    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
  });

  // Verifies behavior when error is null or undefined,
  // ensuring the component doesn't crash and still attempts to report the value
  it("calls Sentry.captureException when error is null", () => {
    render(<GlobalError error={null} />);
    expect(Sentry.captureException).toHaveBeenCalledWith(null);
    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
  });
});
