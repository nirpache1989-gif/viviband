import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // New site tokens (Cores do Samba palette)
        wine: {
          deep: "var(--bg-deep)",
          mid: "var(--bg-mid)",
          elev: "var(--bg-elev)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          dim: "var(--ink-dim)",
          faint: "var(--ink-faint)",
        },
        accent: {
          DEFAULT: "var(--c-magenta)",
          hover: "var(--c-amber)",
          muted: "rgba(255, 31, 107, 0.15)",
          magenta: "var(--c-magenta)",
          cyan: "var(--c-cyan)",
          violet: "var(--c-violet)",
          vermillion: "var(--c-vermillion)",
          amber: "var(--c-amber)",
          jade: "var(--c-jade)",
        },
        rule: "var(--rule)",
        // Back-compat aliases so the admin panel keeps rendering with the new palette
        bg: {
          primary: "var(--bg-deep)",
          secondary: "var(--bg-mid)",
          elevated: "var(--bg-elev)",
        },
        text: {
          primary: "var(--ink)",
          secondary: "var(--ink-dim)",
        },
        border: "var(--rule)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        hand: ["var(--font-hand)", "cursive"],
      },
      maxWidth: {
        content: "1480px",
        narrow: "960px",
      },
    },
  },
  plugins: [],
};
export default config;
