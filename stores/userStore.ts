import { defineStore } from 'pinia'

export const useUserStore = defineStore('auth', {
  state: () => ({
    displayName: '',
  }),
  actions: {
    setDisplayName(displayName:string) {
      this.displayName = displayName
    }
  },
  persist: true,
})