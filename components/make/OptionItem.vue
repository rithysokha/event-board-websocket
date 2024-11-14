<script lang="ts" setup>

const props = defineProps<{
  item: { label: string, description: string ,imgUrl: string, to: string }
}>();

</script>
<template>
  <UCard :ui="{ shadow:'' }" class="px-2">
    <img class="max-w-full rounded-2xl my-2" :src="item.imgUrl" alt="img"/>
    <p class="font-bold">{{ item.label }} </p>
    <p class="text-sm">{{ item.description }} </p>
  </UCard>
</template>