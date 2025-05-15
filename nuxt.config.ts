export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  modules: [
    '@nuxt/ui',
    '@nuxtjs/device',
    '@sidebase/nuxt-auth',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate',
    'nuxt-gtag'
  ],
  gtag: {
    id: 'G-5DXDXZQ6KH'
  },
  nitro:{
    experimental:{
      websocket:true
    },
    prerender: {
      routes: ['/']
    }
  },
  runtimeConfig: {
    public: {
      cloudeName: process.env.CLOUDINARY_CLOUD_NAME,
      baseUrl: process.env.BASE_URL,
      persistState: true, 
    },
  },
  devtools: { enabled: true },
  components: true,
  auth: {
    isEnabled: true,
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: 'authjs'
    },
    globalAppMiddleware: true
  }
})