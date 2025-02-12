import { defineStore } from 'pinia'


export const useUserStore = defineStore('userStore', {
  state: () => ({
    displayName: ''
  }),
  actions: {
    setDisplayName(name: string) {
      this.displayName = name
    }
  }
})