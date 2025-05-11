/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        "4.5": "1.125rem",
      },
      // https://tailwindcss.com/docs/height#customizing-your-theme
      height: {
        "26": "6.5rem",
      },
    },
    fontFamily: {
      comfortaa: ["var(--font-comfortaa)", "sans-serif"],
      poppins: ["var(--font-poppins)", "sans-serif"],
      lexend: ["var(--font-lexend)", "sans-serif"],
      helvetica: ["Helvetica", "sans-serif"],
    },
  },
  plugins: [],
};
