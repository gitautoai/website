/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
import { render } from "@testing-library/react";

// Mock NotFoundRedirect to isolate the NotFound component under test.
// Captures props so we can verify the correct redirectTo value is passed.
const mockNotFoundRedirect = jest.fn(() => null);
jest.mock("@/app/components/NotFoundRedirect", () => ({
  __esModule: true,
  default: (props: { redirectTo: string }) => mockNotFoundRedirect(props),
}));

import NotFound from "@/app/not-found";

describe("NotFound (app/not-found.tsx)", () => {
  beforeEach(() => {
    mockNotFoundRedirect.mockClear();
  });

  // Verifies the component renders without throwing, covering the NotFound function (L3)
  it("renders without crashing", () => {
    expect(() => render(<NotFound />)).not.toThrow();
  });

  // Verifies the component passes redirectTo="/" to NotFoundRedirect,
  // ensuring users hitting unknown routes are redirected to the homepage
  it('passes redirectTo="/" to NotFoundRedirect', () => {
    render(<NotFound />);
    expect(mockNotFoundRedirect).toHaveBeenCalledTimes(1);
    expect(mockNotFoundRedirect).toHaveBeenCalledWith({ redirectTo: "/" });
  });

  // Verifies the component returns what NotFoundRedirect returns (null in mock),
  // confirming it doesn't wrap the child in extra DOM elements
  it("returns the NotFoundRedirect element directly", () => {
    const { container } = render(<NotFound />);
    expect(container.innerHTML).toBe("");
  });

  // Verifies that re-rendering still delegates to NotFoundRedirect correctly
  it("delegates to NotFoundRedirect on each render", () => {
    const { rerender } = render(<NotFound />);
    rerender(<NotFound />);
    expect(mockNotFoundRedirect).toHaveBeenCalledTimes(2);
    // Both calls should use the same hardcoded "/" path
    expect(mockNotFoundRedirect).toHaveBeenNthCalledWith(1, { redirectTo: "/" });
    expect(mockNotFoundRedirect).toHaveBeenNthCalledWith(2, { redirectTo: "/" });
  });
});
