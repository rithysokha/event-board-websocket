<script lang="ts" setup>
const props = defineProps<{
  items: Array<{ label: string, imgUrl: string, to: string }>
}>();
</script>
<template>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
    <UCard v-for="item in items">
      <img :src="item.imgUrl" class="rounded-lg" alt="img"/>
      <p> {{ item.label }} </p>
    </UCard>
</div>
</template>