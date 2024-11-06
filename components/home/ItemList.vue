<template>
  <UContainer class="flex">
    <UCard v-for="item in items" :key="item.id" class="">
      <Placeholder class="h-32" />
      <template #footer>
        <p>{{item.title}}</p>
      </template>
    </UCard>
  </UContainer>
</template>

<script lang="ts" setup>
const props = defineProps<{
  items: Array<{ id: number, picture_url: string, title: string }>
}>();
</script>