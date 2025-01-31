<script lang="ts" setup>
defineProps<{
  boardId: string,
  reaction: boolean,
  comment: boolean
}>();
import { useWebSocket } from '@vueuse/core'
import { CloudinaryImage } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';

const isDeleting = ref(false)
const isOpenPost = ref(false)
const websocketUrl = ref('')
const history = ref<{ title: string, imgPublicId: string, description: string, imgHeigh:number, imgWidth:number, id:string }[]>([]);
const route = useRoute();
const boardId = route.query.boardId;

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
      imgWidth: message.imgWidth,
      id:message.id
    });
  } catch (error) {
    console.error('Error parsing WebSocket message:', error);
  }
});

const fetchMessageHistory = async () => {
  try {
    const response = await fetch(`/api/board/post?boardId=${boardId}`);
    const messages = await response.json();
    history.value = messages.map((message: { title: string, imgPublicId:string ,description: string, imgHeigh:number, imgWidth:number, _id:string }) => ({
      title: message.title,
      imgPublicId: message.imgPublicId,
      description: message.description,
      imgHeigh: message.imgHeigh,
      imgWidth: message.imgWidth,
      id:message._id
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

const handleDeletePost = async (postId: string)=>{
  try{
    isDeleting.value=true
   const res = await $fetch(`/api/board/post/${postId}`, {
      method:'delete'
    })
    if(res?.statusCode==200){
      const index = history.value.findIndex(post => post.id === postId)
      if (index !== -1) {
        history.value.splice(index, 1)
      }
    }
    isDeleting.value=false
  }catch(e){
    console.log(e)
    isDeleting.value=false
  }
}

const handlePost = (message: any) => {
  history.value.push({
    title: message.title,
    imgPublicId: message.imgPublicId,
    description: message.description,
    imgHeigh: message.imgHeigh,
    imgWidth: message.imgWidth,
    id:message.id
  })
  isOpenPost.value=message.isOpenPost
  send(JSON.stringify(message));
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
  <UModal v-model="isOpenPost">
    <BoardPost :board-id="boardId" @post-message="handlePost" />
  </UModal>
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
                label: 'Delete',
                icon: 'i-heroicons-trash-20-solid',
                click: () => handleDeletePost(entry.id)
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
              v-if="reaction"
              @click="handleLike"
              icon="i-heroicons-heart"
              variant="ghost"
            />
            <UButton
              v-if="comment"
              @click="handlePostComment"
              icon="i-heroicons-chat-bubble-bottom-center-text"
              variant="ghost"
            />
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

