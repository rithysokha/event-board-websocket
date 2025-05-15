<script lang="ts" setup>
import { CloudinaryImage } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';
const { data: authData } = useAuth()
const isFetching = ref(true)
const preset = ref<{ name: string, image: string, id: string, comment: boolean, like: boolean, format: string }[]>([]);
const imageLoaded = ref<{ [key: string]: boolean }>({});
const backgroundList = [
  "blue-400",
  "teal-300",
  "fuchsia-400"
]
const randomIndex = Math.floor(Math.random() * backgroundList.length)

const fetchPreset = async () => {
  try {
    const response = await fetch('/api/preset');
    const presetJson = await response.json();
    preset.value = presetJson.map((preset: { name: string, image: string, like: boolean, comment: boolean, format: string, _id: string }) => ({
      name: preset.name,
      image: preset.image,
      id: preset._id,
      comment: preset.comment,
      like: preset.like,
      format: preset.format
    }));
    isFetching.value = false
  } catch (error) {
    isFetching.value = false
    console.error('Error fetching message history:', error);
  }
};

const createBoard = async (comment: boolean, like: boolean, format: string) => {
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
        comment: comment,
        reaction: like,
        format: format
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
const skeletonCount = [1,2,3,4,5,6]
onBeforeMount(() => {
  fetchPreset()
})
</script>
<template>
  <div v-if="isFetching" class="grid grid-cols-2  m-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
    <UCard v-for="item in skeletonCount">
      <USkeleton class="w-full rounded-md" :style="{
        paddingBottom: `${56.25}%`
      }" />
      <USkeleton class="h-4 w-20 mt-2"/>
    </UCard>
  </div>
  <div v-else class="grid grid-cols-2  m-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
    <UCard v-for="item in preset" @click="createBoard(item.comment, item.like, item.format)" class="cursor-pointer">
      <USkeleton class="w-full rounded-md" :class="{ 'hidden': imageLoaded[item.id] }" :style="{
        paddingBottom: `${56.25}%`
      }" />
      <img loading="lazy" class="rounded-md w-full object-contain" :class="{ 'opacity-0': !imageLoaded[item.id] }"
        :src="handleGetImage(item.image, '50')" alt="Webboard.live" @load="imageLoaded[item.id] = true" />
      <p> {{ item.name }} </p>
    </UCard>
  </div>
</template>