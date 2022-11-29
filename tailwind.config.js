const nativewind = require("nativewind/tailwind");
const plugin = require("tailwindcss/plugin");

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
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("hocus", ["&:hover", "&:focus-visible"]);
      addVariant("group-hocus", [
        ":merge(.group):hover &",
        ":merge(.group):focus-visible &",
      ]);
    }),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
