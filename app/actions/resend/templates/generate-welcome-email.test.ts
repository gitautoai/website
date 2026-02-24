import { generateWelcomeEmail } from "./generate-welcome-email";

const CHAR_LIMIT = 250;

describe("generateWelcomeEmail", () => {
  it("includes user name and sign-off", () => {
    const text = generateWelcomeEmail("Alice");
    expect(text).toContain("Alice");
    expect(text).toContain("Wes");
  });

  it(`is within ${CHAR_LIMIT} characters`, () => {
    const text = generateWelcomeEmail("Maximilian");
    expect(text.length).toBeLessThanOrEqual(CHAR_LIMIT);
  });
});
