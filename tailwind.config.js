const colors = require("tailwindcss/colors");

module.exports = {
  purge: [],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.trueGray,
      },
      maxHeight: {
        0: "0",
        "1/3": "33.33333333%",
        "2/3": "66.66666666%",
        full: "100%",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
