/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f6fe',
          100: '#ddeafd',
          200: '#c3dbfb',
          300: '#9bc4f8',
          400: '#6ca4f3',
          500: '#4882ed',
          600: '#3265e1',
          700: '#274fcb',
          800: '#2541a5',
          900: '#233a82',
          950: '#0f172a',
        },
        gold: {
          50: '#fdfbf7',
          100: '#f9f4ea',
          200: '#f2e5cb',
          300: '#e8cf9f',
          400: '#dcaf68',
          500: '#cf9138',
          600: '#b8762c',
          700: '#945826',
          800: '#784624',
          900: '#643a21',
          foil: '#b8860b',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'card-hover': '0 20px 30px -4px rgba(15, 23, 42, 0.1), 0 8px 10px -3px rgba(15, 23, 42, 0.04)',
        'gold-soft': '0 4px 20px -2px rgba(207, 145, 56, 0.18)',
      }
    },
  },
  plugins: [],
}
