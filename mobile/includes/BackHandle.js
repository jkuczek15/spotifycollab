import { NavigationActions } from 'react-navigation';
import { removePlaylist } from './Spotify';

const backAction = NavigationActions.back();

export const handleRoomBack = (navigation) => {
    let room = navigation.state.params.room;
    let socket = navigation.state.params.socket;
    let user = navigation.state.params.user;
    let token = navigation.state.params.token;

    if(room.users[0].id === user.id) {
        // the user is a host
        removePlaylist(token, user.id, room.playlistId).then((res) => {
            socket.emit('end-room', { room: room, user: user });
            navigation.dispatch(backAction);
        });
    }else{
        // just leave the room
        socket.emit('leave-room', { room: room, user: user });
        navigation.dispatch(backAction);
    }// end if user is not the host of the room    
};