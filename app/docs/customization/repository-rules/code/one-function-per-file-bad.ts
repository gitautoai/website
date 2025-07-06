export const oneFunctionPerFileBad = `// utils/helpers.ts - Multiple unrelated functions
export function formatDate(date: Date): string { /* ... */ }
export function validateEmail(email: string): boolean { /* ... */ }
export function parseJSON(json: string): any { /* ... */ }
export function debounce(fn: Function, delay: number): Function { /* ... */ }`;
