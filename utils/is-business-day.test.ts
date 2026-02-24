import { isBusinessDay } from "./is-business-day";

describe("isBusinessDay", () => {
  it("returns false for Saturday", () => {
    expect(isBusinessDay(new Date("2026-02-21T12:00:00Z"))).toBe(false); // Saturday
  });

  it("returns false for Sunday", () => {
    expect(isBusinessDay(new Date("2026-02-22T12:00:00Z"))).toBe(false); // Sunday
  });

  it("returns true for a regular Monday", () => {
    expect(isBusinessDay(new Date("2026-02-23T12:00:00Z"))).toBe(true); // Monday
  });

  it("returns false for New Year's Day", () => {
    expect(isBusinessDay(new Date("2026-01-01T12:00:00Z"))).toBe(false);
  });

  it("returns false for Independence Day", () => {
    expect(isBusinessDay(new Date("2026-07-04T12:00:00Z"))).toBe(false); // Saturday in 2026, but fixed-date check hits first
  });

  it("returns false for Christmas Day", () => {
    expect(isBusinessDay(new Date("2026-12-25T12:00:00Z"))).toBe(false);
  });

  it("returns false for Memorial Day (last Monday in May)", () => {
    expect(isBusinessDay(new Date("2026-05-25T12:00:00Z"))).toBe(false); // Last Monday in May 2026
  });

  it("returns true for a non-last Monday in May", () => {
    expect(isBusinessDay(new Date("2026-05-18T12:00:00Z"))).toBe(true); // Third Monday in May
  });

  it("returns false for Labor Day (first Monday in September)", () => {
    expect(isBusinessDay(new Date("2026-09-07T12:00:00Z"))).toBe(false); // First Monday in Sep 2026
  });

  it("returns true for second Monday in September", () => {
    expect(isBusinessDay(new Date("2026-09-14T12:00:00Z"))).toBe(true);
  });

  it("returns false for Thanksgiving (fourth Thursday in November)", () => {
    expect(isBusinessDay(new Date("2026-11-26T12:00:00Z"))).toBe(false); // Fourth Thursday in Nov 2026
  });

  it("returns true for third Thursday in November", () => {
    expect(isBusinessDay(new Date("2026-11-19T12:00:00Z"))).toBe(true);
  });
});
