import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    displayName: null, 
  }),
  actions: {
    setDisplayName(name: string) {
      this.displayName = name
    },
    clearDisplayName() {
      this.displayName = null
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'auth',
        storage: localStorage,
      },
    ],
  },
})
