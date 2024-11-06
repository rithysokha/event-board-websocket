export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxtjs/device'],
  nitro:{
    experimental:{
      websocket:true
    }
  },
  components: true
})