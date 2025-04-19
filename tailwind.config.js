/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mercy-red': '#FF0000',
        'mercy-green': '#4A7F3F',
      },
    },
  },
  plugins: [],
} 