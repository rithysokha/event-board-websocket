import { defineStore } from 'pinia'
export const useUserStore = defineStore('userStore', {
  state: () => ({
    displayName: typeof window !== 'undefined'
      ? localStorage.getItem('displayName') || ''
      : ''
  }),
  actions: {
    setDisplayName(name: string) {
      this.displayName = name
      if (typeof window !== 'undefined') {
        localStorage.setItem('displayName', name)
      }
    }
  }
})