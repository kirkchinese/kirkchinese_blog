/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'rgb(var(--color-text-base))',
            a: {
              color: 'rgb(var(--color-primary))',
              '&:hover': {
                color: 'rgb(var(--color-primary-dark))',
              },
            },
          },
        },
      }),
      colors: {
        background: 'rgb(var(--color-background))',
        text: {
          base: 'rgb(var(--color-text-base))',
          muted: 'rgb(var(--color-text-muted))',
        },
        primary: {
          DEFAULT: 'rgb(var(--color-primary))',
          dark: 'rgb(var(--color-primary-dark))',
        },
        border: 'rgb(var(--color-border))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
