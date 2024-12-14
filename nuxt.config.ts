export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  modules: ['@nuxt/ui', '@nuxtjs/device'],
  nitro:{
    experimental:{
      websocket:true
    }
  },
  runtimeConfig: {
    public: {
      wsUrl: process.env.WEBSOCKET_URL || 'wss://webboard.live/',
      cloudeName: process.env.CLOUDINARY_CLOUD_NAME,
      baseUrl: process.env.BASE_URL
    },
  },
  devtools: { enabled: true },
  components: true
})