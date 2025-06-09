<script setup lang="ts">
definePageMeta({
  middleware: ['sidebase-auth', 'transition'],
  pageTransition: {}
})
const toast = useToast()
const isLoadingBtn = ref(false)
const showImagePicker = ref(false)
const isSavingData = ref(false)
const { signOut, data } = useAuth()
const userStore = useUserStore()
const { handleFileSelect, isUploading, previewImage, uploadeedImageUrl } = useCloudinaryUpload()

const handleSignOut = () => {
  isLoadingBtn.value = true
  signOut({ callbackUrl: '/' })
  toast.add({ title: "You're signed out" })
  isLoadingBtn.value = false
  userStore.clearData()
}

const handleImageUpload = async (event: any) => {
  try {
    const result = await handleFileSelect(event)
    if (!result || !uploadeedImageUrl.value) {
      throw new Error('Upload failed')
    }

  } catch (error) {
    toast.add({ title: 'Something went wrong please report to owner', icon: 'i-heroicons-exclamation-circle', color:'red' })
    console.error('Error updating profile picture:', error)
  }
}

const handleChangeProfile = async () => {
  isSavingData.value = true
  try {
    if (isUploading.value) {
      while (isUploading.value) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
    await $fetch(`/api/user/profile/${data.value?.user.email}`, {
      method: 'PUT',
      body: {
        image: uploadeedImageUrl.value
      }
    })
    userStore.setDisplayPhoto(uploadeedImageUrl.value??'')
    toast.add({ title: 'Profile picture updated', color: 'green' })
  } catch (error) {
    toast.add({ title: 'Something went wrong please report to owner', icon: 'i-heroicons-exclamation-circle', color:'red' })
    console.log(error)
  }finally{
    showImagePicker.value = false
    isSavingData.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-2 mt-14">
    <!-- Profile picture with edit overlay -->
    <div class="relative group">
      <UAvatar :src="userStore.displayPhoto" size="3xl" />

      <!-- Edit overlay -->
      <div
        class="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all cursor-pointer"
        @click="showImagePicker = true">
        <UIcon name="i-heroicons-camera" class="text-white opacity-0 group-hover:opacity-100 transition-opacity"
          size="lg" />
      </div>
    </div>
    <p class="font-bold"> {{ data?.user.name }} </p>
    <p>{{ data?.user.email }} </p>

    <UButton class="mt-14" color="red" @click="handleSignOut" :loading="isLoadingBtn">
      Signout
    </UButton>

    <UModal v-model="showImagePicker" :ui="{width:'w-72'}">
      <div class="p-4 flex flex-col items-center align-middle">
        <div class=" w-full flex justify-between gap-2">
          <h3 class="text-lg font-medium mb-4">Update Profile Picture</h3>
          <UButton :loading="isSavingData" label="OK" @click="handleChangeProfile" />
        </div>
        <div
          class="aspect-square w-40 h-40 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center cursor-pointer overflow-hidden relative">
          <img v-if="previewImage" :src="previewImage" alt="Preview" class="w-full h-full object-cover" />
          <label v-else class="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
            <span>Select a Photo</span>
            <input type="file" class="hidden" @change="handleImageUpload" accept="image/*" />
          </label>
        </div>
      </div>
    </UModal>
  </div>
</template>