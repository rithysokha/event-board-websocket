<script lang="ts" setup>
const props = defineProps<{
  items: Array<{ label: string,description: string, imgUrl: string, to: string }>
}>();
</script>

<template>
  <div v-for=" item in items">
    <LazyMakeOptionItem :item="item"/>
  </div>
</template>
