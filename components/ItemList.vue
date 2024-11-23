<template>
  <UContainer>
    <div class="flex flex-wrap">
      <UCard v-for="item in items" :key="item.name" :ui="{body:{padding:'p-2 sm:p-2'}}" class="w-full sm:w-[30%] lg:w-[22.5%] m-2">
        <div class="flex justify-between sm:w-full sm:h-32 lg:h-40 sm:flex-col sm:items-center">
          <div class="w-10 rounded-md sm:w-full sm:h-full" :class="'bg-'+item.cover"></div>
          <p>{{item.name}}</p>
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