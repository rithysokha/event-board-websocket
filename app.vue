<template>
  <div class="w-full z-50" :class="$device.isMobile?'bottom-0': 'top-0'" v-if="!hideAppMenu">
    <NavigationBar/>
  </div>
  <NuxtRouteAnnouncer />
  <NuxtPage />
</template>
<script setup lang="ts">
const route = useRoute();
const hideAppMenu = route.path === '/' || '/board/*';

</script>