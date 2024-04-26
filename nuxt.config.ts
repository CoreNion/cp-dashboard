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
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'nuxt3-leaflet',
    'nuxt-icon',
    '@vite-pwa/nuxt',
    '@nuxtjs/google-fonts',
  ],
  googleFonts: {
    families: {
      "M PLUS Rounded 1c": [400, 700],
      "Inter": "100..900",
    },
    download: false
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  pwa: {
    workbox: {
      navigateFallback: null,
    },
    manifest: {
      name: 'Campus Dashboard',
      short_name: 'CP-Dashboard',
      lang: 'ja',
      display: 'standalone',
      theme_color: '#42b3f5',
      icons: [
        {
          "src": "pwa/maskable-icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
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
  experimental: {
    payloadExtraction: true,
  }
})