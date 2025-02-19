import { defineStore } from 'pinia'

export const useReactionStore = defineStore('reactionStore', {
  state: () => ({
    userReactions:['']
  }),
  actions: {
    addReaction(postId: string) {
        this.userReactions.push(postId)
    },
    hasReacted(postId: string): boolean {
      return this.userReactions.includes(postId)
    },
    removeReaction(postId: string) {
      const index = this.userReactions.indexOf(postId)
      if (index !== -1) {
        this.userReactions.splice(index, 1)
      }
    }
  },
  persist:true
})