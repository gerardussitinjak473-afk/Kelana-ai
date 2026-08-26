/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#102A2E",
        pine: "#154F4A",
        lagoon: "#2D8179",
        coral: "#F17C62",
        sand: "#F6F2E9",
      },
      boxShadow: {
        float: "0 24px 80px -28px rgba(16, 42, 46, 0.35)",
      },
    },
  },
  plugins: [],
};
