import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0f1a",
        foreground: "#ffffff",
        primary: "#10b981",
        secondary: "#1f2937",
        accent: "#10b981",
      },
    },
  },
  plugins: [],
} satisfies Config;
