/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        kuwait: {
          sand: '#f4f0e7',
          sandDark: '#e8e1d4',
          sandBorder: '#d9d1c2',
          navy: '#18323c',
          navyLight: '#263b3e',
          navyMuted: '#41535a',
          green: '#126447',
          greenHover: '#0e5038',
          greenLight: '#b8d3c2',
          red: '#cf3935',
          redHover: '#b82f2c',
          textMuted: '#777b74',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
