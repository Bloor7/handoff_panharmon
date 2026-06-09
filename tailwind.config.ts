import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg0: "var(--bg-0)",
        bg1: "var(--bg-1)",
        bg2: "var(--bg-2)",
        ink: "var(--ink)",
        "ink-dim": "var(--ink-dim)",
        "ink-mute": "var(--ink-mute)",
        gold: "var(--gold)",
        "gold-soft": "var(--gold-soft)",
        jade: "var(--jade)",
        plum: "var(--plum)"
      },
      fontFamily: {
        serif: "var(--font-serif)",
        sans: "var(--font-sans)"
      },
      transitionTimingFunction: {
        panharmon: "var(--ease)"
      }
    }
  },
  plugins: []
};

export default config;
