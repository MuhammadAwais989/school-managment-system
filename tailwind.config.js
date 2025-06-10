/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      poppins: ['poppins-extralight']
    },
  },
  plugins: [
        require('tailwind-scrollbar-hide'),

  ],
}