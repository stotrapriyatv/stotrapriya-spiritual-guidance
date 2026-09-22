/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F3E9CE",
        paperDeep: "#EADFC0",
        ink: "#241B14",
        maroon: {
          DEFAULT: "#6E1B1B",
          deep: "#4A1212",
          light: "#93372F",
        },
        gold: {
          DEFAULT: "#B9812E",
          light: "#D9AE63",
        },
        sage: "#586B4A",
      },
      fontFamily: {
        display: ['"Noto Serif Kannada"', '"Noto Serif"', "serif"],
        body: ['"Noto Sans Kannada"', '"Inter"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        arch: "999px 999px 8px 8px",
      },
    },
  },
  plugins: [],
};
