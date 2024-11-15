<script setup lang="ts">
const isOpen = ref(false)
const joinUrl = ref('')
const links = [
  [{
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/dashboard/home'
  },
  {
    label: 'Gallery',
    icon: 'i-heroicons-photo',
    to: '/dashboard/gallery'
  },
  {
    label: 'Join',
    icon: 'i-heroicons-link',
    click: () => isOpen.value=true
  },
  {
    label: 'Make',
    icon: 'i-heroicons-plus-circle',
    to: '/dashboard/make'
  }], [{
    label: 'Profile',
    icon: 'i-heroicons-user-circle',
    to: '/profile'
  }]
]
const handleJoin = () =>{
  console.log("Join clicked")
}
</script>

<template>
  <UHorizontalNavigation :links="links" class="border-b border-gray-200 dark:border-gray-800" />
  <div>
    <UModal v-model="isOpen">
      <div class="p-4">
        <p>Please Enter URL</p>
        <UInput color="primary" variant="outline" v-model="joinUrl" placeholder="Link..." />
        <UButton block @click="handleJoin">Submit</UButton>
      </div>
    </UModal>
  </div>
</template>

