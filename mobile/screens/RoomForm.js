import React from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import { FormLabel, FormInput, Card, Button, Divider } from 'react-native-elements';
import { createPlaylist } from '../includes/Spotify';

export default class RoomForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      roomName: null,
      joined: false
    };
    this.join = this.join.bind(this);
    this.host = this.host.bind(this);
    this.token = props.screenProps.get('token');
    this.user = props.screenProps.get('user');
    this.socket = props.screenProps.get('socket');
  }// end constructor App

  componentDidMount() {
    // set up custom handlers for socket messages
    this.socket.on('error-message', (error) => {
      alert(error);
    });
    this.socket.on('room-update', (data) => {
      if(data.room) {
        // we have room data
        if(!this.state.joined) {
          // the user hasn't joined a room yet, but there is a room update message
          // check whether this user is the host of a room by comparing id's
          if(data.room.users[0].id == this.user.id) {
            data.room.users[0].access_token = this.token;
          }// end if this user is the host of a room
          
          this.props.screenProps.set('room', data.room, () => {
            // navigate to the Room screen 
            // passing room information as a navigation prop
            this.props.navigation.navigate("Room", {
              room: data.room, 
              socket: this.socket, 
              user: this.user,
              token: this.token
            });
            this.setState({joined: true});
            Keyboard.dismiss();
          });
        }// end if user hasn't joined a room yet
      }else{
        // a room was destroyed or the user left the room
        this.setState({joined: false});
      }// end if we have valid room data
    });
  }// end function componentDidMount

  join() {
    let roomName = this.state.roomName;
    if(roomName == null) {
      alert("Please enter a room name.");
    }else{
      this.socket.emit('join-room', { user: this.user, roomName: roomName });
    }// end if the room name is null
  }// end function join

  host() {
    let roomName = this.state.roomName;
    if(roomName == null) {
      return alert("Please enter a room name.");
    }// end if the room name was not provided

    // create a new request 
    var data = {
      description: "S.Party Playlist",
      public: false,
      name: "S.Party - " + roomName
    };

    createPlaylist(this.token, this.user.id, data).then((res) => {
      // once the playlist is created, send a socket message to the server
      // which creates a new database record
      this.user.access_token = this.token;
      this.socket.emit('create-room', { 
        user: this.user, 
        roomName: roomName, 
        playlistUri: res.href, 
        playlistId: res.id, 
        contextUri: res.uri 
      });
    });
  }// end function host

  render() {
    return (
      // implemented without image with header
      <View style={styles.container}>
        <Card>
          <FormLabel>Room Name</FormLabel>
          <FormInput onChangeText={(text) => this.setState({roomName: text})} />
          <Divider style={styles.divider} />
          <Button
            buttonStyle={styles.button}
            icon={{name: 'handshake-o', type: 'font-awesome' }}
            title='JOIN ROOM' 
            onPress={this.join} />
          <Button
            buttonStyle={styles.button}
            icon={{name: 'plus', type:'entypo' }}
            title='HOST ROOM' 
            onPress={this.host} />
        </Card>
      </View>
    );
  }// end render function
}// end class RoomForm

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 10,
    padding: 10
  },
  divider:  {
    marginTop: 15,
    marginBottom: 15
  },
  button: {
    backgroundColor: '#3C4044',
    margin: 5
  }
});