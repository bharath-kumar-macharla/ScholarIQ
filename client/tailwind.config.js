/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#06080f",
        foreground: "#e6edf3",
        primary: {
          DEFAULT: "#06d6a0",
          hover: "#05b386",
        },
        secondary: {
          DEFAULT: "#4cc9f0",
          hover: "#3ab0d1",
        },
        accent: {
          DEFAULT: "#f72585",
          hover: "#d31e70",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
