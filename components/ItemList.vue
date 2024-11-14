<template>
  <UContainer >
    <UCard v-for="item in items" :key="item.id">
      <Placeholder class="h-32" />
      <template #footer>
        <p class="">{{item.title}}</p>
      </template>
    </UCard>
  </UContainer>
</template>

<script lang="ts" setup>
const props = defineProps<{
  items: Array<{ id: number, picture_url: string, title: string }>
}>();
</script>