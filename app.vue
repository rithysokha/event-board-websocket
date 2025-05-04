<template>
  <NavigationBar v-if="status=='authenticated'"  />
  <div :class="status=='authenticated' && !$device.isMobile&&'mt-12'"></div>
  <NuxtRouteAnnouncer />
  <NuxtPage :transition="route.meta.pageTransition || { name: 'default-transition', mode: 'out-in' }" />
  <UNotifications />
</template>
<script setup lang="ts">
const {status} = useAuth()
const route = useRoute()
</script>

<style>
::-webkit-scrollbar {
  display: none;
}
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
</style>