/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f1ff',
          100: '#cce3ff',
          200: '#99c7ff',
          300: '#66aaff',
          400: '#338eff',
          500: '#0072ff',
          600: '#005bcc',
          700: '#004499',
          800: '#002d66',
          900: '#001733',
        },
        secondary: {
          50: '#f2f4f8',
          100: '#e5e9f0',
          200: '#ccd3e0',
          300: '#b2bdd1',
          400: '#99a7c1',
          500: '#7f91b2',
          600: '#66748e',
          700: '#4c576a',
          800: '#333b47',
          900: '#191e23',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backdropBlur: {
        glass: '8px',
      },
    },
  },
  plugins: [],
};