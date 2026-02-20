/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#007AFF",
        "apple-gray": "#F5F5F7",
        "emergency": "#FF9500",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "sans": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem"
      },
    },
  },
  plugins: [],
}
