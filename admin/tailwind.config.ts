import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        triad: {
          teal: "#00b4a8",
          navy: "#0a2540",
          antracit: "#2b2d2f",
        },
      },
      fontFamily: {
        sans: ["Roboto", "system-ui", "sans-serif"],
        heading: ["Montserrat", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        btn: "8px",
        card: "12px",
        modal: "16px",
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0,0,0,0.08)",
        card: "0 4px 12px rgba(0,0,0,0.10)",
        modal: "0 16px 40px rgba(0,0,0,0.16)",
      },
    },
  },
  plugins: [],
};
export default config;
