import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87"
        }
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
      boxShadow: { floating: "0 10px 30px -12px rgba(24,24,27,.2)" }
    }
  },
  plugins: []
};
export default config;
