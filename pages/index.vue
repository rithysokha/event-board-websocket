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
  <UContainer class="flex flex-col items-center">
    <p>We have event board</p>
    <LazyCarousel/>
    <UButton>Make a board</UButton>
  </UContainer>
    <UAccordion
      color="primary"
      variant="soft"
      size="sm"
      :items="[{ label: '1. What is Nuxt UI?', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' }, { label: '2. Getting Started', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' }, { label: '3. Theming', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' }, { label: '4. Components', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' }]"
    />

    <div class="w-screen h-20">
      footer
    </div>
</template>

