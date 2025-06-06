<script setup lang="ts">
definePageMeta({
  middleware:['sidebase-auth', 'transition'],
  pageTransition: {}
})
const userStore = useUserStore()
const {data} = useAuth()
const Recent = defineAsyncComponent(() => import('~/components/home/Recent.vue'))
const MadeByMe = defineAsyncComponent(() => import('~/components/home/MadeByMe.vue'))
const Trashed = defineAsyncComponent(() => import('~/components/home/Trashed.vue'))
const items = [
  {
    key: 'recent',
    label: 'Recents',
    component: Recent
  },
  {
    key: 'madeByMe',
    label: 'Mine',
    component: MadeByMe
  },
  {
    key: 'trashed',
    label: 'Trashed',
    component: Trashed
  }
]
const updateUserData = async()=>{
  if(userStore.displayPhoto ==''){
    userStore.setDisplayPhoto(data.value?.user.image??'')
  }
}

onMounted(()=>{
updateUserData()
})
</script>

<template>
  <div>
    <SideTab :items="items" />
  </div>
</template>