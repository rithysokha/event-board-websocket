export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  modules: ['@nuxt/ui', '@nuxtjs/device'],
  nitro:{
    experimental:{
      websocket:true
    }
  },
  devtools: { enabled: true },
  components: true
})