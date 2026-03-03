import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores que usan variables CSS
        primary: {
          DEFAULT: 'var(--color-button-primary)',
          hover: 'var(--color-button-hover)',
        },
        bg: {
          primary: 'var(--color-bg-primary)',
          card: 'var(--color-bg-card)',
        },
        sidebar: {
          DEFAULT: 'var(--color-sidebar-bg)',
          bg: 'var(--color-sidebar-bg)',
          text: 'var(--color-sidebar-text)',
        },
        navbar: {
          DEFAULT: 'var(--color-navbar)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
        },
        // Colores de estados
        success: {
          DEFAULT: 'var(--color-success)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}
