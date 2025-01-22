<script setup lang="ts">
const isOpen = ref(false)
const joinUrl = ref('')
const {data} = useAuth()
const desktopLinks = [
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
    label: data.value?.user.name,
    avatar: {
      src: data.value?.user.image
    },
    to: '/profile'
  }]
]
const mobileLinks = [
  [{
    label:'Home',
    icon: 'i-heroicons-home',
    to: '/dashboard/home'
  },
  {
    label:'Gallery',
    icon: 'i-heroicons-photo',
    to: '/dashboard/gallery'
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
    label:data.value?.user.name,
    avatar: {
      src: data.value?.user.image
    },
    to: '/profile'
  }
]
]
const handleJoin = () =>{
  if(joinUrl){
    window.open(joinUrl.value, '_blank');
  }
}
</script>

<template>
    <UHorizontalNavigation :links="$device.isMobile? mobileLinks: desktopLinks" :ui="$device.isMobile?{'icon': {'base': 'w-6 h-6'},'container':'flex gap-6', 'base': 'flex flex-col gap-0 my-0 py-1 text-xs'}:{}" class="border-b border-gray-200 dark:border-gray-800 fixed z-50 bg-white" :class="$device.isMobile?'bottom-0':'top-0'" />
    <div>
      <UModal v-model="isOpen">
        <div class="p-4 flex flex-col gap-2">
          <p>Please Enter URL</p>
          <UInput color="primary" variant="outline" v-model="joinUrl" placeholder="Link..." />
          <UButton block @click="handleJoin">Submit</UButton>
        </div>
      </UModal>
    </div>
</template>

