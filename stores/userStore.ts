import { defineStore } from 'pinia'

export const useUserStore = defineStore('displayName', {
  state: () => ({
    displayName: '',
    displayPhoto: ''
  }),
  actions: {
    setDisplayName(displayName:string) {
      this.displayName = displayName
    },
    setDisplayPhoto(displayPhoto:string){
      this.displayPhoto=displayPhoto
    }
  },
  persist: true,
})