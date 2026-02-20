export const oneFunctionPerFileGood = `// utils/formatDate.ts
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// utils/validateEmail.ts  
export function validateEmail(email: string): boolean {
  return /^[^@]+@[^@]+\\.[^@]+$/.test(email);
}`;
