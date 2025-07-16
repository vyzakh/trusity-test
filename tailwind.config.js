// tailwind.config.js
const {heroui} = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/components/(autocomplete|badge|breadcrumbs|button|card|checkbox|date-picker|divider|drawer|dropdown|form|image|input|modal|number-input|pagination|progress|select|skeleton|spinner|toggle|table|tabs|toast|user|ripple|listbox|popover|scroll-shadow|calendar|date-input|menu|spacer|avatar).js",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};