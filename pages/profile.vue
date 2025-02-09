<script setup lang="ts">
definePageMeta({
  middleware: 'sidebase-auth',
})
const toast = useToast()
const isLoadingBtn = ref(false)
const { signOut, data } = useAuth()

const handleSignOut = ()=>{
  isLoadingBtn.value=true
  signOut({ callbackUrl: '/auth' })
  toast.add({title:"You're signed out"})
  isLoadingBtn.value=false
}
</script>

<template>
  <div class="flex flex-col items-center gap-2 mt-14">
    <UAvatar :src="data?.user.image" size="3xl" />
    <p class="font-bold"> {{ data?.user.name }} </p>
    <p>{{ data?.user.email }} </p>
    <UButton class="mt-14" color="red" @click="handleSignOut" :loading="isLoadingBtn">
      Signout
    </UButton>
  </div>
</template>