const nativewind = require("nativewind/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [nativewind],
  important: "html",
  theme: {
    extend: {},
  },
};
