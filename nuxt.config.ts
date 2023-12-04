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
    'nuxt-icon'
  ],
  colorMode: {
    preference: 'autumn', 
    dataValue: 'theme', // activate data-theme in <html> tag
    classSuffix: '',
  },
})
