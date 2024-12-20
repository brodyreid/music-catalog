import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Iosevka']
      },
      colors: {
        primary: '#e7e5e4',
        secondary: '#18181b',
        tertiary: '#9D74B3',
        accent: '#4338ca'
      }
    },
  },
  plugins: [],
} satisfies Config

