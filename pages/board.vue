<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { useWebSocket } from '@vueuse/core'
const isOpen = ref(false)
const isOpenPost = ref(false)
const header = ref("")
const bgColor = ref("")
const history = ref<string[]>([])
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
let websocketUrl = ''
if (typeof window !== 'undefined' && window.location) {
  websocketUrl = `ws://${window.location.host}/api/websocket?room=${boardId}`
}
const { status, data, send, open, close } = useWebSocket(websocketUrl)
watch(data, (newValue) => {
  history.value.push(`${newValue}`)
})

const fetchMessageHistory = async () => {
  try {
    const response = await fetch(`/api/board/post?boardId=${boardId}`);
    const post = await response.json();
    history.value = post.map((post: { title: string }) => post.title);
  } catch (error) {
    console.error('Error fetching message history:', error);
  }
};


const savePostToDB = async () => {
  try {
    postBody.value.boardId = boardId
    postBody.value.description = 'this is default description'
    await fetch('api/board/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postBody.value)
    });
  } catch (error) {
    console.error('Error creating board:', error);
  }
};

const sendData = () => {
  history.value.push(`${postBody.value.title}`)
  send(postBody.value.title);
  savePostToDB();
  postBody.value.title = ''
}

onMounted(() => {
  fetchMessageHistory();
});
</script>

<template>
  <UButton @click="isOpenPost = true" label="New Post" class="fixed z-50 bottom-2 right-2" />
  <div class="w-full h-screen" :class="'bg-' + bgColor">
    <h1 @click="isOpen = true" class=" cursor-default ">
      {{ header }}x
    </h1>
    <div
      class=" mx-2 grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      <UCard v-for="entry in history" :key="entry">
        <template #header>
          <p>uesr acc and pf</p>
        </template>
        <p>{{ entry }}</p>
        <template #footer>
          <p>comment and likes</p>
        </template>
      </UCard>
    </div>
  </div>
  <div>
    <!-- this part can devide into component -->
    <UModal v-model="isOpenPost">
      <div class="p-4 flex flex-col gap-2">
        <p>Please Enter Message</p>
        <UInput v-model="postBody.title" />
        <UButton block type="submit" @click="sendData">Submit</UButton>
      </div>
    </UModal>
    <USlideover v-model="isOpen">
      <div class="p-4 flex-1">
        <UButton color="gray" variant="ghost" size="sm" />
      </div>
    </USlideover>
  </div>
</template>