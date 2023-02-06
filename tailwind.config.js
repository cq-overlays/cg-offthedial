module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif"],
        mono: ["DM Mono", "ui-monospace"],
      },
      colors: {
        otd: {
          slate: "#5D9194",
          blue: "#1ABFC7",
          green: "#39FA96",
          pink: "#FB788B",
          purple: "#C71A8A",
        },
      },
    },
  },
  plugins: [],
}
