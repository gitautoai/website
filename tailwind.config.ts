/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      blue: "#f23b87",
      //old -> blue: '#1fb6ff',
      blueHover: "#EA106A",
      darkBlue: "#669BBC",
      darkBlueHover: "#4982A6",
      green: "#4cb93f",
      greenHover: "#6DC962",
      gray: "#8492a6",
      white: "#ffffff",
      black: "#000000",
      red: "#E1341E",
      redHover: "#E75D4B",
      transparent: "transparent",
      light: "#f9f9f9 ", //grey
      lightHover: "#E0E0E0",
      analogueBlue: "#0900FF",
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
