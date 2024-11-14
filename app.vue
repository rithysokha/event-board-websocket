<template>
  <NavigationBar v-if="!$device.isMobile && !hideAppMenu"/>
  <NuxtRouteAnnouncer />
  <NuxtPage />
  <div class=" bottom-0 fixed w-full" v-if="$device.isMobile && !hideAppMenu"">
    <NavigationMobile />
  </div>
</template>
<script setup lang="ts">
const route = useRoute();
const hideAppMenu = route.path === '/';

</script>