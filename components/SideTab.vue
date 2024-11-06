<script setup lang="ts">

const items = [{
  key: 'recent',
  label: 'Recents'
},
{
  key: 'madeByMe',
  label: 'Made by me'
},
{
  key: 'trashed',
  label: 'Trashed'
},
{
  key: 'favorite',
  label: 'Favorite'
}]
</script>
<template>
  <UTabs :items="items" class="w-full" orientation="vertical"
    :ui="{ wrapper: 'flex items-center gap-4', list: { width: 'w-48' } }">
    <template #item="{ item }">
      <HomeRecent v-if="item.key === 'recent'"/>
      <HomeMadeByMe v-if="item.key === 'madeByMe'"/>
      <HomeTrashed v-if="item.key === 'trashed'"/>
      <HomeFavorite v-else-if="item.key === 'favorite'"/>
    </template>
  </UTabs>
</template>
