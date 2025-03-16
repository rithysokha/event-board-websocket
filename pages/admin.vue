<script lang="ts" setup>
definePageMeta({
  middleware:'sidebase-auth',
})
const Users = defineAsyncComponent(() => import('~/components/admin/User.vue'))
const BoardPreset = defineAsyncComponent(() => import('~/components/admin/BoardPreset.vue'))
const Avatar = defineAsyncComponent(() => import('~/components/admin/Avatar.vue'))
const items = [
  {
    key: 'user',
    label: 'User',
    component: Users
  },
  {
    key: 'board',
    label: 'Board Preset',
    component: BoardPreset
  },
  {
    key: 'avatar',
    label: 'Avatar',
    component: Avatar
  }
]
</script>
<template>
  <SideTab :items="items" />
</template>

