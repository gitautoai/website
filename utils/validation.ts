/**
 * Validate text length with customizable parameters
 */
export function validateLength(
  text: string,
  fieldName: string,
  minLength: number,
  maxLength: number
): void {
  const length = text.length;
  if (length < minLength || length > maxLength) {
    throw new Error(
      `${fieldName} length violation: ${length} characters. Must be between ${minLength}-${maxLength} characters according to Ahrefs.\nText: "${text}"`
    );
  }
}
