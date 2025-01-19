<template>
  <NavigationBar v-if="!hideAppMenu && status=='authenticated'"  />
    <NuxtRouteAnnouncer />
    <NuxtPage />
</template>

<script setup lang="ts">
const route = useRoute();
const pathsToHideMenu = ['/', '/board'];
const {status} = useAuth()
const hideAppMenu = computed(() => pathsToHideMenu.includes(route.path));
</script>

<style>
::-webkit-scrollbar {
  display: none;
}
</style>