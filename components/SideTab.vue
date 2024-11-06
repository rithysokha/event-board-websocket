<script setup lang="ts">
const props = defineProps<{
  items: Array<{ key: string, label: string, component: any }>
}>();
</script>

<template>
      <UTabs :items="props.items" class="w-full" orientation="vertical" :ui="{ wrapper: 'flex items-center gap-4', list: { width: 'w-48' } }">
        <template #item="{ item }">
          <div :class="item.key">
            <component :is="item.component" />
          </div>
        </template>
      </UTabs>
</template>