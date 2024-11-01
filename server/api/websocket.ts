const room = 'ROOM'
export default defineWebSocketHandler({
  open(peer){
    peer.subscribe(room)
    peer.publish(room, 'Another user joined')
  },
  close(peer){
    peer.publish('user disconected', peer)
  },
  error(peer, error){
    console.log('Error on websocket ',peer,error)
  },
  message(peer, message){
    console.log('log on peer message ',peer, message)
    peer.publish(room, message.text())
  }
})
