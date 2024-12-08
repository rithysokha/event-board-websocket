<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { useWebSocket } from '@vueuse/core'
const isOpen = ref(false)
const isOpenPost = ref(false)
const isOpenBg = ref(false)
const header = ref("")
const description = ref("")
const bgColor = ref("")
const websocketUrl = ref('')
const history = ref<{ title: string, description: string }[]>([]);
const postBody = ref({
  title: '',
  description: '',
  boardId: ''
})

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
  websocketUrl.value = `ws://${window.location.host}/api/websocket?room=${boardId}`
}
const { status, data, send, open, close } = useWebSocket(websocketUrl.value)

watch(data, (newValue) => {
  try {
    const message = JSON.parse(newValue);
    history.value.push({
      title: message.title,
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
    history.value = messages.map((message: { title: string, description: string }) => ({
      title: message.title,
      description: message.description
    }));
  } catch (error) {
    console.error('Error fetching message history:', error);
  }
};


const savePostToDB = async () => {
  try {
    postBody.value.boardId = boardId
    await fetch('api/board/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postBody.value)
    });
    isOpenPost.value = false
  } catch (error) {
    console.error('Error creating board:', error);
  }
};

const sendData = () => {
  const message = {
    title: postBody.value.title,
    description: postBody.value.description
  };

  history.value.push(message);
  send(JSON.stringify(message));
  savePostToDB();
  postBody.value.title = '';
  postBody.value.description = '';
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
  <div class="w-full h-screen" :class="'bg-' + bgColor">
    <h1 @click="isOpen = true" class=" cursor-default ">
      {{ header }}
    </h1>
    <p>{{ description }} </p>
    <div
      class=" mx-2 grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      <UCard v-for="entry in history" :key="entry.title">
        <template #header>
          <p>uesr acc and pf</p>
        </template>
        <p>{{ entry.title }}</p>
        <p>{{ entry.description }}</p>
        <template #footer>
          <p>comment and likes</p>
        </template>
      </UCard>
    </div>
  </div>
  <div>

    <UModal v-model="isOpenPost">
      <div class="p-4 flex flex-col gap-2">
        <UButton class="w-20 relative" type="submit" @click="sendData">Submit</UButton>
        <UInput v-model="postBody.title" />
        <UInput v-model="postBody.description" />
      </div>
    </UModal>

    <USlideover v-model="isOpen">
      <UButton class="w-10 h-10" @click="isOpen=false" label="X"/>
      <BoardName :board-name="header" :board-id="boardId" @update="handleUpdate" />
      <BoardDescription :board-desc="description" :board-id="boardId" @update="handleUpdateDesc" />
      <UCard class="flex justify-between items-center">
        <template #header>
          <p>Background</p>
        </template>
        <div @click="isOpenBg=true" class="h-20 w-36 ":class="'bg-' + bgColor">
        </div>
      </UCard>
      <USlideover :overlay="false" v-model="isOpenBg">
      <UButton class="w-10 h-10" @click="isOpenBg=false" label="X"/>
          <BoardBackground :board-id="boardId" @update="handleUpdateColor"/>
      </USlideover>
    </USlideover>
  </div>
</template>