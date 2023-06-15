/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        degular: ["degular, sans-serif"],
        nove: ["nove, sans-serif"],
        marker: ["permanent-marker, sans-serif"],
      },
      fontWeight: {
        thin: 300,
        normal: 400,
        black: 700,
        heavy: 900,
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/forms")],
  daisyui: {
    themes: false,
  },
};
