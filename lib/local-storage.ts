/**
 * Safe localStorage wrapper that handles environments where storage is unavailable.
 *
 * Why this exists:
 * - Samsung SM-G781B (Android 13) with Chrome Mobile WebView had `localStorage` set to null
 * - WebView environments can disable storage even when `window` exists
 * - Checking `typeof window !== "undefined"` is not enough - `window.localStorage` can still be null
 *
 * This wrapper safely handles:
 * - SSR (window undefined)
 * - WebView with storage disabled (localStorage null)
 * - Privacy/incognito modes that block storage
 * - Any storage quota or security errors
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return typeof window !== "undefined" && window.localStorage
        ? localStorage.getItem(key)
        : null;
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(key, value);
      }
    } catch {
      // Ignore storage errors
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem(key);
      }
    } catch {
      // Ignore storage errors
    }
  },
};
