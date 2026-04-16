/* eslint-disable @typescript-eslint/no-unused-vars */
import { render } from "@testing-library/react";

// Mock NotFoundRedirect to isolate BlogPostNotFound under test.
// Captures props so we can verify the correct redirectTo value is passed.
const mockNotFoundRedirect = jest.fn(
  (_props: { redirectTo: string }) => null
);
jest.mock("@/app/components/NotFoundRedirect", () => ({
  __esModule: true,
  default: (props: { redirectTo: string }) => mockNotFoundRedirect(props),
}));

import BlogPostNotFound from "@/app/blog/[slug]/not-found";

describe("BlogPostNotFound (app/blog/[slug]/not-found.tsx)", () => {
  beforeEach(() => {
    mockNotFoundRedirect.mockClear();
  });

  // Verifies the component renders without throwing, covering the BlogPostNotFound function (L3)
  it("renders without crashing", () => {
    expect(() => render(<BlogPostNotFound />)).not.toThrow();
  });

  // Verifies the component passes redirectTo="/blog" to NotFoundRedirect,
  // ensuring users hitting unknown blog slugs are redirected to the blog listing
  it('passes redirectTo="/blog" to NotFoundRedirect', () => {
    render(<BlogPostNotFound />);
    expect(mockNotFoundRedirect).toHaveBeenCalledTimes(1);
    expect(mockNotFoundRedirect).toHaveBeenCalledWith({ redirectTo: "/blog" });
  });

  // Verifies the component returns what NotFoundRedirect returns (null in mock),
  // confirming it doesn't wrap the child in extra DOM elements
  it("returns the NotFoundRedirect element directly", () => {
    const { container } = render(<BlogPostNotFound />);
    expect(container.innerHTML).toBe("");
  });

  // Verifies that re-rendering still delegates to NotFoundRedirect correctly
  it("delegates to NotFoundRedirect on each render", () => {
    const { rerender } = render(<BlogPostNotFound />);
    rerender(<BlogPostNotFound />);
    expect(mockNotFoundRedirect).toHaveBeenCalledTimes(2);
    // Both calls should use the same hardcoded "/blog" path
    expect(mockNotFoundRedirect).toHaveBeenNthCalledWith(1, {
      redirectTo: "/blog",
    });
    expect(mockNotFoundRedirect).toHaveBeenNthCalledWith(2, {
      redirectTo: "/blog",
    });
  });

  // Verifies the redirect target is specifically "/blog" and not other common paths,
  // catching accidental copy-paste from the root not-found component
  it("does not redirect to root or other paths", () => {
    render(<BlogPostNotFound />);
    expect(mockNotFoundRedirect).not.toHaveBeenCalledWith({
      redirectTo: "/",
    });
    expect(mockNotFoundRedirect).not.toHaveBeenCalledWith({
      redirectTo: "/blog/",
    });
  });
});
