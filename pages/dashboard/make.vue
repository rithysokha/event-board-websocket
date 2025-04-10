<script lang="ts" setup>
definePageMeta({
  middleware:'sidebase-auth'
})
</script>
<template>
  <div class="w-screen flex flex-col items-center" :class="!$device.isMobile && 'mt-10'">
    <div class="w-[96%]">
      <MakeOptionList />
      <MakeRecipeList class="mt-5"/>
    </div>
  </div>
</template>


