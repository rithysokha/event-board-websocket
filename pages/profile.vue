<script setup lang="ts">
definePageMeta({
  middleware: 'sidebase-auth',
})
const { signOut, data } = useAuth()
</script>

<template>
  <button @click="() => signOut">
    Signout
  </button>
  <button @click="() => signOut({ callbackUrl: '/auth' })">
    Signout with redirect
  </button>
</template>