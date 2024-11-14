<script setup lang="ts">

const isOpen = ref(false)
const joinUrl = ref('')
const links = [
  [{
    label:'Home',
    icon: 'i-heroicons-home',
    to: '/dashboard/home'
  },
  {
    label:'Gallery',
    icon: 'i-heroicons-photo',
    to: '/dashboard/make'
  },
  {
    label:'Make',
    icon: 'i-heroicons-plus-circle',
    to: '/dashboard/make'
  },
  {
    label:'Join',
    icon: 'i-heroicons-link',
    click: () => isOpen.value=true
  },
  {
    label:'Profile',
    icon: 'i-heroicons-user-circle',
    to: '/profile'
  }
]
]
const handleJoin = () =>{
  console.log("Join clicked")
}
</script>

<template>
  <UHorizontalNavigation :links="links" :ui="{'icon': {'base': 'w-6 h-6'},'container':'flex gap-6', 'base': 'flex flex-col gap-0 my-0 py-1 text-xs'}" class="flex justify-center border-b border-gray-200 dark:border-gray-800" />
  <div>
    <UModal v-model="isOpen">
      <div class="p-4">
        <p>Please Enter URL</p>
        <UInput color="primary" variant="outline" v-model="joinUrl" placeholder="Link..." />
        <div class="flex gap-3">
          <UButton @click="isOpen = false">Cancel</UButton>
          <UButton @click="handleJoin">Submit</UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

