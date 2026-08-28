/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#22313F",
        pine: "#2F6F6D",
        lagoon: "#4F8FA3",
        coral: "#D97757",
        sand: "#F7F3EA",
      },
      boxShadow: {
        float: "0 24px 80px -28px rgba(34, 49, 63, 0.2)",
      },
    },
  },
  plugins: [],
};
