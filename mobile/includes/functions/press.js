export const addTrack = (props, track) => {
  let room = props.screenProps.get('room');
  let socket = props.screenProps.get('socket');
  if(room){
    socket.emit('add-track', {track: track, room: room});
  }// end if we have a room
}// end function addTrack