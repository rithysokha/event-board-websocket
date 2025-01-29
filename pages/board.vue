<script lang="ts" setup>
import { useWebSocket } from '@vueuse/core'
import { CloudinaryImage } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';
definePageMeta({
  ssr: false,
  auth:false
});
const {data:authData} = useAuth()
const isOpenSlide = ref(false)
const isOpenPost = ref(false)
const isOpenBg = ref(false)
const isOpenQr = ref(false)
const header = ref("")
const description = ref("")
const bgColor = ref("")
const websocketUrl = ref('')
const history = ref<{ title: string, imgPublicId: string, description: string, imgHeigh:number, imgWidth:number }[]>([]);

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
const {  data, send } = useWebSocket(websocketUrl.value)

watch(data, (newValue) => {
  try {
    const message = JSON.parse(newValue);
    history.value.push({
      title: message.title,
      imgPublicId: message.imgPublicId,
      description: message.description,
      imgHeigh: message.imgHeigh,
      imgWidth: message.imgWidth
    });
  } catch (error) {
    console.error('Error parsing WebSocket message:', error);
  }
});

const fetchMessageHistory = async () => {
  try {
    const response = await fetch(`/api/board/post?boardId=${boardId}`);
    const messages = await response.json();
    history.value = messages.map((message: { title: string, imgPublicId:string ,description: string, imgHeigh:number, imgWidth:number }) => ({
      title: message.title,
      imgPublicId: message.imgPublicId,
      description: message.description,
      imgHeigh: message.imgHeigh,
      imgWidth: message.imgWidth
    }));
  } catch (error) {
    console.error('Error fetching message history:', error);
  }
};

const handleGetImage = (publicId : string, qual: string) => {
  if(publicId  && publicId.length>0){
    const myImage = new CloudinaryImage(publicId, { cloudName: "dbiso7uht" })
    .resize(scale().width(1000))
    .delivery(quality(qual))
    .delivery(format('auto'));
    return myImage.toURL();
  }
  return '';
}
const handlePost = (message: any) => {
  history.value.push({
    title: message.title,
    imgPublicId: message.imgPublicId,
    description: message.description,
    imgHeigh: message.imgHeigh,
    imgWidth: message.imgWidth
  })
  isOpenPost.value=message.isOpenPost
  send(JSON.stringify(message));
}

const handleOpenSlide = ()=>{
  if(authData.value?.user.email==boardData.value.belongsTo){
    isOpenSlide.value=true
  }
}

const handleUpdate = (newName: string) => {
  header.value = newName;
  isOpenSlide.value = false
};
const handleUpdateDesc = (newDesc: string) => {
  description.value = newDesc;
};
const handleUpdateColor = (newColor: string) => {
  bgColor.value = newColor;
};
const hanldeOpenQr = (isOpen: boolean)=>{
  isOpenSlide.value=false
  isOpenQr.value=isOpen;
}

const handleLike = ()=>({
})

const handlePostComment = ()=>{

}
onMounted(() => {
  fetchMessageHistory();
});
</script>

<template>
  <UButton @click="isOpenPost = true" size="xl" icon="i-heroicons-plus" class="fixed z-50 bottom-2 right-2 rounded-full hover:rotate-90 ease-in-out duration-300 " />
  <UModal v-model="isOpenQr">
    <QrCode :board-id="boardId" :width="$device.isMobile?200:500" :height="$device.isMobile?200:500"/>
  </UModal>
  <div class="bg-cover min-h-screen" :class="'bg-' + bgColor">
    <h1 @click="handleOpenSlide" class=" cursor-pointer text-2xl mb-4 ">
      {{ header }}
    </h1>

<!-- Display post -->
  <div class="columns-1 sm:columns-2 md:columns-3 lg:columns-4 space-y-4 mx-1">
    <div
      v-for="entry in history"
      :key="entry.title"
      class="mb-4 break-inside-avoid-column"
    >
      <UCard class="flex flex-col justify-between">
        <template #header>
          <div class="flex gap-1 h-5 justify-between">
            <div class="flex gap-1">
              <UAvatar src="https://github.com/benjamincanac.png" />
              <p class="font-bold">Sokha Rithy</p>
            </div>
            <UDropdown  :items="[
              [{
                label: 'Delete(not finish)',
                icon: 'i-heroicons-trash-20-solid'
              }]
            ]" :ui="{base:'outline-none'}" :popper="{ arrow:true }">
              <UButton color="white" trailing-icon="i-heroicons-ellipsis-vertical" variant="ghost"/>
            </UDropdown>
          </div>
        </template>
        <p :class="entry.imgPublicId === '' ? 'text-3xl' : 'text-md'">
          {{ entry.title }}
        </p>
        <div
          v-if="entry.imgPublicId !== ''"
          class="bg-no-repeat bg-center bg-cover w-full"
          :style="{
            backgroundImage: 'url(' + handleGetImage(entry.imgPublicId, '1') + ')',
            aspectRatio: entry.imgWidth + '/' + entry.imgHeigh
          }"
        >
          <img
            loading="lazy"
            class="rounded-md"
            :src="handleGetImage(entry.imgPublicId, '80')"
            alt=""
          />
        </div>
        <p>{{ entry.description }}</p>
        <template #footer>
          <div class="flex justify-between">
            <UButton
              v-if="boardData.reaction"
              @click="handleLike"
              icon="i-heroicons-heart"
              variant="ghost"
            />
            <UButton
              v-if="boardData.comment"
              @click="handlePostComment"
              icon="i-heroicons-chat-bubble-bottom-center-text"
              variant="ghost"
            />
          </div>
        </template>
      </UCard>
    </div>
  </div>

  </div>
  <div>
    <UModal v-model="isOpenPost">
      <BoardPost :board-id="boardId" @post-message="handlePost" />
    </UModal>
    <USlideover v-model="isOpenSlide">
      <UButton class="w-10 h-10" @click="isOpenSlide = false" label="X" />
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
      <BoardShare :board-id="boardId" @update="hanldeOpenQr"/>
    </USlideover>
  </div>
</template>