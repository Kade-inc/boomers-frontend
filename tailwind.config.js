/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'body': ["Montserrat", "sans-serif"],
        'heading': ["Changa One", "sans-serif"]
      },
      colors: {
        'error': '#D92D2D',
        'darkgrey': '#393E46',
        'lightgrey': '#5C636E',
        'yellow': '#F8B500'
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}
