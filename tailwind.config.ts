import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--primary))",
        secondary: "rgb(var(--secondary))",
        background: "rgb(var(--background))",
        shadow: "rgb(var(--shadow))",
        pageColor: "rgb(var(--pageColor))",
      },
      fontFamily: {
        fontHeader: ['"Alegreya SC"', 'serif'],
        fontMain: ['"Andada Pro"', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
