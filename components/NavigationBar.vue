<script setup lang="ts">
const links = [
  [{
    label: 'Dashboard',
    icon: 'i-heroicons-home',
    to: '/dashboard/home'
  }, {
    label: 'Make',
    icon: 'i-heroicons-chart-bar',
    to: '/dashboard/make'
  }, {
    label: 'Join',
    icon: 'i-heroicons-command-line',
    to: '/dashboard/join'
  }], [{
    label: 'Profile',
    icon: 'i-heroicons-light-bulb',
    to: '/auth/profile'
  }]
]
</script>

<template>
  <UHorizontalNavigation :links="links" class="border-b border-gray-200 dark:border-gray-800" />
</template>

