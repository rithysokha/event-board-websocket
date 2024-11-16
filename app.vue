<template>
  <div :class="$device.isMobile&&'bottom-0 fixed w-full'" v-if="!hideAppMenu">
    <NavigationBar/>
  </div>
  <NuxtRouteAnnouncer />
  <NuxtPage />
</template>
<script setup lang="ts">
const route = useRoute();
const hideAppMenu = route.path === '/';

</script>