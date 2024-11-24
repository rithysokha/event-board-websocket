<template>
  <UContainer>
    <div class="grid gap-2 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <UCard v-for="item in items" :key="item.name" class="w-full">
        <div class="flex justify-between  sm:w-full sm:h-28 lg:h-30 sm:flex-col sm:items-center">
          <div class="w-10 rounded-md sm:w-full sm:h-full" :class="'bg-'+item.cover"></div>
          <p class="w-full text-end sm:text-center">{{item.name}}</p>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const props = defineProps<{
  items: Array<{ cover: string, name: string }>
}>();
</script>