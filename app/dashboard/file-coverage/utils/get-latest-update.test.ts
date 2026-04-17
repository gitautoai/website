/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
import { Tables } from "@/types/supabase";
import { getLatestUpdate } from "./get-latest-update";
import { formatDateTime } from "@/utils/format-date-time";

jest.mock("@/utils/format-date-time", () => ({
  formatDateTime: jest.fn((date) => `mocked-${date}`),
}));

const mockedFormatDateTime = formatDateTime as jest.Mock;

// ===== solitary =====
describe("getLatestUpdate solitary", () => {
  beforeEach(() => {
    mockedFormatDateTime.mockImplementation((date) => `mocked-${date}`);
  });

  it("should return null for empty coverage data", () => {
    // Verify that an empty array returns null immediately
    const data: Tables<"coverages">[] = [];
    expect(getLatestUpdate(data)).toBeNull();
  });

  it("should find the latest date and call formatDateTime with it", () => {
    const data: Tables<"coverages">[] = [
      { updated_at: "2023-01-01T00:00:00Z" } as Tables<"coverages">,
      { updated_at: "2023-05-01T00:00:00Z" } as Tables<"coverages">,
      { updated_at: "2023-03-01T00:00:00Z" } as Tables<"coverages">,
    ];

    const result = getLatestUpdate(data);

    expect(mockedFormatDateTime).toHaveBeenCalledWith("2023-05-01T00:00:00.000Z");
    expect(result).toBe("mocked-2023-05-01T00:00:00.000Z");
  });

  it("should handle a single item array", () => {
    const data: Tables<"coverages">[] = [
      { updated_at: "2023-01-01T00:00:00Z" } as Tables<"coverages">,
    ];

    const result = getLatestUpdate(data);

    expect(mockedFormatDateTime).toHaveBeenCalledWith("2023-01-01T00:00:00.000Z");
    expect(result).toBe("mocked-2023-01-01T00:00:00.000Z");
  });

  it("should handle items with the same date", () => {
    const data: Tables<"coverages">[] = [
      { updated_at: "2023-05-01T00:00:00Z" } as Tables<"coverages">,
      { updated_at: "2023-05-01T00:00:00Z" } as Tables<"coverages">,
    ];

    const result = getLatestUpdate(data);

    expect(mockedFormatDateTime).toHaveBeenCalledWith("2023-05-01T00:00:00.000Z");
    expect(result).toBe("mocked-2023-05-01T00:00:00.000Z");
  });
});

// ===== sociable =====
describe("getLatestUpdate sociable", () => {
  it("should return formatted date for the latest update", () => {
    // Use the real implementation for sociable tests
    const actualFormatDateTime = jest.requireActual("@/utils/format-date-time").formatDateTime;
    mockedFormatDateTime.mockImplementation(actualFormatDateTime);

    const data: Tables<"coverages">[] = [
      { updated_at: "2023-01-01T00:00:00Z" } as Tables<"coverages">,
      { updated_at: "2023-05-01T12:00:00Z" } as Tables<"coverages">,
      { updated_at: "2023-03-01T00:00:00Z" } as Tables<"coverages">,
    ];

    const result = getLatestUpdate(data);

    expect(typeof result).toBe("string");
    expect(result).not.toBe("");
  });
});

// ===== adversarial =====
describe("getLatestUpdate adversarial", () => {
  beforeEach(() => {
    mockedFormatDateTime.mockImplementation((date) => `mocked-${date}`);
  });

  it("should handle invalid date strings gracefully", () => {
    // Verify that invalid dates are ignored and don't crash the function.
    const data: Tables<"coverages">[] = [
      { updated_at: "invalid-date" } as Tables<"coverages">,
    ];

    const result = getLatestUpdate(data);
    // Should use new Date(0) as fallback
    expect(result).toBe(`mocked-${new Date(0).toISOString()}`);
  });

  it("should handle very old dates", () => {
    const data: Tables<"coverages">[] = [
      { updated_at: "1970-01-01T00:00:01Z" } as Tables<"coverages">,
    ];
    const result = getLatestUpdate(data);
    expect(result).toBe(`mocked-1970-01-01T00:00:01.000Z`);
  });

  it("should handle a large number of items", () => {
    const data: Tables<"coverages">[] = Array.from({ length: 1000 }, (_, i) => ({
      updated_at: new Date(2000, 0, 1 + (i % 31)).toISOString(),
    } as Tables<"coverages">));

    data.push({ updated_at: "2025-01-01T00:00:00Z" } as Tables<"coverages">);

    const result = getLatestUpdate(data);
    expect(result).toBe(`mocked-2025-01-01T00:00:00.000Z`);
  });
});
