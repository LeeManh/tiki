/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(26, 149, 255)",
        body: "rgb(246, 245, 250)",
        secondary: "#787878",
        text: "#333333",
        pink: "#ff424e",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
