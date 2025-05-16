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
        'mercy-black': '#1a1a1a',
        'mercy-white': '#FFFFFF',
      },
      fontFamily: {
        'display': ['YourDisplayFont', 'sans-serif'],
        'body': ['YourBodyFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 