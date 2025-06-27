import { describe, it, expect } from "@jest/globals";
import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MOCK_OWNER, MOCK_REPO, MOCK_USER } from "./constants";

// Mock the Account context provider
const MockAccountProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Custom render function that includes providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: MockAccountProvider, ...options });

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };

// Helper functions for testing
export const createMockSupabaseResponse = <T>(data: T, error: Error | null = null) => ({
  data,
  error,
});

export const createMockSupabaseChain = () => {
  const mockMaybeSingle = jest.fn();
  const mockEq = jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ maybeSingle: mockMaybeSingle }) });
  const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
  const mockUpdate = jest.fn().mockReturnValue({ match: jest.fn() });
  const mockInsert = jest.fn();
  const mockMatch = jest.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
  const mockFrom = jest.fn().mockReturnValue({
    select: mockSelect,
    update: mockUpdate,
    insert: mockInsert,
  });

  return {
    mockFrom,
    mockSelect,
    mockEq,
    mockMaybeSingle,
    mockUpdate,
    mockInsert,
    mockMatch,
  };

// Simple test to prevent "no tests" error
describe("Test Utils", () => {
  it("should export test utilities", () => {
    expect(render).toBeDefined();
    expect(createMockSupabaseResponse).toBeDefined();
  });
});
};
