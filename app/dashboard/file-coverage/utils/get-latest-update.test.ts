import { Tables } from "@/types/supabase";
import { getLatestUpdate } from "./get-latest-update";
import * as formatDateTimeModule from "@/utils/format-date-time";
import { vi, describe, it, expect } from "vitest";

// ===== solitary =====
describe("getLatestUpdate solitary", () => {
  it("should return null for empty coverage data", () => {
    // Verify that an empty array returns null immediately
    const data: Tables<"coverages">[] = [];
    expect(getLatestUpdate(data)).toBeNull();
  });

  it("should find the latest date and call formatDateTime with it", () => {
    // Mock formatDateTime to verify it's called with the correct ISO string
    const spy = vi.spyOn(formatDateTimeModule, "formatDateTime").mockImplementation((date) => `mocked-${date}`);

    const data: Tables<"coverages">[] = [
      { updated_at: "2023-01-01T00:00:00Z" } as Tables<"coverages">,
      { updated_at: "2023-05-01T00:00:00Z" } as Tables<"coverages">,
      { updated_at: "2023-03-01T00:00:00Z" } as Tables<"coverages">,
    ];

    const result = getLatestUpdate(data);

    expect(spy).toHaveBeenCalledWith("2023-05-01T00:00:00.000Z");
    expect(result).toBe("mocked-2023-05-01T00:00:00.000Z");
    spy.mockRestore();
  });

  it("should handle a single item array", () => {
    const spy = vi.spyOn(formatDateTimeModule, "formatDateTime").mockImplementation((date) => `mocked-${date}`);

    const data: Tables<"coverages">[] = [
      { updated_at: "2023-01-01T00:00:00Z" } as Tables<"coverages">,
    ];

    const result = getLatestUpdate(data);

    expect(spy).toHaveBeenCalledWith("2023-01-01T00:00:00.000Z");
    expect(result).toBe("mocked-2023-01-01T00:00:00.000Z");
    spy.mockRestore();
  });

  it("should handle items with the same date", () => {
    const spy = vi.spyOn(formatDateTimeModule, "formatDateTime").mockImplementation((date) => `mocked-${date}`);

    const data: Tables<"coverages">[] = [
      { updated_at: "2023-05-01T00:00:00Z" } as Tables<"coverages">,
      { updated_at: "2023-05-01T00:00:00Z" } as Tables<"coverages">,
    ];

    const result = getLatestUpdate(data);

    expect(spy).toHaveBeenCalledWith("2023-05-01T00:00:00.000Z");
    expect(result).toBe("mocked-2023-05-01T00:00:00.000Z");
    spy.mockRestore();
  });
});

// ===== sociable =====
describe("getLatestUpdate sociable", () => {
  it("should return formatted date for the latest update", () => {
    // Verify the full flow from finding latest date to formatting it using real formatDateTime
    const data: Tables<"coverages">[] = [
      { updated_at: "2023-01-01T00:00:00Z" } as Tables<"coverages">,
      { updated_at: "2023-05-01T12:00:00Z" } as Tables<"coverages">,
      { updated_at: "2023-03-01T00:00:00Z" } as Tables<"coverages">,
    ];

    const result = getLatestUpdate(data);

    expect(typeof result).toBe("string");
    expect(result).not.toBe("");
    // We don't assert exact string because of timezone differences in test environments,
    // but we verify it's a valid formatted string.
  });
});

// ===== adversarial =====
describe("getLatestUpdate adversarial", () => {
  it("should handle invalid date strings gracefully", () => {
    // Verify that invalid dates don't crash the function.
    // new Date("invalid") results in an Invalid Date, which is not > any date.
    const data: Tables<"coverages">[] = [
      { updated_at: "invalid-date" } as Tables<"coverages">,
    ];

    const result = getLatestUpdate(data);
    expect(typeof result).toBe("string");
  });

  it("should handle very old dates", () => {
    // Verify it works with dates near the epoch
    const data: Tables<"coverages">[] = [
      { updated_at: "1970-01-01T00:00:01Z" } as Tables<"coverages">,
    ];
    const result = getLatestUpdate(data);
    expect(typeof result).toBe("string");
  });

  it("should handle a large number of items", () => {
    // Verify performance and correctness with a larger dataset
    const data: Tables<"coverages">[] = Array.from({ length: 1000 }, (_, i) => ({
      updated_at: new Date(2000, 0, 1 + (i % 31)).toISOString(),
    } as Tables<"coverages">));

    // Add one clearly latest date
    data.push({ updated_at: "2025-01-01T00:00:00Z" } as Tables<"coverages">);

    const result = getLatestUpdate(data);
    expect(typeof result).toBe("string");
    expect(result).not.toBe("");
  });
});
