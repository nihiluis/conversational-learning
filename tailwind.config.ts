import { type Config } from "tailwindcss"
import * as daisyui from "daisyui"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    theme: {
      colors: {
      },
    },
    extend: {},
  },
  plugins: [daisyui],
} satisfies Config
