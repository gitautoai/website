import { getUsersByIds } from "./get-users-by-ids";

describe("getUsersByIds (integration)", () => {
  it("returns users with emails for known user IDs", async () => {
    // hiroshinishio (user_id 4620828)
    const results = await getUsersByIds([4620828]);

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].user_id).toBe(4620828);
    expect(results[0].email).toBeTruthy();
  });

  it("returns empty for non-existent user IDs", async () => {
    const results = await getUsersByIds([999999999]);

    expect(results).toEqual([]);
  });
});
