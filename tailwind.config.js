const nativewind = require("nativewind/tailwind");
const hocusPlugin = require("tailwindcss-hocus");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [nativewind],
  important: "html",
  theme: {},
  plugins: [hocusPlugin],
  future: {
    // hoverOnlyWhenSupported: true,
  },
};
