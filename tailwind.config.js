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
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}
