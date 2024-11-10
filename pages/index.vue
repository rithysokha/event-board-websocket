<script setup lang="ts">

</script>

<template>
  <UContainer class="flex w-full justify-end gap-1">
    <UButton @Click="navigateTo('/auth/login')">Login</UButton>
    <UButton @Click="navigateTo('/auth/sign_up')">Sign up</UButton>
  </UContainer>
  <UContainer class="w-full flex flex-col items-center ">
    <p class="text-2xl">A virtual board to hype up your event while waiting</p>
    <UButton @Click="navigateTo('/auth/sign_up')">Sign up for free</UButton>
  </UContainer>
  <UContainer>
    <p>We have event board</p>
    <LazyCarousel/>
  </UContainer>
</template>

