<script setup>
import { onMounted, ref } from 'vue'
import lottie from 'lottie-web'

const props = defineProps({
  animationData: {
    type: Object,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 40
  }
})

const animationContainer = ref(null)

onMounted(() => {
  if (animationContainer.value) {
    lottie.loadAnimation({
      container: animationContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: props.animationData
    })
  }
})
</script>

<template>
  <div class="flex items-center gap-2">
    <div :style="{width: `${size}px`, height: `${size}px`}" ref="animationContainer"></div>
    <span>{{ message }}</span>
  </div>
</template>