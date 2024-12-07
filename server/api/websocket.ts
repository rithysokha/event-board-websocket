function dynamicRoom(peer: any): string {
  try{
  const roomId = peer.request.url.split('?')[1];
  const params = new URLSearchParams(roomId).get('room')
  return params ? params.toString (): "defaultRoom";
  }catch(e){
    return "defaultRoom"
  }
}
export default defineWebSocketHandler({
  open(peer){
    peer.subscribe(dynamicRoom(peer))
  },
  error(peer, error){
    console.log('Error on websocket ',peer,error)
  },
  message(peer, message){
    peer.publish(dynamicRoom(peer), message.text())
  }
})
