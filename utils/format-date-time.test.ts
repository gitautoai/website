/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
import { formatDateTime } from "./format-date-time";

describe("formatDateTime", () => {
  // ===== solitary =====
  // We isolate the function from the JS runtime's locale implementation by mocking toLocaleDateString.
  // This ensures we are testing the logic of option passing and string manipulation, not the Intl API itself.

  it("calls toLocaleDateString with time options when includeTime is true", () => {
    const spy = jest.spyOn(Date.prototype, "toLocaleDateString").mockReturnValue("Sat, Mar 23, 12:00 PM");

    const result = formatDateTime("2024-03-23T12:00:00", { includeTime: true });

    expect(spy).toHaveBeenCalledWith("en-US", expect.objectContaining({
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }));
    expect(result).toBe("Sat Mar 23 12:00 PM");
    spy.mockRestore();
  });

  it("calls toLocaleDateString with year options when includeTime is false", () => {
    const spy = jest.spyOn(Date.prototype, "toLocaleDateString").mockReturnValue("Sat, Mar 23, 2024");

    const result = formatDateTime("2024-03-23T12:00:00", { includeTime: false });

    expect(spy).toHaveBeenCalledWith("en-US", expect.objectContaining({
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    }));
    expect(result).toBe("Sat Mar 23 2024");
    spy.mockRestore();
  });

  // ===== sociable =====
  // We use real Date and Intl objects to ensure the function works correctly with the actual JS runtime.
  // We use date strings without timezone offsets to ensure deterministic results across different environments.

  it("formats date and time by default (includeTime: true)", () => {
    // Verify that a valid date string is formatted with weekday, month, day, and time
    const date = "2024-03-23T12:00:00";
    expect(formatDateTime(date)).toBe("Sat Mar 23 12:00 PM");
  });

  it("formats date and time when includeTime is explicitly true", () => {
    // Verify that explicitly passing includeTime: true produces the same result as default
    const date = "2024-03-23T12:00:00";
    expect(formatDateTime(date, { includeTime: true })).toBe("Sat Mar 23 12:00 PM");
  });

  it("formats date and year when includeTime is false", () => {
    // Verify that when includeTime is false, time is omitted and year is included
    const date = "2024-03-23T12:00:00";
    expect(formatDateTime(date, { includeTime: false })).toBe("Sat Mar 23 2024");
  });

  it("handles invalid date strings gracefully", () => {
    // Verify that an invalid date string returns 'Invalid Date'
    expect(formatDateTime("not-a-date")).toBe("Invalid Date");
  });

  it("handles empty date strings gracefully", () => {
    // Verify that an empty date string returns 'Invalid Date'
    expect(formatDateTime("")).toBe("Invalid Date");
  });

  it("handles null or undefined date strings", () => {
    // Verify that null or undefined (cast to any) returns 'Invalid Date'
    expect(formatDateTime(null as any)).toBe("Invalid Date");
    expect(formatDateTime(undefined as any)).toBe("Invalid Date");
  });
});
