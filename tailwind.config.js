/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "var(--primary)",
        "apple-gray": "var(--text-secondary)",
        "apple-bg": "var(--background)",
        "apple-card": "var(--card-bg)",
        "apple-border": "var(--border)",
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
