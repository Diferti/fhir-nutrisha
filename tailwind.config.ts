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
        thirdary: "rgb(var(--thirdary))",
        background: "rgb(var(--background))",
        shadow: "rgb(var(--shadow))",
        pageColor: "rgb(var(--pageColor))",
      },
      fontFamily: {
        fontHeader: ['"Alegreya SC"', 'serif'],
        fontMain: ['"Andada Pro"', 'serif'],
      },
      screens: {
        '2k': '2000px',
      },
      animation: {
        dots: 'dots 2s infinite steps(1)',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        dots: {
          '0%, 100%': { content: "'.'" },
          '33%': { content: "'..'" },
          '66%': { content: "'...'" },
        }
      },
    },
  },
  plugins: [],
}
export default config
