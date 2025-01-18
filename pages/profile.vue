<script setup lang="ts">
definePageMeta({
  middleware: 'sidebase-auth',
})
const { signOut } = useAuth()
</script>

<template>
  <button @click="() => signOut">
    Signout
  </button>
  <button @click="() => signOut({ callbackUrl: '/signout' })">
    Signout with redirect
  </button>
  <button @click="() => signOut({ callbackUrl: 'https://nuxt.org', external: true })">
    Signout with external redirect
  </button>
</template>