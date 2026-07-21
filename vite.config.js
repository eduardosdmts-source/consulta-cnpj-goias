import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import siteConfig from './site.config.mjs'

function injectSiteTitle() {
  return {
    name: 'inject-site-title',
    transformIndexHtml(html) {
      return html.replace(/<title>.*?<\/title>/, `<title>${siteConfig.siteName}</title>`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: siteConfig.basePath,
  build: {
    outDir: siteConfig.outDir,
  },
  plugins: [react(), tailwindcss(), injectSiteTitle()],
})
