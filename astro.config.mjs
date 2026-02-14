import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://arnold-kirk.com',
  integrations: [
    mdx(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    formats: ['webp', 'avif'],
  },
  build: {
    format: 'directory',
  },
  compressHTML: true,
  vite: {
    build: {
      cssMinify: true,
      minify: 'terser',
    },
  },
});
