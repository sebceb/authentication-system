/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'lime-neon': '#ccff00',
        'cyan-neon': '#00f2ff',
        'dark-metal': '#121212',
      },
    },
  },
  plugins: [],
}