<script lang="ts" setup>
import imageCompression from 'browser-image-compression';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';
const {data} = await useFetch("/api/avatar")
const isOpen = ref(false)
const isUploading = ref(false)
const avatarBody = ref({
  name: '',
  url: ''
})
const previewImage = ref<string | null>(null);
const isUploadingPhoto = ref(false)
const columns = [
    { key: 'avatar', label: 'Avatar' },
    { key: 'name', label: 'Name' }
]
// @ts-expect-error
const items = row => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square',
    class: 'transition-colors duration-200',
    click: () => console.log('Edit', row.id)
  }], [{
    label: 'block',
    icon: 'i-heroicons-no-symbol',
    class: 'transition-colors duration-100'
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash',
    class: 'hover:text-white : hover:bg-red-500 transition-colors duration-200'
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

const handleSaveAvatar = async ()=>{
  isUploading.value=true
  if (isUploadingPhoto.value) {
    while (isUploadingPhoto.value) {
      await new Promise((resolve) => setTimeout(resolve, 100)); 
    }
  }
 savePostToDB()
}

const savePostToDB = async () => {
  try {
    await fetch('api/avatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(avatarBody.value)
    });
    isUploading.value =false
    isOpen.value=false
    avatarBody.value.name =''
    avatarBody.value.url=''
    previewImage.value=''
  } catch (error) {
    console.error('Error creating board:', error);
  }
};

const handleEditAvatar = async(id:string) =>({

})
const handleDeleteAvatar = async (id:string) => {
  
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

    <div class="w-full bg-slate-50 shadow-md flex flex-row-reverse">
      <UButton @click="isOpen = true" class="w-20 flex justify-center mr-10" size="md" icon="i-heroicons-plus" />
    </div>
    <UModal v-model="isOpen">
    <div class="p-4 flex flex-col gap-4 items-end">
      <UButton @click="handleSaveAvatar" :loading="isUploading" label="Save"/>
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
        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
      </UDropdown>
    </template>
  </UTable>
</ClientOnly>
</template>