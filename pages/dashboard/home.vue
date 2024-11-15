<script setup lang="ts">
const  Recent  = defineAsyncComponent(()=> import('~/components/home/Recent.vue'))
const  MadeByMe =defineAsyncComponent(() =>import ('~/components/home/MadeByMe.vue'))
const Trashed =defineAsyncComponent(()=> import('~/components/home/Trashed.vue'))
const Favorite =defineAsyncComponent(()=> import('~/components/home/Favorite.vue'))

const items = [
  {
    key: 'recent',
    label: 'Recents',
    component: Recent
  },
  {
    key: 'madeByMe',
    label: 'Mine',
    component: MadeByMe
  },
  {
    key: 'trashed',
    label: 'Trashed',
    component: Trashed
  },
  {
    key: 'favorite',
    label: 'Favorite',
    component: Favorite
  }
];
</script>

<template>
  <SideTab :items="items" />
</template>