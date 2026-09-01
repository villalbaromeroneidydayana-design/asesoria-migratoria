/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          500: '#3b82f6',
          700: '#1d4ed8',
          800: '#1e3a8a',
          900: '#0f172a',
          950: '#020617',
        },
        slate: {
          50: '#f8fafc',
          800: '#1e293b',
          900: '#0f172a',
        },
        gold: {
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      }
    },
  },
  plugins: [],
}
