// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    typeCheck: true
  },
  app: {
    "baseURL": process.env.BASE_URL || "/",
  },
  build: {},
  modules: [
    '@nuxtjs/google-fonts',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'nuxt3-leaflet',
    'nuxt-icon',
    '@vite-pwa/nuxt'
  ],
  googleFonts: {
    families: {
      "BIZ+UDPGothic": [400, 700],
    }
  },
  pwa: {
    manifest: {
      name: 'Campus Dashboard',
      short_name: 'CP-Dashboard',
      lang: 'ja',
      display: 'standalone',
      icons: [
        {
          "src": "pwa/maskable-icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "any maskable"
        },
        {
          "src": "pwa/pwa-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        },
        {
          "src": "pwa/pwa-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "pwa/pwa-64x64.png",
          "sizes": "64x64",
          "type": "image/png"
        },
      ]
    }
  },
  colorMode: {
    preference: 'dash', 
    dataValue: 'theme', // activate data-theme in <html> tag
    classSuffix: '',
  },
})
