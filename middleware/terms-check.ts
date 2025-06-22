export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data: session } = useAuth()
  const userStore = useUserStore()
  
  if (!session.value?.user) {
    return
  }
  if(session.value.user.acceptTermsAt){
    userStore.acceptTerms()
  }
  
  if (!session.value.user.acceptTermsAt && !userStore.acceptedTerms) {
    const termsStore = useTermsStore()
    termsStore.setShowTermsModal(true)
  }
})
