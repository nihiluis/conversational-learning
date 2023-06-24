import { type Config } from "tailwindcss"
import * as daisyui from "daisyui"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    theme: {
      colors: {},
    },
    extend: {},
  },
  darkMode: "class",
  daisyui: { logs: false, themes: ["light"] },
  plugins: [daisyui],
} satisfies Config
