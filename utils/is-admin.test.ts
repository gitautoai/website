/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
import { isAdmin } from "./is-admin";

describe("isAdmin", () => {
  it("returns true for the admin user ID", () => {
    // Verify that the specific admin ID 4620828 returns true
    expect(isAdmin(4620828)).toBe(true);
  });

  it("returns false for a non-admin user ID", () => {
    // Verify that a random valid user ID returns false
    expect(isAdmin(1234567)).toBe(false);
  });

  it("returns false for null userId", () => {
    // Verify that null input is handled and returns false
    expect(isAdmin(null)).toBe(false);
  });

  it("returns false for undefined userId", () => {
    // Verify that undefined input is handled and returns false
    expect(isAdmin(undefined)).toBe(false);
  });

  it("returns false for userId 0", () => {
    // Verify that 0 is treated as falsy and returns false
    expect(isAdmin(0)).toBe(false);
  });

  it("returns false for negative userId", () => {
    // Verify that negative IDs return false
    expect(isAdmin(-1)).toBe(false);
  });
});
