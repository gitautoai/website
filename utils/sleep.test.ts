import { sleep } from "./sleep";

describe("sleep", () => {
  it("resolves after the specified delay", async () => {
    const start = Date.now();
    await sleep(50);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(40);
  });

  it("resolves with undefined", async () => {
    const result = await sleep(0);
    expect(result).toBeUndefined();
  });
});
