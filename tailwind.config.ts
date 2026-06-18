import type { Config } from "tailwindcss";

// Gruvbox Cold Dark — see design.md for full palette reference
const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gruvbox Cold Dark palette
        "grv-hard":  "#1b2028",
        "grv-base":  "#232b34",
        "grv-soft":  "#293240",
        "grv-card":  "#2e3a48",
        "grv-hover": "#374554",
        "grv-b":     "#3e4e5e",
        "grv-b2":    "#4e6070",
        "grv-fg":    "#d8cdb8",
        "grv-fg2":   "#b8b0a0",
        "grv-fg3":   "#8a8480",
        "grv-fg4":   "#666260",
        "grv-aqua":  "#5f9ea8",
        "grv-aqua2": "#78b4c0",
        "grv-blue":  "#476f82",
        "grv-teal":  "#4d8870",
        "grv-amber": "#c89a3c",
        // shadcn semantic aliases → CSS variables
        background:  "var(--background)",
        foreground:  "var(--foreground)",
        card: {
          DEFAULT:    "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT:    "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT:    "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT:    "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT:    "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT:    "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT:    "var(--destructive)",
        },
        border: "var(--border)",
        input:  "var(--input)",
        ring:   "var(--ring)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        none: "0px",
        "4xl": "var(--radius)",
        xl:   "var(--radius)",
        lg:   "var(--radius)",
        md:   "var(--radius)",
        sm:   "var(--radius)",
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "var(--font-inter)", "sans-serif"],
        mono:    ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      animation: {
        "fade-up":      "fadeUp 0.7s ease-out both",
        "fade-in":      "fadeIn 0.6s ease-out both",
        "cursor-blink": "cursorBlink 1.1s step-end infinite",
        "glow-soft":    "glowSoft 4s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        cursorBlink: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },
        glowSoft: {
          "0%, 100%": { opacity: "0.4" },
          "50%":      { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
