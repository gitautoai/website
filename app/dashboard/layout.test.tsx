import { render, screen } from "@testing-library/react";
import DashboardLayout from "./layout";
import { metadata } from "./layout";

// Mock the settings layout since we're testing the re-export
jest.mock("../settings/layout", () => {
  const MockSettingsLayout = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="settings-layout">
      <div data-testid="settings-layout-children">{children}</div>
    </div>
  );
  MockSettingsLayout.displayName = "MockSettingsLayout";
  
  // Mock metadata export
  const mockMetadata = {
    title: "Test Settings Title",
    description: "Test Settings Description",
  };
  
  return {
    __esModule: true,
    default: MockSettingsLayout,
    metadata: mockMetadata,
  };
});

describe("DashboardLayout", () => {
  const mockChildren = <div data-testid="test-children">Test Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the settings layout component", () => {
    render(<DashboardLayout>{mockChildren}</DashboardLayout>);

    expect(screen.getByTestId("settings-layout")).toBeInTheDocument();
  });

  it("should pass children to the settings layout", () => {
    render(<DashboardLayout>{mockChildren}</DashboardLayout>);

    expect(screen.getByTestId("settings-layout-children")).toBeInTheDocument();
    expect(screen.getByTestId("test-children")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should render with multiple children", () => {
    const multipleChildren = (
      <>
        <div data-testid="child-1">First Child</div>
        <div data-testid="child-2">Second Child</div>
        <span data-testid="child-3">Third Child</span>
      </>
    );

    render(<DashboardLayout>{multipleChildren}</DashboardLayout>);

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
    expect(screen.getByTestId("child-3")).toBeInTheDocument();
    expect(screen.getByText("First Child")).toBeInTheDocument();
    expect(screen.getByText("Second Child")).toBeInTheDocument();
    expect(screen.getByText("Third Child")).toBeInTheDocument();
  });

  it("should render with no children", () => {
    render(<DashboardLayout>{null}</DashboardLayout>);

    expect(screen.getByTestId("settings-layout")).toBeInTheDocument();
    expect(screen.getByTestId("settings-layout-children")).toBeInTheDocument();
  });

  it("should render with empty children", () => {
    render(<DashboardLayout>{""}</DashboardLayout>);

    expect(screen.getByTestId("settings-layout")).toBeInTheDocument();
    expect(screen.getByTestId("settings-layout-children")).toBeInTheDocument();
  });

  it("should render with complex nested children", () => {
    const complexChildren = (
      <div data-testid="complex-parent">
        <header data-testid="header">Header Content</header>
        <main data-testid="main">
          <section data-testid="section">Section Content</section>
        </main>
        <footer data-testid="footer">Footer Content</footer>
      </div>
    );

    render(<DashboardLayout>{complexChildren}</DashboardLayout>);

    expect(screen.getByTestId("complex-parent")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("main")).toBeInTheDocument();
    expect(screen.getByTestId("section")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("should maintain the same component interface as settings layout", () => {
    const { container } = render(<DashboardLayout>{mockChildren}</DashboardLayout>);

    // Verify that the component structure matches what we expect
    const settingsLayout = container.querySelector('[data-testid="settings-layout"]');
    const childrenContainer = container.querySelector('[data-testid="settings-layout-children"]');

    expect(settingsLayout).toBeInTheDocument();
    expect(childrenContainer).toBeInTheDocument();
    expect(settingsLayout).toContainElement(childrenContainer);
  });

  it("should be a functional component that accepts React.ReactNode children", () => {
    // Test with different types of React nodes
    const stringChild = "String content";
    const numberChild = 42;
    const booleanChild = true;
    const arrayChild = ["Item 1", "Item 2"];

    // String child
    const { rerender } = render(<DashboardLayout>{stringChild}</DashboardLayout>);
    expect(screen.getByText("String content")).toBeInTheDocument();

    // Number child
    rerender(<DashboardLayout>{numberChild}</DashboardLayout>);
    expect(screen.getByText("42")).toBeInTheDocument();

    // Boolean child (should not render)
    rerender(<DashboardLayout>{booleanChild}</DashboardLayout>);
    expect(screen.queryByText("true")).not.toBeInTheDocument();

    // Array child
    rerender(<DashboardLayout>{arrayChild}</DashboardLayout>);
    expect(screen.getByText("Item 1Item 2")).toBeInTheDocument();
  });
});

describe("DashboardLayout metadata", () => {
  it("should re-export metadata from settings layout", () => {
    // Verify that metadata is properly re-exported
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe("Test Settings Title");
    expect(metadata.description).toBe("Test Settings Description");
  });
});

describe("DashboardLayout component", () => {

  it("should be a function component", () => {
    expect(typeof DashboardLayout).toBe("function");
    expect(DashboardLayout.name).toBe("MockSettingsLayout");
  });
});
