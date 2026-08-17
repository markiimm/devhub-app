import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0b",
        surface: {
          1: "#111113",
          2: "#17171a",
          3: "#1e1e22",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.08)",
          strong: "rgba(255,255,255,0.14)",
        },
        ink: {
          primary: "#f4f4f5",
          secondary: "#a1a1aa",
          muted: "#71717a",
        },
        accent: {
          DEFAULT: "#3987e5",
          hover: "#2f74c9",
        },
        status: {
          good: "#0ca30c",
          warning: "#c98500",
          serious: "#ec835a",
          critical: "#d03b3b",
        },
        series: {
          blue: "#3987e5",
          orange: "#d95926",
          aqua: "#199e70",
          yellow: "#c98500",
          magenta: "#d55181",
          green: "#1baf7a",
          violet: "#9085e9",
          red: "#e66767",
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
        md: "8px",
        lg: "10px",
      },
      fontSize: {
        xs: ["12px", "17px"],
        sm: ["13px", "19px"],
        base: ["14px", "21px"],
        lg: ["16px", "23px"],
        xl: ["19px", "26px"],
        "2xl": ["23px", "30px"],
      },
      boxShadow: {
        popover: "0 8px 30px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [],
};
export default config;
