/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{html,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#0089aa',
      },
      zIndex: {
        '60': '60',
        '70': '70', // Add as needed
      } 
    },
  },
  plugins: [],  
}

