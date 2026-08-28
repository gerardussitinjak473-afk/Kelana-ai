/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B1F3A",
        pine: "#164E91",
        lagoon: "#2563EB",
        coral: "#0284C7",
        sand: "#F4F8FF",
      },
      boxShadow: {
        float: "0 24px 80px -28px rgba(15, 54, 100, 0.28)",
      },
    },
  },
  plugins: [],
};
