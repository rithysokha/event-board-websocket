<script setup lang="ts">
const termsStore = useTermsStore()
const { data: session } = useAuth()
const toast = useToast()

const isAccepting = ref(false)

const handleAcceptTerms = async () => {
  if (!session.value?.user?.email) {
    toast.add({
      title: 'Session error - please login again',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle'
    })
    return
  }
  
  isAccepting.value = true
  
  try {
    const success = await termsStore.acceptTerms(session.value.user.email)
    
    if (success) {
      toast.add({
        title: 'Terms and conditions accepted successfully',
        color: 'green',
        icon: 'i-heroicons-check-circle'
      })
    } else {
      toast.add({
        title: 'Failed to accept terms - please try again',
        color: 'red',
        icon: 'i-heroicons-exclamation-circle'
      })
    }
  } catch (error) {
    console.error('Terms acceptance error:', error)
    toast.add({
      title: 'Something went wrong - please try again',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle'
    })
  } finally {
    isAccepting.value = false
  }
}

const handleDecline = async () => {
  const { signOut } = useAuth()
  await signOut({ callbackUrl: '/auth' })
  
  toast.add({
    title: 'You must accept terms to use this platform',
    color: 'red',
    icon: 'i-heroicons-exclamation-circle'
  })
}
</script>

<template>
  <UModal 
    v-model="termsStore.showTermsModal" 
    :prevent-close="true"
    :ui="{ width: 'sm:max-w-2xl' }"
  >
    <div class="p-6">
      <div class="mb-4">
        <h2 class="text-xl font-semibold text-red-600">Terms & Conditions Required</h2>
        <p class="text-sm text-gray-600 mt-2">
          Please review and accept our terms and conditions to continue using the platform.
        </p>
      </div>
      <TermAndCondition/>
      <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <UButton 
          color="red" 
          variant="ghost" 
          @click="handleDecline"
          :disabled="isAccepting"
        >
          Decline & Logout
        </UButton>
        <UButton 
          @click="handleAcceptTerms"
          :loading="isAccepting"
        >
          I Accept Terms
        </UButton>
      </div>
    </div>
  </UModal>
</template>