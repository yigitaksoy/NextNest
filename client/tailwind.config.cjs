/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fontDegular: ["degular, sans-serif"],
      },
      fontWeight: {
        thin: 300,
        normal: 400,
        black: 700,
        heavy: 900,
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: false,
  },
};
