/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["Montserrat", "sans-serif"],
        heading: ["Changa One", "sans-serif"],
      },
      colors: {
        error: "#D92D2D",
        darkgrey: "#393E46",
        lightgrey: "#5C636E",
        yellow: "#F8B500",
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(90.06deg, #FBE9D7 29.02%, #F6D5F7 99.95%)',
      },
      boxShadow: {
        'custom': '0px 4px 0.3px 0px #0000000D',
      },
    },
  },
  plugins: [require("daisyui")],
};
