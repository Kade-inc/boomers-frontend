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
        success: "#1AC171",
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(90.06deg, #FBE9D7 29.02%, #F6D5F7 99.95%)",
        "dreamy-gradient": "linear-gradient(180deg, #7b4dbb, #d97b98, #f3aa75)",
        "teal-gradient": "linear-gradient(0deg, #00989B, #005E78)",
        "greyish-gradient": "linear-gradient(0deg, #495D6D, #313752)",
        "kinda-orange-gradient": "linear-gradient(0deg, #D9436D, #F26A4B)",
        "greenish-gradient": "linear-gradient(0deg, #589FD6, #43CCBA)",
      },
      boxShadow: {
        custom: "0px 4px 0.3px 0px #0000000D",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          "base-100": "#F7F7F7",
          "base-200": "#FFFFFF",
          "base-300": "#1869A4",
          "base-500": "#00989B",
          "base-content": "#393E46",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          "base-100": "#141414",
          "base-200": "#393E46",
          "base-300": "#FFFFFF",
          "base-500": "#FFFFFF",
          "base-content": "#ffffff",
        },
      },
    ],
    themeRoot: ":root",
  },
};
