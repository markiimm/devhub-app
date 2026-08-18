import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#07080a",
        surface: {
          1: "#0d0f13",
          2: "#12141a",
          3: "#1b1e26",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.09)",
          strong: "rgba(255,255,255,0.18)",
        },
        ink: {
          primary: "#f2f4f7",
          secondary: "#9aa1ae",
          muted: "#656c79",
        },
        accent: {
          DEFAULT: "#22d3ee",
          hover: "#06b6d4",
        },
        section: {
          dashboard: "#22d3ee",
          brain: "#c084fc",
          vaults: "#34d399",
          projects: "#fb923c",
        },
        status: {
          good: "#34d399",
          warning: "#fbbf24",
          serious: "#fb923c",
          critical: "#f87171",
        },
        series: {
          blue: "#38bdf8",
          orange: "#fb923c",
          aqua: "#2dd4bf",
          yellow: "#fbbf24",
          magenta: "#f472b6",
          green: "#4ade80",
          violet: "#c084fc",
          red: "#f87171",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
      },
      fontSize: {
        xs: ["12px", "17px"],
        sm: ["13.5px", "20px"],
        base: ["14.5px", "22px"],
        lg: ["17px", "25px"],
        xl: ["20px", "27px"],
        "2xl": ["26px", "32px"],
      },
      boxShadow: {
        popover: "0 12px 40px rgba(0,0,0,0.55)",
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 0 24px -4px var(--glow, rgba(34,211,238,0.35))",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 45%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "grid-pan": {
          "0%": { backgroundPosition: "0px 0px" },
          "100%": { backgroundPosition: "48px 48px" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        "blob-float": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(3%, -4%) scale(1.06)" },
          "66%": { transform: "translate(-3%, 3%) scale(0.96)" },
        },
        typing: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "count-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        blink: "blink 1.1s step-end infinite",
        "grid-pan": "grid-pan 6s linear infinite",
        "glow-pulse": "glow-pulse 2.8s ease-in-out infinite",
        "blob-float": "blob-float 14s ease-in-out infinite",
        typing: "typing 1.8s steps(28, end)",
        "count-in": "count-in 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
