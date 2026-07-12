/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        jade: {
          50: '#eef9f9',
          100: '#d5f1f1',
          500: '#018d8c', // Nuevo Verde Jade institucional
          600: '#017978',
          700: '#016564'
        },
        dorado: {
          100: '#fff7ea',
          500: '#ffac2a', // Nuevo Dorado institucional
          600: '#e5951d',
          700: '#cc8211'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif']
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["light", "dark", "cupcake"], // themes disponibles
    darkTheme: "dark",                   // tema usado si activas "dark"
  },
};
