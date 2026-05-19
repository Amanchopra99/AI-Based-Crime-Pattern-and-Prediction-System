/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "#e5e7eb",
        background: "#020617",
        foreground: "#ffffff",
        primary: "#6366f1",
      },
    },
  },
  plugins: [],
}