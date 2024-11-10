<script lang="ts" setup>
import { Link } from '#build/components';

const props = defineProps<{
  item: { label: string, imgUrl: string, to: string }
}>();

</script>
<template>
  <UCard>
    <img class="max-w-10 " :src="item.imgUrl" alt="img"/>
    <template #footer>
      <p>{{ item.label}} </p>
    </template>
  </UCard>
</template>