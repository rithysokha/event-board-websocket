import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    displayName: '',
    displayPhoto: '',
    uuid:'',
    acceptedTerms:false
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
    },
    clearData(){
      this.displayName=''
      this.displayPhoto=''
      this.uuid=''
      this.acceptedTerms=false
    },
    acceptTerms(){
      this.acceptedTerms=true
    }
  },
  persist: true,
})