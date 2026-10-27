/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0B0E14',
          800: '#151A23',
          700: '#1A202C',
        },
        brand: {
          DEFAULT: '#00E5FF',
          dark: '#00B8CC',
        },
        accent: {
          green: '#00E676',
          red: '#FF1744',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
