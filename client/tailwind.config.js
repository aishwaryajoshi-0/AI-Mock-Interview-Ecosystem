export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef5ff",
          100: "#d7e5ff",
          200: "#b6ccff",
          300: "#8fafff",
          400: "#668dff",
          500: "#3d6dff",
          600: "#2f54e7",
          700: "#2745b3",
          800: "#20378d",
          900: "#1a2f74"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: [],
};
