<script lang="ts" setup>
definePageMeta({
  middleware:['sidebase-auth', 'transition'],
  pageTransition: {}
})
</script>
<template>
 <MakeRecipeList :class="!$device.isMobile && 'mt-10'"/>
</template>
