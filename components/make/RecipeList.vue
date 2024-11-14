<script lang="ts" setup>
const props = defineProps<{
  items: Array<{ label: string, imgUrl: string, to: string }>
}>();
</script>
<template>
  <div class="grid grid-cols-2 gap-3">
  <LazyMakeRecipeItem :items="items" />
</div>
</template>