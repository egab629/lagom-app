module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
    extend: {
      colors: {
        lagom: {
          50: '#f0fdf9',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#05B07D',
          600: '#05915f',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        }
      }
    }
  },
  plugins: [],
}
