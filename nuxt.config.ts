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
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  modules: [
    '@nuxtjs/tailwindcss'
  ]
})
