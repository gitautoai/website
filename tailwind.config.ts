/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      pink: "#f23b87",
      pinkHover: "#EA106A",
      darkBlue: "#669BBC",
      darkBlueHover: "#4982A6",
      gray: "#8492a6",
      white: "#ffffff",
      black: "#000000",
      transparent: "transparent",
      light: "#eaebe5 ", //grey
      lightHover: "#E0E0E0",
    },
    fontFamily: {
      sans: ["sans-serif", "sans-serif"],
      serif: ["Georgia", "serif"],
      mono: ["Menlo", "monospace"],
      comfortaa: ["var(--font-comfortaa)", "sans-serif"],
      poppins: ["var(--font-poppins)", "sans-serif"],
      lexend: ["var(--font-lexend)", "sans-serif"],
      arial: ["Arial", "sans-serif"],
      helvetica: ["Helvetica", "sans-serif"],
    },
  },
  plugins: [],
};
  '.howToGetStarted': { backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '5px' },
