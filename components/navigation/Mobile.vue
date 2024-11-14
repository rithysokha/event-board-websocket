<script setup lang="ts">
import { Icon } from '#build/components';

const isOpen = ref(false)
const joinUrl = ref('')
const links = [
  [{
    label:'',
    icon: 'i-heroicons-home',
    to: '/dashboard/home'
  },
  {
    label:'',
    icon: 'i-heroicons-photo',
    to: '/dashboard/make'
  },
  {
    label:'',
    icon: 'i-heroicons-plus-circle',
    to: '/dashboard/make'
  },
  {
    label:'',
    icon: 'i-heroicons-link',
    click: () => isOpen.value=true
  },
  {
    label:'',
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
  <UHorizontalNavigation :links="links" :ui="{'icon': {'base': 'w-6 h-6 mx-4'}}" class="flex justify-center border-b border-gray-200 dark:border-gray-800" />
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

