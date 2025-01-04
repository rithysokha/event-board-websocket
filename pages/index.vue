<script setup lang="ts">
import lottie from 'lottie-web'
import globe from "../assets/user_research.json"

const animationContainer = ref<HTMLElement | null>(null)
onMounted(() => {
  if (animationContainer.value) {
    lottie.loadAnimation({
      container: animationContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: globe
    })
  }
})
</script>

<template>
  <div class="flex flex-col w-screen gap-2 mt-2">
  <UContainer class="flex w-full justify-end gap-2">
    <UButton @Click="navigateTo('/auth/login')">Login</UButton>
    <UButton @Click="navigateTo('/auth/sign_up')">Sign up</UButton>
  </UContainer>
  <UContainer class="w-full flex flex-col items-center gap-2">
    <p class="text-2xl">A virtual board to hype up your event while waiting</p>
    <div class="w-full" ref="animationContainer"></div>
    <UButton @Click="navigateTo('/auth/sign_up')">Sign up for free</UButton>
  </UContainer>
  <UContainer class="flex flex-col items-center gap-2">
    <p>We have event board</p>
    <Carousel/>
    <UButton>Make a board</UButton>
  </UContainer>
    <Accordion/>
    <Footer/>
  </div>
</template>

