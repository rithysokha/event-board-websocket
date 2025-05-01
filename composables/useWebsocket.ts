import { ref, onUnmounted } from 'vue'

export const useWebSocket = () => {
  const socket = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const data = ref<string>('')

  const connect = (url: string) => {
    if (socket.value?.readyState === WebSocket.OPEN) return
    
    socket.value = new WebSocket(url)
    
    socket.value.onopen = () => {
      isConnected.value = true
    }
    
    socket.value.onclose = () => {
      isConnected.value = false
    }
    
    socket.value.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
    socket.value.onmessage = (event) => {
      data.value = event.data
    }
  }

  const disconnect = () => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.close()
    }
  }

  const sendMessage = (message: any) => {
    if (socket.value?.readyState === WebSocket.OPEN) {
      socket.value.send(JSON.stringify(message))
    } else {
      console.error('Cannot send message, WebSocket is not connected')
    }
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    sendMessage,
    data 
  }
}