import { defineStore } from 'pinia'

export const useUserStore = defineStore('comment', {
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