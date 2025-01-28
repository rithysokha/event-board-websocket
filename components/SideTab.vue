<script setup lang="ts">
const props = defineProps<{
  items: Array<{ key: string, label: string, component: any }>
}>();
</script>

<template>
      <UTabs :items="props.items" class="w-full min-h-screen" :orientation="$device.isMobile?'horizontal': 'vertical'" :ui="$device.isMobile?{ wrapper: 'flex flex-col items-center gap-4 ', list: { width: 'w-full' } }: { wrapper: 'flex  gap-4', list: { width: 'w-48' } }">
        <template #item="{ item }">
          <div :class="item.key">
            <component :is="item.component" />
          </div>
        </template>
      </UTabs>
</template>