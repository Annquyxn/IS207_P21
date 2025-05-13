import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ea1a1a",
        secondary: "#2f2f2f",
        accent: "#f56758",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        heading: ["Familjen Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
};
