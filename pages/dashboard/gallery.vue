<script lang="ts" setup>
definePageMeta({
  middleware:'sidebase-auth'
})
</script>
<template>
 <MakeRecipeList :class="!$device.isMobile && 'mt-10'"/>
</template>
