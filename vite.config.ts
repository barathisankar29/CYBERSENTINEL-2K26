import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { SITE_UNDER_DEVELOPMENT, UNDER_DEVELOPMENT_IMAGE } from './src/config/siteGate.ts'

/**
 * While the under-development gate is on, index.html drops what only the full
 * site needs (the city background preload and Google Fonts) and preloads the
 * gate artwork instead. With the gate off, index.html is left exactly as
 * written.
 */
function underDevelopmentHtml(): Plugin {
  return {
    name: 'cybersentinel:under-development-html',
    transformIndexHtml(html, ctx) {
      // The dev server (npm run dev) shows the full site, so keep its index.html intact.
      if (!SITE_UNDER_DEVELOPMENT || ctx.server) return html
      return html
        .replace(/\s*<link rel="preload" as="image" href="\/assets\/city\/[^>]*>/, '')
        .replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.[^>]*>/g, '')
        .replace(/\s*<!-- Fonts load[^>]*-->/, '')
        .replace(/\s*<link rel="preload" as="style" href="https:\/\/fonts\.googleapis\.com\/[^>]*>/, '')
        .replace(/\s*<noscript><link href="https:\/\/fonts\.googleapis\.com\/[^>]*><\/noscript>/, '')
        // Lets the gate's env(safe-area-inset-*) padding clear notches.
        .replace('initial-scale=1.0"', 'initial-scale=1.0, viewport-fit=cover"')
        .replace(
          '</title>',
          `</title>
    <meta name="theme-color" content="#000000" />
    <link rel="preload" as="image" href="${UNDER_DEVELOPMENT_IMAGE}" type="image/png" fetchpriority="high">`,
        )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), underDevelopmentHtml()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
