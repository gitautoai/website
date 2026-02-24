import { normalizeDisplayName } from "./normalize-display-name";

describe("normalizeDisplayName", () => {
  it("title-cases all-lowercase name", () => {
    expect(normalizeDisplayName("naman joshi")).toBe("Naman Joshi");
  });

  it("title-cases mixed case like 'Naman joshi'", () => {
    expect(normalizeDisplayName("Naman joshi")).toBe("Naman Joshi");
  });

  it("title-cases all-uppercase name", () => {
    expect(normalizeDisplayName("SHIINA HIDEAKI")).toBe("Shiina Hideaki");
  });

  it("title-cases camelCase name", () => {
    expect(normalizeDisplayName("NemotoMasaya")).toBe("Nemotomasaya");
  });

  it("strips Unicode bold characters", () => {
    expect(normalizeDisplayName("𝐎𝐧𝐞 𝐅𝐢𝐧𝐞 𝐒𝐭𝐚𝐫𝐬𝐭𝐮𝐟𝐟")).toBe("One Fine Starstuff");
  });

  it("replaces dots with spaces", () => {
    expect(normalizeDisplayName("Yang.qu")).toBe("Yang Qu");
  });

  it("preserves accented Latin characters", () => {
    expect(normalizeDisplayName("andré goulart")).toBe("André Goulart");
  });

  it("returns empty string for empty input", () => {
    expect(normalizeDisplayName("")).toBe("");
  });

  it("leaves CJK characters unchanged", () => {
    expect(normalizeDisplayName("高森松太郎")).toBe("高森松太郎");
  });
});
