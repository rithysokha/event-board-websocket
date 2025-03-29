<script lang="ts" setup>
import { CloudinaryImage } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';
definePageMeta({
  ssr: false,
  auth: false
});
const { data: authData, status: authStatus } = useAuth()
const isOpenSlide = ref(false)
const isOpenBg = ref(false)
const header = ref("")
const description = ref("")
const bgColor = ref("")
const boardState = useBoardStateStore()
const userStore = useUserStore()
const userDisplayName = ref("")
const formats = [
  { name: 'Wall'},
  { name: 'Stream'}
]
const selectedFormat = ref(formats[0])
const route = useRoute();
const boardId = route.query.boardId;
const { socket, isConnected, connect, sendMessage, data } = useWebSocket()

if (!boardId || typeof boardId !== 'string') {
  throw new Error('Board ID is required and must be a string');
}
const { data: boardData }: any = await useFetch(`/api/board?boardId=${boardId}`);

header.value = boardData.value.name
bgColor.value = boardData.value.background
description.value = boardData.value.description

const handleOpenSlide = () => {
  if (authData.value?.user.email == boardData.value.belongsTo) {
    isOpenSlide.value = true
  }
}
watch(data, (newValue) => {
  try {
    const message = JSON.parse(newValue);
    if (message.on == 'board') {
      liveUpdateBoard(message.field, message.value)
    }
  } catch (error) {
    console.error('Error parsing WebSocket message:', error);
  }
});

const handleChangeFormat = () => {
  editBoard(boardId, 'format', selectedFormat.value.name )
}

const hadleToggleLike = () => {
 editBoard(boardId, 'reaction', boardState.likeable)
}

const handleToggleComment = () => {
editBoard(boardId, 'comment', boardState.commentable)
}

const liveUpdateBoard = async ( field: string, value: any) => {
  if (boardData.value) {
    boardData.value[field] = value;
  }
}

const editBoard = async (boardId: string, field: string, value: string | boolean) => {
  try{
    await useFetch(`/api/board/${boardId}`, {
      //@ts-expect-error
      method: 'PUT',
      body: JSON.stringify({ [field]:value})
    })
    liveUpdateBoard(field, value)
     sendMessage({ on:'board',type: 'put',field:field,value: value})
  }catch(error){
    console.log(error)
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
const hanldeOpenQr = (isOpen: boolean) => {
  isOpenSlide.value = false
  boardState.setIsOpenQr(isOpen)
}
const handleSetDisplayName = () => {
  userStore.setDisplayName(userDisplayName.value)
  boardState.setISOpenInputName(false)
}
const { data: avatarData } = await useFetch("/api/avatar")
const handlePostRecentBoard = async (userId:string, boardId:string)=>{
try{
  await $fetch('/api/recent',{
    method: 'POST',
    body: JSON.stringify({userId:userId, boardId:boardId, name:header.value, background:boardData.value.background})
  })
}catch(error){
  console.log(error)
}
}
onMounted(() => {

  connect(`/api/websocket?room=${boardId}`)
  if (userStore.uuid == '') {
    userStore.setUuid(authStatus.value == 'authenticated' ? authData.value?.user.email ?? crypto.randomUUID() : crypto.randomUUID())
  }
  if (avatarData.value?.length > 0 && !userStore.displayPhoto) {
      const randomIndex = Math.floor(Math.random() * avatarData.value.length)
      const randomAvatar = avatarData.value[randomIndex]
      userStore.setDisplayPhoto(authStatus.value == 'authenticated' ? authData.value?.user.image?? handleGetImage(randomAvatar.url, '50') : handleGetImage(randomAvatar.url, '50'))
    }

    if(authStatus.value =='authenticated' && authData.value?.user.email){
      handlePostRecentBoard(authData.value.user.email, boardId)
    }
});

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
  <UModal v-model="boardState.isOpenInputName">
    <div class="p-4">
      <p>How should we call you?</p>
      <UInput v-model="userDisplayName" placeholder="Your name here!" />
      <UButton label="Submit" @click="handleSetDisplayName" />
    </div>
  </UModal>
  <UModal v-model="boardState.isOpenQr">
    <QrCode :board-id="boardId" :width="$device.isMobile ? 200 : 500" :height="$device.isMobile ? 200 : 500" />
  </UModal>
  <div class="bg-cover min-h-screen" :class="'bg-' + bgColor">
    <h1 @click="handleOpenSlide" class="ml-4 font-bold cursor-pointer text-2xl mb-4 ">
      {{ header }}
    </h1>
    <BoardDisplayPost :commentable="boardData.comment" :reaction="boardData.reaction" :board-format="boardData.format" />
  </div>
  <div>
    <USlideover v-model="isOpenSlide">
      <UButton class="w-10 h-10 flex justify-center" @click="isOpenSlide = false" icon="i-heroicons-x-mark" />
      <BoardName :board-name="header" :board-id="boardId" @update="handleUpdate" />
      <BoardDescription :board-desc="description" :board-id="boardId" @update="handleUpdateDesc" />
      <div class="pl-6">
        <div class="flex justify-between w-full">
          <p>Like</p>
          <UToggle v-model="boardState.likeable" @update:model-value="hadleToggleLike"/>
      </div>
      <div class="w-full flex justify-between">
        <p>Comment</p>
        <UToggle v-model="boardState.commentable" @update:model-value="handleToggleComment"/>
      </div>
      <div class="w-full flex justify-between">
        <p>Board Format</p>
        <UInputMenu v-model="selectedFormat" :options="formats" option-attribute="name" @update:model-value="handleChangeFormat">
          <template #option="{ option: formatOption }">
            <span class="truncate">{{ formatOption.name }}</span>
          </template>
        </UInputMenu>
      </div>
    </div>
      <UCard class="flex justify-between items-center">
        <template #header>
          <p>Background</p>
        </template>
        <div @click="isOpenBg = true" class="h-20 w-36 " :class="'bg-' + bgColor">
        </div>
      </UCard>
      <USlideover :overlay="false" v-model="isOpenBg">
        <UButton class="w-10 h-10 flex justify-center" @click="isOpenBg = false" icon="i-heroicons-x-mark" />
        <BoardBackground :board-id="boardId" @update="handleUpdateColor" />
      </USlideover>
      <BoardShare :board-id="boardId" @update="hanldeOpenQr" />
    </USlideover>
  </div>
</template>