<script setup lang="ts">
definePageMeta({
  middleware: 'sidebase-auth',
})
const toast = useToast()

const { signOut, data } = useAuth()

const handleSignOut = ()=>{
  signOut({ callbackUrl: '/auth' })
  toast.add({title:"You're signed out"})
}
</script>

<template>
  <div class="flex flex-col items-center gap-2 mt-14">
    <UAvatar :src="data?.user.image" size="3xl" />
    <p class="font-bold"> {{ data?.user.name }} </p>
    <p>{{ data?.user.username }} </p>
    <p>{{data?.user.role}}</p>
    <UButton class="mt-14" color="red" @click="handleSignOut">
      Signout
    </UButton>
  </div>
</template>