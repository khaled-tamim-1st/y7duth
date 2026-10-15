import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://yahduth-fi-al-kuwait.com',
  integrations: [tailwind({
    applyBaseStyles: false,
  })],
  compressHTML: true,
});
