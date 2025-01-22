<template>
  <NavigationBar v-if="status=='authenticated'"  />
  <div class="mt-12"></div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
</template>

<script setup lang="ts">
const {status} = useAuth()
</script>

<style>
::-webkit-scrollbar {
  display: none;
}
</style>