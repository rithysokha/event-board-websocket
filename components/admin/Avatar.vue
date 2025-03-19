<script lang="ts" setup>
import imageCompression from 'browser-image-compression';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';
const { data } = await useFetch("/api/avatar")
const isOpen = ref(false)
const isUploading = ref(false)
const isOpenDelete = ref(false)
const isDeleting = ref(false)
const avatarBody = ref({
  name: '',
  url: ''
})
const avatarIdToDelete = ref('')
const previewImage = ref<string | null>(null);
const isUploadingPhoto = ref(false)
const columns = [
  { key: 'avatar', label: 'Avatar' },
  { key: 'name', label: 'Name' },
  { key: 'actions', label: 'Action', class: 'w-24' }
]
// @ts-expect-error
const items = row => [
 [{
    label: 'Delete',
    icon: 'i-heroicons-trash',
    click: () => handleDisplayDeletePrompt(row._id)
  }]
]
const handleUploadFile = async (event: any) => {
  const files = event.target.files;
  if (!files || files.length === 0) {
    console.error('No file selected');
    return;
  }
  isUploadingPhoto.value = true;
  const file = files[0];
  const reader = new FileReader();

  reader.onload = () => {
    previewImage.value = reader.result as string;
  };
  reader.readAsDataURL(file);

  if (file.size > 1048576) {
    // Compression options
    const options = {
      maxSizeMB: 1,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      await uploadFile(compressedFile);
    } catch (error) {
      console.error('Compression Error:', error);
      isUploadingPhoto.value = false;
      return;
    }
  } else {
    await uploadFile(file);
  }
};

const handleDisplayDeletePrompt = (id: string) => {
  isOpenDelete.value = true
  avatarIdToDelete.value = id
}

const removeAvatarFromArray = (id: string) => {
  const index = data.value.findIndex((avatar: { _id: string; }) => avatar._id === id)
  if (index !== -1) {
    data.value.splice(index, 1)
  }
}

const appendAvatar = (id: string, url: string, name: string) => {
  data.value.push({
    _id: id,
    url: url,
    name: name
  })
}

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await $fetch<{ public_id: string, height: number, width: number }>('/api/image', {
      method: 'POST',
      body: formData,
    });
    avatarBody.value.url = res.public_id;
  } catch (error) {
    console.error('Upload Error:', error);
  } finally {
    isUploadingPhoto.value = false;
  }
};

const handleSaveAvatar = async () => {
  isUploading.value = true
  if (isUploadingPhoto.value) {
    while (isUploadingPhoto.value) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  savePostToDB()
}

const savePostToDB = async () => {
  try {
    const response = await fetch('api/avatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(avatarBody.value)
    });
    if (response.ok) {
      const res = await response.json()
      appendAvatar(res.insertedId, avatarBody.value.url, avatarBody.value.name);
    }
    isUploading.value = false
    isOpen.value = false
    avatarBody.value.name = ''
    avatarBody.value.url = ''
    previewImage.value = ''
  } catch (error) {
    console.error('Error creating board:', error);
  }
};

const handleDeleteAvatar = async () => {
  try {
    isDeleting.value = true
    const res = await fetch(`/api/avatar/${avatarIdToDelete.value}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (res.ok) removeAvatarFromArray(avatarIdToDelete.value)
    isOpenDelete.value = false
    isDeleting.value = false
  } catch (error) {
    console.log(error);
  }
}

const handleGetImage = (publicId: string, qual: string) => {
  if (publicId && publicId.length > 0) {
    const myImage = new CloudinaryImage(publicId, { cloudName: "dbiso7uht" })
      .resize(scale().width(1000))
      .delivery(quality(qual))
      .delivery(format('auto'));
    return myImage.toURL();
  }
  return '';
}
</script>
<template>
  <ClientOnly>

    <UModal v-model="isOpenDelete" @update:modelValue="$emit('update:isOpenDeletePost', $event)">
      <div class="p-4 m-4 text-center">
        <p class="text-red-500 font-bold mb-6">
          Are you sure to delete this avatar?
        </p>
        <div class="flex justify-center gap-4">
          <UButton class="w-1/4 flex justify-center" label="No" @click="isOpenDelete = false" />
          <UButton :loading="isDeleting" class="w-1/4 flex justify-center" color="red" icon="i-heroicons-trash"
            label="Yes!" @click="handleDeleteAvatar" />
        </div>
      </div>
    </UModal>

    <div class="w-full bg-slate-50 shadow-md flex flex-row-reverse">
      <UButton @click="isOpen = true" class="w-20 flex justify-center mr-10" size="md" icon="i-heroicons-plus" />
    </div>
    <UModal v-model="isOpen">
      <div class="p-4 flex flex-col gap-4 items-end">
        <UButton @click="handleSaveAvatar" :loading="isUploading" label="Save" />
        <UInput v-model="avatarBody.name" class="w-full" placeholder="Avatar name" />
        <div
          class="w-full aspect-square min-h-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer overflow-hidden relative">
          <img v-if="previewImage" :src="previewImage" alt="Preview" class="w-full h-full object-cover" />
          <label v-else class="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
            <span>Select an avatar</span>
            <input type="file" class="hidden" @change="handleUploadFile" accept="image/*" />
          </label>
        </div>
      </div>
    </UModal>

    <UTable :rows="data" :columns="columns"
      :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }">
      <template #avatar-data="{ row }">
        <UAvatar :src="handleGetImage(row.url, '50')" :alt="row.name" size="md" />
      </template>

      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton color="gray" variant="ghost" class="hover:text-blue-500 transition-colors duration-200"
            icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
    </UTable>
  </ClientOnly>
</template>