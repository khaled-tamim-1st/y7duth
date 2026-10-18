import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://y7duth.online',
  trailingSlash: 'never',
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  vite: {
    server: {
      watch: {
        ignored: ['**/local-data/**', '**/.git/**', '**/dist/**'],
      },
    },
  },
  compressHTML: true,
});
