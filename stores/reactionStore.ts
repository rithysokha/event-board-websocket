import { defineStore } from 'pinia'

export const useReactionStore = defineStore('reactionStore', {
  state: () => {
    let storedReactions: string[] = []
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('userReactions')
      if (stored) {
        storedReactions = JSON.parse(stored)
      }
    }
    return {
      userReactions: storedReactions
    }
  },
  actions: {
    addReaction(postId: string) {
      if (!this.userReactions.includes(postId)) {
        this.userReactions.push(postId)
        if (typeof window !== 'undefined') {
          localStorage.setItem('userReactions', JSON.stringify(this.userReactions))
        }
      }
    },
    hasReacted(postId: string): boolean {
      return this.userReactions.includes(postId)
    },
    removeReaction(postId: string) {
      const index = this.userReactions.indexOf(postId)
      if (index !== -1) {
        this.userReactions.splice(index, 1)
        if (typeof window !== 'undefined') {
          localStorage.setItem('userReactions', JSON.stringify(this.userReactions))
        }
      }
    }
  }
})