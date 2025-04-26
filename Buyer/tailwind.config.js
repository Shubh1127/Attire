/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#d9e3f1',
          200: '#b3c7e3',
          300: '#8daad5',
          400: '#668ec7',
          500: '#4071b9',
          600: '#335c94',
          700: '#294876',
          800: '#1e3557',
          900: '#172554',
        },
      },
    },
  },
  plugins: [],
};