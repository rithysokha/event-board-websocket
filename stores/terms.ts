export const useTermsStore = defineStore('terms', () => {
  const showTermsModal = ref(false)
  const hasAcceptedTerms = ref(false)
  const userStore = useUserStore()
  
  const setShowTermsModal = (show: boolean) => {
    showTermsModal.value = show
  }
  
  const setHasAcceptedTerms = (accepted: boolean) => {
    hasAcceptedTerms.value = accepted
  }
  
  const acceptTerms = async (userEmail: string) => {
    try {
      const response = await $fetch('/api/user/terms/accept', {
        method: 'PUT',
        body: { email: userEmail }
      })
      if (response?.success && response.user) {
        userStore.acceptTerms()
        hasAcceptedTerms.value = true
        showTermsModal.value = false
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error accepting terms:', error)
      return false
    }
  }
  return {
    showTermsModal,
    hasAcceptedTerms,
    setShowTermsModal,
    setHasAcceptedTerms,
    acceptTerms
  }
})