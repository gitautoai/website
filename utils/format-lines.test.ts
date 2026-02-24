import { formatLines } from "./format-lines";

describe("formatLines", () => {
  it("returns raw number below 1000", () => {
    expect(formatLines(0)).toBe("0");
    expect(formatLines(129)).toBe("129");
    expect(formatLines(999)).toBe("999");
  });

  it("rounds to K at 1000+", () => {
    expect(formatLines(1000)).toBe("1K");
    expect(formatLines(4850)).toBe("5K");
    expect(formatLines(5303)).toBe("5K");
    expect(formatLines(8526)).toBe("9K");
    expect(formatLines(29860)).toBe("30K");
    expect(formatLines(153930)).toBe("154K");
  });
});
