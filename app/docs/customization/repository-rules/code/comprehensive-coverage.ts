export const comprehensiveCoverage = `describe('validateEmail', () => {
  // Happy path
  it('should return true for valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  // Edge cases
  it('should return false for email without @', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(validateEmail('')).toBe(false);
  });

  it('should return false for null input', () => {
    expect(validateEmail(null)).toBe(false);
  });

  // Boundary conditions
  it('should handle very long email addresses', () => {
    const longEmail = 'a'.repeat(100) + '@example.com';
    expect(validateEmail(longEmail)).toBe(true);
  });
});`;
