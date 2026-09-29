// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// [TODO] Remplacer par l'adresse définitive donnée par Vercel (sert au SEO et au sitemap).
const SITE_URL = 'https://knowledge-revolution-fbais.vercel.app';

export default defineConfig({
  site: SITE_URL,
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
