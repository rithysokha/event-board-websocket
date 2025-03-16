<script lang="ts" setup>
import { useBoardStoreStateStore } from '~/stores/boardStoreState';
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
const boardState = useBoardStoreStateStore()
const userStore = useUserStore()
const userDisplayName = ref("")

const route = useRoute();
const boardId = route.query.boardId;

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
onMounted(() => {
  if (userStore.uuid == '') {
    userStore.setUuid(authStatus.value == 'authenticated' ? authData.value?.user.email ?? crypto.randomUUID() : crypto.randomUUID())
  }
  if (avatarData.value?.length > 0 && !userStore.displayPhoto) {
      const randomIndex = Math.floor(Math.random() * avatarData.value.length)
      const randomAvatar = avatarData.value[randomIndex]
      userStore.setDisplayPhoto(authStatus.value == 'authenticated' ? authData.value?.user.image?? handleGetImage(randomAvatar.url, '50') : handleGetImage(randomAvatar.url, '50'))
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

    <BoardDisplayPost :board-id="boardId" :comment="boardData.comment" :reaction="boardData.reaction" />

  </div>
  <div>
    <USlideover v-model="isOpenSlide">
      <UButton class="w-10 h-10 flex justify-center" @click="isOpenSlide = false" icon="i-heroicons-x-mark" />
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
        <UButton class="w-10 h-10 flex justify-center" @click="isOpenBg = false" icon="i-heroicons-x-mark" />
        <BoardBackground :board-id="boardId" @update="handleUpdateColor" />
      </USlideover>
      <BoardShare :board-id="boardId" @update="hanldeOpenQr" />
    </USlideover>
  </div>
</template>