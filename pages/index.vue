<script setup lang="ts">
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/dashboard/home'
  },
  middleware: 'transition',
  pageTransition: {}
})
import lottie from 'lottie-web'
import art from "../assets/user_research.json"
const isLoading = ref(true)

const animationContainer = ref<HTMLElement | null>(null)
onMounted(() => {
  if (animationContainer.value) {
    const animation = lottie.loadAnimation({
      container: animationContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: art
    })
    animation.addEventListener('DOMLoaded', () => {
      isLoading.value = false
    })
  }
})
</script>

<template>
  <div class="flex flex-col w-screen gap-2 mt-3 sm:items-center">
    <UContainer class="flex w-full justify-end gap-2">
      <UButton @Click="navigateTo('/auth')">Login or Sign up</UButton>
    </UContainer>
    <UContainer class="w-full pt-10 flex flex-col items-center gap-2">
      <p class="text-2xl text-primary text-center font-bold">A virtual board to hype up your event up while waiting!</p>
      <USkeleton v-show="isLoading" class="min-h-[50vh] md:min-h-[79vh] w-full" />
      <div class="w-full" ref="animationContainer"></div>
      <UButton @Click="navigateTo('/auth')">Sign up for free</UButton>
    </UContainer>
    <UContainer class="flex flex-col items-center gap-2 sm:gap-3">
      <p class="font-bold">We have event board</p>
      <Carousel />
      <UButton @Click="navigateTo('/auth')">Make a board</UButton>
    </UContainer>
    <Accordion />
    <Footer />
  </div>
</template>