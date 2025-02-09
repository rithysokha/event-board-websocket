<script lang="ts" setup>

definePageMeta({
  ssr: false,
  auth:false
});
const {data:authData} = useAuth()
const isOpenSlide = ref(false)

const isOpenBg = ref(false)
const isOpenQr = ref(false)
const header = ref("")
const description = ref("")
const bgColor = ref("")


const route = useRoute();
const boardId = route.query.boardId;

if (!boardId || typeof boardId !== 'string') {
  throw new Error('Board ID is required and must be a string');
}
const { data: boardData } = await useFetch(`/api/board?boardId=${boardId}`);

header.value = boardData.value.name
bgColor.value = boardData.value.background
description.value = boardData.value.description

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


</script>

<template>
  <UModal v-model="isOpenQr">
    <QrCode :board-id="boardId" :width="$device.isMobile?200:500" :height="$device.isMobile?200:500"/>
  </UModal>
  <div class="bg-cover min-h-screen" :class="'bg-' + bgColor">
    <h1 @click="handleOpenSlide" class="font-bold cursor-pointer text-2xl mb-4 ">
      {{ header }}
    </h1>

    <BoardDisplayPost :board-id="boardId", :comment="boardData.comment" :reaction="boardData.reaction"/>

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
      <BoardShare :board-id="boardId" @update="hanldeOpenQr"/>
    </USlideover>
  </div>
</template>