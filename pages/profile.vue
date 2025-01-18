<script lang="ts" setup>
const DeleteAccount = defineAsyncComponent(() => import ('~/components/profile/DeleteAccount.vue'))
const WhatsNew = defineAsyncComponent(() => import ('~/components/profile/WhatsNew.vue'))
const Me = defineAsyncComponent(()=> import ('~/components/profile/Me.vue'))
definePageMeta({
  middleware: 'sidebase-auth'
})
const { data } = useAuth()
</script>
<template>
  <div>Hello bro {{ data?.user.name }}</div>
</template>
