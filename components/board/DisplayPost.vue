<script lang="ts" setup>
defineProps<{
  boardId: string
  reaction: boolean
  comment: boolean
}>();
import { useWebSocket } from '@vueuse/core'
import { CloudinaryImage } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';

const isDeleting = ref(false)
const isOpenPost = ref(false)
const websocketUrl = ref('')
const history = ref<{ title: string, imgPublicId: string, description: string, imgHeigh:number, imgWidth:number, id:string, postedBy:string, likes:number }[]>([]);
const route = useRoute();
const boardId = route.query.boardId as string;
const isOpenDeletePost = ref(false)
const postIdToDelete = ref("")
const toast = useToast()
const reactionStore = useReactionStore()

if (typeof window !== 'undefined' && window.location) {
  websocketUrl.value = `/api/websocket?room=${boardId}`
}
const {  data, send } = useWebSocket(websocketUrl.value)

watch(data, (newValue) => {
  try {
    const message = JSON.parse(newValue);
    if(message.type=='post'){
      history.value.push({
        title: message.title,
        imgPublicId: message.imgPublicId,
        description: message.description,
        imgHeigh: message.imgHeigh,
        imgWidth: message.imgWidth,
        id:message.id,
        postedBy:message.postedBy,
        likes:0
      });
    }else if(message.type =='put'){
      editPost(message.postId, "likes", message.likes)
    }
    else{
      removePostFromHistory(message.postId);
    }
  } catch (error) {
    console.error('Error parsing WebSocket message:', error);
  }
});

const fetchMessageHistory = async () => {
  try {
    const response = await fetch(`/api/board/post?boardId=${boardId}`);
    const messages = await response.json();
    history.value = messages.map((message: { title: string, imgPublicId:string ,description: string, imgHeigh:number, imgWidth:number, _id:string, postedBy:string, likes:number }) => ({
      title: message.title,
      imgPublicId: message.imgPublicId,
      description: message.description,
      imgHeigh: message.imgHeigh,
      imgWidth: message.imgWidth,
      id:message._id,
      postedBy: message.postedBy,
      likes:message.likes
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

const removePostFromHistory =(postId: string) =>{
  const index = history.value.findIndex(post => post.id === postId )
      if (index !== -1) {
        history.value.splice(index, 1)
      }
}

const editPost = (postId: string, field: string, value: any) => {
  const index = history.value.findIndex(post => post.id === postId)
  if (index !== -1) {
    (history.value[index] as any)[field] = value
  }
}

const handleDeletePost = async ()=>{
  try{
    isDeleting.value=true
    const res = await $fetch(`/api/board/post/${postIdToDelete.value}`, {
      method:'delete'
    })
    if(res?.statusCode==200){
    removePostFromHistory(postIdToDelete.value)
    }
    send(JSON.stringify({type:'delete', postId: postIdToDelete.value}))
    isDeleting.value=false
    isOpenDeletePost.value=false
  }catch(e){
    console.log(e)
    isDeleting.value=false
  }
  toast.add({title: 'Post deleted', icon:'i-heroicons-trash'})
}

const handleDisplayDeletePrompt = (postId:string) =>{
  postIdToDelete.value=postId
  isOpenDeletePost.value = true
}
const handlePost = (message: any) => {
  history.value.push({
    title: message.title,
    imgPublicId: message.imgPublicId,
    description: message.description,
    imgHeigh: message.imageHeigh,
    imgWidth: message.imageWidth,
    id:message.id,
    postedBy:message.postedBy,
    likes:0
  })
  isOpenPost.value=message.isOpenPost
  message.type = 'post'
  send(JSON.stringify(message));
}
const handleLike = (postId:string, currentLikes:number)=>{
  if (reactionStore.hasReacted(postId)) {
    send(JSON.stringify({ type: 'put', postId, likes: currentLikes - 1 }))
    editPost(postId, 'likes', currentLikes - 1)
    reactionStore.removeReaction(postId)
  } else {
    send(JSON.stringify({ type: 'put', postId, likes: currentLikes + 1 }))
    editPost(postId, 'likes', currentLikes + 1)
    reactionStore.addReaction(postId)
  }
}

const handlePostComment = ()=>{

}

onMounted(() => {
  fetchMessageHistory();
});
</script>
<template>
  <UButton @click="isOpenPost = true" size="xl" icon="i-heroicons-plus" class="fixed z-50 bottom-2 right-2 rounded-full hover:rotate-90 ease-in-out duration-300 " />
  <UModal v-model="isOpenDeletePost">
    <div class="p-4 m-4 text-center">
      <p class="text-red-500 font-bold mb-6">
        Are you sure to delete this post?
      </p>
      <div class="flex justify-center gap-4">
        <UButton class="w-1/4 flex justify-center"  label="No" @click="isOpenDeletePost=false"/>
        <UButton :loading="isDeleting" class="w-1/4 flex justify-center" color="red" icon="i-heroicons-trash" label="Yes!" @click="handleDeletePost"/>
      </div>
    </div>
  </UModal>
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
              <p class="font-bold"> {{entry.postedBy}}</p>
            </div>
            <UDropdown  :items="[
              [{
                label: 'Delete',
                icon: 'i-heroicons-trash-20-solid',
                click: () => handleDisplayDeletePrompt(entry.id)
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
            <div class="flex items-center">
              <UButton
              v-if="reaction"
              @click="handleLike(entry.id, entry.likes)"
              icon="i-heroicons-heart"
              variant="ghost"
              />
              <p>{{ entry.likes }}</p>
            </div>
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