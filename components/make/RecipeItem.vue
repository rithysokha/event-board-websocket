<script lang="ts" setup>

const props = defineProps<{
  items: Array<{ label: string, imgUrl: string, to: string }>
}>();
</script>
<template>
  <UCard v-for="item in items">
    <img :src="item.imgUrl" class="rounded-lg" alt="img"/>
    <p> {{ item.label }} </p>
  </UCard>
</template>
