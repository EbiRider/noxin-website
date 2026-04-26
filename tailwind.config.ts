import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          950: '#061827',
          900: '#062a4e',
          800: '#0a3d6b',
          600: '#1565a8',
          500: '#0d7a8a',
          400: '#0d9aa8',
          teal: '#5dd9e0',
          'teal-light': '#90d9f0',
        },
        surface: {
          DEFAULT: '#f0f4f8',
          card: '#f7fafd',
        },
        ink: {
          DEFAULT: '#1a2332',
          soft: '#4a6070',
          muted: '#6b7f96',
          faint: '#7a8fa6',
        },
      },
      fontFamily: {
        sans: ['var(--font-vazirmatn)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
