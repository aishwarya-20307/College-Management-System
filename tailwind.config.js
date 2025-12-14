/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all React files for Tailwind classes
  ],
  theme: {
    extend: {}, // You can extend colors, fonts, etc. here
  },
  plugins: [],
};
