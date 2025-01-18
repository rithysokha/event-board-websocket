export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  modules: [
    '@nuxt/ui',
    '@nuxtjs/device',
    '@nuxtjs/i18n',
    '@sidebase/nuxt-auth'
  ],
  nitro:{
    experimental:{
      websocket:true
    }
  },
  runtimeConfig: {
    public: {
      cloudeName: process.env.CLOUDINARY_CLOUD_NAME,
      baseUrl: process.env.BASE_URL
    },
  },
  i18n: {
    vueI18n: './i18n.config.ts'
  },
  devtools: { enabled: true },
  components: true,
  auth: {
    baseURL:'http:/localhost:3000/api/auth',
    provider: {
      type: 'authjs',
      trustHost: true,
      defaultProvider: 'google',
      addDefaultCallbackUrl: true
    },
    globalAppMiddleware: true
  }
})