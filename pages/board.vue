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
const boardState = useBoardStateStore()
const userStore = useUserStore()
const userDisplayName = ref("")
const formats = [
  { name: 'Wall'},
  { name: 'Stream'}
]
const selectedFormat = ref({name:''})
const route = useRoute();
const boardId = route.query.boardId;
const { connect, sendMessage, data } = useWebSocket()

if (!boardId || typeof boardId !== 'string') {
  throw new Error('Board ID is required and must be a string');
}
const { data: boardData }: any = await useFetch(`/api/board?boardId=${boardId}`);

if (boardData.value?.format) {
  const formatIndex = formats.findIndex(f => f.name === boardData.value.format)
  if (formatIndex >= 0) {
    selectedFormat.value = formats[formatIndex]
  }
}
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
 editBoard(boardId, 'reaction', boardData.value.reaction)
}

const handleToggleComment = () => {
editBoard(boardId, 'comment', boardData.value.comment)
}
const handleTogglePost = () => {
editBoard(boardId, 'post', boardData.value.post)
}

const handleUpdateColor = (newColor: string) => {
  editBoard(boardId, 'background', newColor)
};

const liveUpdateBoard = async ( field: string, value: any) => {
  if (boardData.value) {
    boardData.value[field] = value;
  }
  if (field === 'format') {
      const formatIndex = formats.findIndex(f => f.name === value);
      if (formatIndex >= 0) {
        selectedFormat.value = formats[formatIndex];
      }
    }
}

const editBoard = async (boardId: string, field: string, value: string | boolean) => {
  try{
    await $fetch(`/api/board/${boardId}`, {
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
  editBoard(boardId,'name', newName)
};
const handleUpdateDesc = (newDesc: string) => {
  editBoard(boardId,'description', newDesc)
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
    body: JSON.stringify({userId:userId, boardId:boardId, name:boardData.value.name, background:boardData.value.background})
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

const getContrastTextColor = (bgColor: string) => {
  const lightBackgrounds = ['gray-50', 'gray-100', 'gray-200', 'red-50', 'red-100', 'yellow-400', 'yellow-500'];  
  return lightBackgrounds.includes(bgColor) ? 'text-gray-900' : 'text-white';
}
</script>

<template>
  <UModal v-model="boardState.isOpenInputName">
    <div class="p-4 flex flex-col gap-2">
      <p>What should we call you?</p>
      <UInput v-model="userDisplayName" placeholder="Your name here!" />
      <div class="flex justify-center">
        <UButton block class="flex flex-col items-center" label="OK" @click="handleSetDisplayName" />
      </div>
    </div>
  </UModal>
  <UModal v-model="boardState.isOpenQr">
    <QrCode :board-id="boardId" :width="$device.isMobile ? 200 : 500" :height="$device.isMobile ? 200 : 500" />
  </UModal>
  <div class="bg-cover min-h-screen transition-all duration-300" :class="'bg-' + boardData.background">
    <div class="ml-4 mb-4">
      <div class="flex items-center group gap-1 cursor-pointer" @click="handleOpenSlide">
        <UIcon v-show="authData?.user.email == boardData.belongsTo" name="i-heroicons-cog-6-tooth-solid" class="w-5 h-5 transition-all duration-300 group-hover:rotate-90"
        :class="getContrastTextColor(boardData.background)"
        />
        <h1  class=" font-bold  text-2xl w-fit capitalize group-hover:scale-105 group-hover:drop-shadow-md transition-all duration-300"
        :class="getContrastTextColor(boardData.background)">
          {{ boardData.name }}
        </h1>
      </div>
        <p class="transition-all duration-300"
        :class="getContrastTextColor(boardData.background)"
        >{{ boardData.description }} </p>
    </div>
    <BoardDisplayPost :commentable="boardData.comment" :reaction="boardData.reaction" :board-format="boardData.format" :post="boardData.post"/>
  </div>
  <div>
    <USlideover v-model="isOpenSlide">
      <div class="m-2">
        <UButton class="w-10 h-10 flex justify-center" @click="isOpenSlide = false" icon="i-heroicons-x-mark" />
        <BoardName :board-name="boardData.name" :board-id="boardId" @update="handleUpdate" />
      <BoardDescription :board-desc="boardData.description" :board-id="boardId" @update="handleUpdateDesc" />
      <div class="pl-6">
        <div class="flex justify-between w-full">
          <p>Like</p>
          <UToggle v-model="boardData.reaction" @update:model-value="hadleToggleLike"/>
      </div>
      <div class="w-full flex justify-between">
        <p>Comment</p>
        <UToggle v-model="boardData.comment" @update:model-value="handleToggleComment"/>
      </div>
      <div class="w-full flex justify-between">
        <p>Post</p>
        <UToggle v-model="boardData.post" @update:model-value="handleTogglePost"/>
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
        <BoardBackground :current-color="boardData.background" :board-id="boardId" @update="handleUpdateColor" />
    </div>
      <BoardShare :board-id="boardId" @update="hanldeOpenQr" />
    </USlideover>
  </div>
</template>