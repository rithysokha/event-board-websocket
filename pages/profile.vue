<script setup lang="ts">
definePageMeta({
  middleware: 'sidebase-auth',
})
const toast = useToast()

const showToast = ()=> {
  toast.add(
    {
      title:'Signed Out',
      description: 'You have signed out',
    }
  )
}
const { signOut, data } = useAuth()

const handleSignOut = ()=>{
  signOut({ callbackUrl: '/auth' })
  // showToast()
}
console.log(data.value?.user)
</script>

<template>
  <div class="flex flex-col items-center gap-2 mt-14">
    <UAvatar :src="data?.user.image" size="3xl" />
    <p class="font-bold"> {{ data?.user.name }} </p>
    <p>{{ data?.user.email }} </p>
    <p>{{data?.user.role}}</p>
    <UButton class="mt-14" color="red" @click="handleSignOut">
      Signout
    </UButton>
  </div>
</template>