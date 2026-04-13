import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#0f172a",
        border: "#e2e8f0",
        accent: "#64748b",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      fontWeight: {
        light: "300",
        semibold: "600",
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};

export default config;
