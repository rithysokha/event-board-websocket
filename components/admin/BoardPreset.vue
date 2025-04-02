<script lang="ts" setup>
import imageCompression from 'browser-image-compression';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';
const { data } = useFetch('/api/preset')
const isOpen = ref(false)
const isOpenDelete = ref(false)
const isLoading = ref(true)
const isUploading = ref(false)
const isUploadingPhoto = ref(false)
const presetIdToDelete = ref('')
const isDeleting = ref(false)
const presetName = ref('')
const like = ref(true)
const comment = ref(true)
const imageUrl = ref('')
const previewImage = ref('')
const onImageLoad = () => {
  if (isLoading.value === true) {
    isLoading.value = false;
  }
}

const formats = [
  { name: 'Grid'},
  { name: 'Stream'}
]
const selectedFormat = ref(formats[0])
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
    imageUrl.value = res.public_id;
  } catch (error) {
    console.error('Upload Error:', error);
  } finally {
    isUploadingPhoto.value = false;
  }
};
const handleSavePreset = async () => {
  isUploading.value = true
  if (isUploadingPhoto.value) {
    while (isUploadingPhoto.value) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  savePostToDB()
}
const appendPreset = (id: string, name:string, like:boolean, comment:boolean, format:string, image:string) => {
  data.value.push({
    _id: id,
    name:name,
    like:like,
    comment:comment,
    format:format,
    image:image
  })
}
const removePresetFromArray = (id: string) => {
  const index = data.value.findIndex((avatar: { _id: string; }) => avatar._id === id)
  if (index !== -1) {
    data.value.splice(index, 1)
  }
}
const savePostToDB = async () => {
  try {
    const response = await fetch('api/preset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: presetName.value,
        like: like.value,
        comment: comment.value,
        format: selectedFormat.value.name,
        image: imageUrl.value
      })
    });
    if (response.ok) {
      const res = await response.json()
      appendPreset(res.insertedId, presetName.value, like.value, comment.value, selectedFormat.value.name, imageUrl.value);
    }
    isUploading.value = false
    isOpen.value = false
    presetName.value = ''
    like.value = true
    comment.value = true
    imageUrl.value = ''
    previewImage.value = ''
  } catch (error) {
    console.error('Error creating board:', error);
  }
};
const handleOpenEdit = (id: string) => {

}
const handleDisplayDeletePrompt = (id: string) => {
  presetIdToDelete.value=id;
  isOpenDelete.value=true

}
const handleDeleteTemplate = async () =>{
  const response = await fetch(`api/preset/${presetIdToDelete.value}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if(response.ok){
      removePresetFromArray(presetIdToDelete.value)
      isDeleting.value=false
      isOpenDelete.value=false
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
  <div class="w-full bg-slate-50 shadow-md flex flex-row-reverse">
    <UButton @click="isOpen = true" class="w-20 flex justify-center mr-10" size="md" icon="i-heroicons-plus" />
  </div>
  <UModal v-model="isOpenDelete">
    <div class="p-4 m-4 text-center">
      <p class="text-red-500 font-bold mb-6">
        Are you sure to delete this post?
      </p>
      <div class="flex justify-center gap-4">
        <UButton class="w-1/4 flex justify-center" label="No" @click="isOpenDelete = false" />
        <UButton :loading="isDeleting" class="w-1/4 flex justify-center" color="red" icon="i-heroicons-trash"
          label="Yes!" @click="handleDeleteTemplate" />
      </div>
    </div>
  </UModal>
  <UModal v-model="isOpen">
    <div class="p-4 flex flex-col gap-4 items-end">
      <UButton @click="handleSavePreset" :loading="isUploading" label="Save" />
      <UInput v-model="presetName" class="w-full" placeholder="Preset name" />
      <div class="flex justify-between w-full">
        <p>Like</p>
        <UToggle v-model="like"/>
      </div>
      <div class="w-full flex justify-between">
        <p>Comment</p>
        <UToggle v-model="comment"/>
      </div>
      <div class="w-full flex justify-between">
        <p>Board Format</p>
        <UInputMenu v-model="selectedFormat" :options="formats" option-attribute="name">
          <template #option="{ option: formatOption }">
            <span class="truncate">{{ formatOption.name }}</span>
          </template>
        </UInputMenu>
      </div>
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
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
    <UCard v-for="item in data">
      <img :src="handleGetImage(item.image, '20')" class="rounded-lg" alt="img" @load="onImageLoad" />
      <div class="flex w-full justify-between">
        <p class="w-full text-end sm:text-start">{{ item.name }}</p>
        <UDropdown :items="[
          [
            {
              label: 'Edit',
              icon: 'i-heroicons-pencil-square-20-solid',
              click: () => handleOpenEdit(item._id)
            },
            {
              label: 'Delete',
              icon: 'i-heroicons-trash-20-solid',
              click: () => handleDisplayDeletePrompt(item._id)
            }]
        ]" :ui="{ base: 'outline-none' }" :popper="{ arrow: true }">
          <UButton color="white" trailing-icon="i-heroicons-ellipsis-vertical" variant="ghost" />
        </UDropdown>
      </div>
    </UCard>
  </div>
</template>