/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./modules/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C1314D",
        secondary: "#FFF0F3",
      },
      backgroundColor: {
        primary: "#C1314D",
        secondary: "#FFF0F3",
      },
      borderColor: {
        primary: "#C1314D",
        secondary: "#FFF0F3",
      },
      fontFamily: {
        playfair: ['"Playfair Display"', "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
