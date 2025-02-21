import { defineStore } from 'pinia'

export const usePostStore = defineStore('postStore', {
  state: () => ({
    posts:['']
  }),
  actions: {
    addPost(postId: string) {
        this.posts.push(postId)
    },
    removePost(postId: string) {
      const index = this.posts.indexOf(postId)
      if (index !== -1) {
        this.posts.splice(index, 1)
      }
    }
  },
  persist:true
})