<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { useWebSocket } from '@vueuse/core'
import { CloudinaryImage } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';
const config = useRuntimeConfig();
const isOpen = ref(false)
const isOpenPost = ref(false)
const isOpenBg = ref(false)
const header = ref("")
const description = ref("")
const bgColor = ref("")
const websocketUrl = ref('')
const history = ref<{ title: string, imgPublicId: string, description: string }[]>([]);

const route = useRoute();
const boardId = route.query.boardId;

if (!boardId || typeof boardId !== 'string') {
  throw new Error('Board ID is required and must be a string');
}
const { data: boardData } = await useFetch(`/api/board?boardId=${boardId}`);

header.value = boardData.value.name
bgColor.value = boardData.value.background
description.value = boardData.value.description
if (typeof window !== 'undefined' && window.location) {
  websocketUrl.value = `/api/websocket?room=${boardId}`
}
const { status, data, send, open, close } = useWebSocket(websocketUrl.value)

watch(data, (newValue) => {
  try {
    const message = JSON.parse(newValue);
    history.value.push({
      title: message.title,
      imgPublicId: message.imgPublicId,
      description: message.description
    });
  } catch (error) {
    console.error('Error parsing WebSocket message:', error);
  }
});

const fetchMessageHistory = async () => {
  try {
    const response = await fetch(`/api/board/post?boardId=${boardId}`);
    const messages = await response.json();
    history.value = messages.map((message: { title: string, imgPublicId:string ,description: string }) => ({
      title: message.title,
      imgPublicId: message.imgPublicId,
      description: message.description
    }));
  } catch (error) {
    console.error('Error fetching message history:', error);
  }
};

const handleGetImage = (publicId : string) => {
  if(publicId  && publicId.length>0){
    const myImage = new CloudinaryImage(publicId, { cloudName: config.public.cloudeName })
    .resize(scale().width(1000))
    .delivery(quality('auto'))
    .delivery(format('auto'));
    return myImage.toURL();
  }
  return '';
}
const handlePost = (message: any) => {
  history.value.push({
    title: message.title,
    imgPublicId: message.imgPublicId,
    description: message.description
  })
  isOpenPost.value=message.isOpenPost
  send(JSON.stringify(message));
}
const handleUpdate = (newName: string) => {
  header.value = newName;
  isOpen.value = false
};
const handleUpdateDesc = (newDesc: string) => {
  description.value = newDesc;
};
const handleUpdateColor = (newColor: string) => {
  bgColor.value = newColor;
};
onMounted(() => {
  fetchMessageHistory();
});
</script>

<template>
  <UButton @click="isOpenPost = true" label="New Post" class="fixed z-50 bottom-2 right-2" />
  <div class="bg-cover" :class="'bg-' + bgColor">
    <h1 @click="isOpen = true" class=" cursor-default ">
      {{ header }}
    </h1>
  
    <div
      class=" mx-2 grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      <UCard v-for="entry in history" :key="entry.title">
        <template #header>
          <div class="flex gap-1">
            <UAvatar src="https://github.com/benjamincanac.png" />
            <p class="font-bold">Sokha Rithy</p>
          </div>
        </template>
        <p>{{ entry.title }}</p>
        <img :src="handleGetImage(entry.imgPublicId)" alt=""/>
        <p>{{ entry.description }}</p>
        <template #footer>
          <div class="flex justify-between">
            <UIcon name="i-heroicons-chat-bubble-bottom-center-text" />
            <UIcon name="i-heroicons-hand-thumb-up" />
          </div>
        </template>
      </UCard>
    </div>
  </div>
  <div>
    <UModal v-model="isOpenPost">
      <BoardPost :board-id="boardId" @post-message="handlePost" />
    </UModal>
    <USlideover v-model="isOpen">
      <UButton class="w-10 h-10" @click="isOpen = false" label="X" />
      <BoardName :board-name="header" :board-id="boardId" @update="handleUpdate" />
      <BoardDescription :board-desc="description" :board-id="boardId" @update="handleUpdateDesc" />
      <UCard class="flex justify-between items-center">
        <template #header>
          <p>Background</p>
        </template>
        <div @click="isOpenBg = true" class="h-20 w-36 " :class="'bg-' + bgColor">
        </div>
      </UCard>
      <USlideover :overlay="false" v-model="isOpenBg">
        <UButton class="w-10 h-10" @click="isOpenBg = false" label="X" />
        <BoardBackground :board-id="boardId" @update="handleUpdateColor" />
      </USlideover>
      <BoardShare :board-id="boardId" />
    </USlideover>
  </div>
</template>