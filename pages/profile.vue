<script lang="ts" setup>
const DeleteAccount = defineAsyncComponent(() => import ('~/components/profile/DeleteAccount.vue'))
const WhatsNew = defineAsyncComponent(() => import ('~/components/profile/WhatsNew.vue'))
const Me = defineAsyncComponent(()=> import ('~/components/profile/Me.vue'))

</script>
<template>
  <div>Hi from acc</div>
</template>
