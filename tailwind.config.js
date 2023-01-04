/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("nativewind/tailwind")],
  important: "html",
  theme: {},
  future: {
    hoverOnlyWhenSupported: true,
  },
};
