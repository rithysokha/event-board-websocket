<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useWebSocket } from '@vueuse/core'
const isOpen = ref(false)
const isOpenPost = ref(false)
const header = ref("")
const bgColor = ref("")
const message = ref('')
const history = ref<string[]>([])

const route = useRoute();
const boardId = route.query.boardId;

if (!boardId || typeof boardId !== 'string') {
  throw new Error('Board ID is required and must be a string');
}

const { data: boardData } = await useFetch(`/api/board?boardId=${boardId}`);
header.value = boardData.value.name
bgColor.value= boardData.value.background
let websocketUrl = ''
if (typeof window !== 'undefined' && window.location) {
  websocketUrl = `ws://${window.location.host}/api/websocket?room=${boardId}`
}

const { status, data, send, open, close } = useWebSocket(websocketUrl)

watch(data, (newValue) => {
  history.value.push(`server: ${newValue}`)
})

const sendData = ()=> {
  history.value.push(`client: ${message.value}`)
  send(message.value)
  message.value = ''
}

</script>

<template>
  <UButton @click="isOpenPost=true" label="New Post" class="fixed z-50 bottom-2 right-2"/>
  <div class="w-full h-screen" :class="'bg-'+bgColor">
    <h1 @click="isOpen = true" class=" cursor-default ">
      {{ header }}x
    </h1>
    <div>
      <div>
        <p v-for="entry in history" :key="entry">{{ entry }}</p>
      </div>
    </div>
  </div>
  <div>
    <UModal v-model="isOpenPost">
      <div class="p-4 flex flex-col gap-2">
        <p>Please Enter Message</p>
        <UInput v-model="message"/>
        <UButton block type="submit" @click="sendData">Submit</UButton>
      </div>
    </UModal>
    

    <USlideover v-model="isOpen">
      <div class="p-4 flex-1">
        <UButton
          color="gray"
          variant="ghost"
          size="sm"
          icon="i-heroicons-x-mark-20-solid"
          class="flex sm:hidden absolute end-5 top-5 z-10"
          square
          padded
          @click="isOpen = false"
        />
        <BoardRename />
        <Placeholder class="h-full" />
      </div>
    </USlideover>
  </div>
</template>