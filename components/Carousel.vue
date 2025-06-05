<script setup lang="ts">
const items = [
  'https://res.cloudinary.com/dbiso7uht/image/upload/f_auto,q_5/v1744264631/Screenshot_2025-04-10_103552_c9it4q.png',
  'https://res.cloudinary.com/dbiso7uht/image/upload/f_auto,q_5/v1744256245/lsruzttnxpx6iyki3kcx.png'
]
const carouselRef = ref()

onMounted(() => {
  setInterval(() => {
    if (!carouselRef.value) return

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0)
    }
    carouselRef.value.next()
  }, 3000)
})
</script>

<template>
  <UCarousel
    ref="carouselRef"
    v-slot="{ item }"
    :items="items"
    :ui="{ item: 'basis-full' }"
    class="rounded-lg overflow-hidden"
  >
    <img :src="item" class="w-full aspect-video" draggable="false" alt="Webboard.live">
  </UCarousel>
</template>

