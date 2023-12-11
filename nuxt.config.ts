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
    'nuxt-icon',
    '@vite-pwa/nuxt'
  ],
  pwa: {
    manifest: {
      name: 'Campus Dashboard',
      short_name: 'CP-Dashboard',
      lang: 'ja',
      display: 'standalone',
    },
  },
  colorMode: {
    preference: 'dash', 
    dataValue: 'theme', // activate data-theme in <html> tag
    classSuffix: '',
  },
})
