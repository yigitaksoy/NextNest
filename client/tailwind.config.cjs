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
      colors: {
        "custom-blue": "#01fdf6",
        "custom-purple": "#ff81cc",
        "custom-black": "#333",
        "custom-yellow": "#ffcb46",
        "custom-green": "#57ef97",
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/forms")],
  daisyui: {
    themes: false,
  },
};
