// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  typescript: {
    typeCheck: true
  },

  app: {
    "baseURL": process.env.BASE_URL || "/",
  },

  ssr: false,

  build: {},

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',
    '@nuxtjs/google-fonts',
    "@nuxt/icon",
    "@nuxtjs/leaflet",
    "@nuxtjs/device"
  ],

  googleFonts: {
    families: {
      "M PLUS Rounded 1c": [400, 700],
      "Inter": "100..900",
    },
    download: false
  },

  icon: {
    serverBundle: 'remote',
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
          "src": "pwa/maskable-icon.svg",
          "sizes": "any",
          "type": "image/svg+xml",
          "purpose": "maskable"
        },
        {
          "src": "pwa/maskable-icon@1000px.png",
          "sizes": "1000x1000",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "pwa/maskable-icon@512px.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "pwa/maskable-icon@384px.png",
          "sizes": "384x384",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "pwa/maskable-icon@192px.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "pwa/maskable-icon@128px.png",
          "sizes": "128x128",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "pwa/maskable-icon@96px.png",
          "sizes": "96x96",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "pwa/maskable-icon@72px.png",
          "sizes": "72x72",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "pwa/maskable-icon@48px.png",
          "sizes": "48x48",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "icon.svg",
          "sizes": "any",
          "type": "image/svg+xml",
          "purpose": "any"
        },
        {
          "src": "icon/icon@1000px.png",
          "sizes": "1000x1000",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "icon/icon@512px.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "icon/icon@384px.png",
          "sizes": "384x384",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "icon/icon@192px.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "icon/icon@128px.png",
          "sizes": "128x128",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "icon/icon@96px.png",
          "sizes": "96x96",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "icon/icon@72px.png",
          "sizes": "72x72",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "icon/icon@48px.png",
          "sizes": "48x48",
          "type": "image/png",
          "purpose": "any"
        },
      ],
      description: 'Web上でタイマー付きの大きなデジタル時計を表示し、役に立つ情報も一目で確認できる多機能ダッシュボード。',
      screenshots: [
        {
          "src": "ogp.png",
          "sizes": "2800x1660",
          "type": "image/png",
          "form_factor": "wide"
        },
        {
          "src": "pwa/sc_mobile.png",
          "sizes": "1170x2532",
          "type": "image/png",
          "form_factor": "narrow"
        }
      ],
    }
  },

  colorMode: {
    preference: 'dash',
    dataValue: 'theme', // activate data-theme in <html> tag
    classSuffix: '',
  },

  experimental: {
    payloadExtraction: true,
  },

  compatibilityDate: "2024-08-28"
})