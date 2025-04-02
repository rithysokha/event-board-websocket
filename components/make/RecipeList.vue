<script lang="ts" setup>
import { CloudinaryImage } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';
const {data: presetData} = useFetch('/api/preset')
const {data:authData} = useAuth()
const isLoading = ref(true)
const backgroundList =[
  "blue-400",
  "teal-300",
  "fuchsia-400"
]
const randomIndex = Math.floor(Math.random()*backgroundList.length)
const createBoard = async () => {
  try {
    const response = await fetch('/api/board', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "Untitled board",
        belongsTo: authData.value?.user.email,
        background: backgroundList[randomIndex],
        comment:presetData.value.comment,
        reaction:presetData.value.like,
        format:presetData.value.format
      })
    });
    const data = await response.json();
    await navigateTo(`/board?boardId=${data.insertedId}`)
  } catch (error) {
    console.error('Error creating board:', error);
  }
};
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
const onImageLoad = () => {
  if (isLoading.value === true) {
    isLoading.value = false;
  }
}
</script>
<template>
  <div class="grid grid-cols-2  m-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
    <UCard v-for="item in presetData" @click="createBoard">
      <img :src="handleGetImage(item.image, '50')" class="rounded-lg" alt="img" @load="onImageLoad"/>
      <p> {{ item.name }} </p>
    </UCard>
</div>
</template>