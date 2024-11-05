<script setup lang="ts">
const items = [{
  label: 'Profile',
  icon: 'i-heroicons-information-circle',
  content: 'This is the content shown for Tab1'
}, {
  label: 'Settings',
  icon: 'i-heroicons-arrow-down-tray',
  content: 'And, this is the content for Tab2'
}, {
  label: 'My boards',
  icon: 'i-heroicons-eye-dropper',
  content: 'Finally, this is the content for Tab3'
},
{
  label: "What's new",
  icon: 'i-heroicons-information-circle',
  content: 'This is the content shown for Tab1'
}]
</script>

<template>
  <UTabs :items="items" orientation="vertical" class="w-full">
    <template #icon="{ item, selected }">
      <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0 me-2" :class="[selected && 'text-primary-500 dark:text-primary-400']" />
    </template>
  </UTabs>
</template>