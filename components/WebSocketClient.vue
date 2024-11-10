<template>
  <div>
    <form @submit.prevent="sendData">
      <input v-model="message">
      <button type="submit">send</button>
    </form>
    <div>
      <p v-for="entry in history"> {{entry}}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useWebSocket } from '@vueuse/core'
const message = ref('')
const history = ref<string[]>([])
const{status, data, send, open, close}=useWebSocket(`ws://${location.host}/api/websocket`)
watch(data, (newValue)=>{
  history.value.push('server: ', newValue)
})
function sendData(){
  history.value.push(`client: ${message.value}`)
  send(message.value)
  message.value=''
}
</script>