<template>
  <div>
    <form @submit.prevent="sendData">
      <input v-model="message" placeholder="message">
      <button type="submit">send</button>
    </form>
    <div>
      <p v-for="entry in history" :key="entry">{{ entry }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useWebSocket } from '@vueuse/core'

const message = ref('')
const history = ref<string[]>([])

let websocketUrl = ''
if (typeof window !== 'undefined' && window.location) {
  websocketUrl = `ws://${window.location.host}/api/websocket?room=ti5`
}

const { status, data, send, open, close } = useWebSocket(websocketUrl)

watch(data, (newValue) => {
  history.value.push(`server: ${newValue}`)
})

function sendData() {
  history.value.push(`client: ${message.value}`)
  send(message.value)
  message.value = ''
}
</script>

<style>
/* Add your styles here */
</style>