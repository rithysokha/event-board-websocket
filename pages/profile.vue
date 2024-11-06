<script lang="ts" setup>
const DeleteAccount = defineAsyncComponent(() => import ('~/components/profile/DeleteAccount.vue'))
const WhatsNew = defineAsyncComponent(() => import ('~/components/profile/WhatsNew.vue'))
const Me = defineAsyncComponent(()=> import ('~/components/profile/Me.vue'))

const items = ref ([
  {
    key: 'info',
    label: 'Basic info',
    component: Me
  },
  {
    key: 'new',
    label: "What's new",
    component: WhatsNew
  },
  {
    key: 'deleteacc',
    label: 'Delete Account',
    component: DeleteAccount
  }
])

</script>
<template>
  <SideTab :items="items"/>
</template>
