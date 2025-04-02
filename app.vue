<template>
  <NavigationBar v-if="status=='authenticated'"  />
  <div :class="status=='authenticated' && !$device.isMobile&&'mt-12'"></div>
  <NuxtRouteAnnouncer />
  <NuxtPage />
  <UNotifications />
</template>
<script setup lang="ts">
const {status} = useAuth()
</script>

<style>
::-webkit-scrollbar {
  display: none;
}
</style>