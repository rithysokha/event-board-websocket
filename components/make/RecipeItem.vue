<script lang="ts" setup>
import { Link } from '#build/components';

const props = defineProps<{
  items: Array<{ key: string, label: string, imgUrl: string, to: string }>
}>();
</script>
<template>
  <UCard v-for="item in items">
    <Link :to="item.to">
    <img :src="item.imgUrl" alt="img"/>
    <template #footer>
      <p>{{ item.label}} </p>
    </template>
  </Link>
  </UCard>
</template>
