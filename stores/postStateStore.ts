import { defineStore } from 'pinia'

export const usePostStateStoreStore = defineStore({
  id: 'postStateStore',
  state: () => ({
    isDeletingPost:false,
    isOpenPost:false,
    isOpenDeletePost:false
   }),
  actions: {
    setDeletingPost(state:boolean){
      this.isDeletingPost=state
    },
    setIsOpenPost(state:boolean){
      this.isOpenPost=state
    },
    setIsOpenDeletePost(state:boolean){
      this.isDeletingPost=state
    }
  }
})
