import { ref, onMounted, onUnmounted } from 'vue'

export const useWebSocket = () => {
  const socket = ref<WebSocket | null>(null)
  const isConnected = ref(false)

  const connect = (url: string) => {
    if (socket.value?.readyState === WebSocket.OPEN) return
    
    socket.value = new WebSocket(url)
    
    socket.value.onopen = () => {
      isConnected.value = true
      console.log('WebSocket connected')
    }
    
    socket.value.onclose = () => {
      isConnected.value = false
      console.log('WebSocket disconnected')
    }
    
    socket.value.onerror = (error) => {
      console.error('WebSocket error:', error)
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
    sendMessage
  }
}