import { defineStore } from 'pinia'

export const useUserStore = defineStore('displayName', {
  state: () => ({
    displayName: '',
    displayPhoto: '',
    uuid:''
  }),
  actions: {
    setDisplayName(displayName:string) {
      this.displayName = displayName
    },
    setDisplayPhoto(displayPhoto:string){
      this.displayPhoto=displayPhoto
    },
    setUuid(uuid:string){
      this.uuid = uuid
    }
  },
  persist: true,
})