/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0072CE",
        secondary: "#33A1FD",
        "yellow-tail": "#FFC61E",
        "blue-tail": "#0052CC",
        success: "#36B37E",
        warning: "#FFAB00",
        error: "#FF5630",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
