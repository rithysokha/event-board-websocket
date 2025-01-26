<template>
  <NavigationBar v-if="status=='authenticated'"  />
  <div :class="status=='authenticated'&&'mt-12'"></div>
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