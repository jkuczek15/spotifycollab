import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FormLabel, FormInput, Card, Button, Divider, Header } from 'react-native-elements';
import { createPlaylist, removePlaylist } from '../includes/Spotify';
import { environment } from '../environments/environment';
import { Ionicons } from '@expo/vector-icons';

export default class Room extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      roomName: null,
      connected: false,
      room: null,
      host: false
    };
    // bind the context of this component to each function defined
    // underneath it
    this.join = this.join.bind(this);
    this.host = this.host.bind(this);
    this.leave = this.leave.bind(this);

    // get the spotify access token from our screen props
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
      // get the new room information
      this.setState({ room: data.room });
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
      alert("Please enter a room name.");
    }else{
      var data = {
        description: "S.Party Playlist",
        public: false,
        name: "S.Party - " + roomName
      };

      createPlaylist(this.token, this.user.id, data).then((res) => {
        // once the playlist is created, send a socket message to the server
        // which creates a new database record
        this.setState({ host: true });
        this.socket.emit('create-room', { user: this.user, roomName: roomName, playlistUri: res.href, playlistId: res.id, contextUri: res.uri });
      });
    }// end if the room name was not provided

  }// end function join

  leave() {
    if(this.state.host) {
      // user is the host, end the room and delete their playlist
      removePlaylist(this.token, this.user.id, this.state.room.playlistId).then((res) => {
        this.socket.emit('end-room', { room: this.state.room });
      });
    }else{
      // user is not the host, just leave
      socket.emit('leave-room', { user: this.user, room: this.state.room });
    }// end if user is the host
  }// end function leave

  render() {
    if(this.state.room == null) {
      // we are not in a room
      return (
        // implemented without image with header
        <View>
          <Header
            centerComponent={{ text: "Join a Room", style: { color: '#fff' } }}
            backgroundColor="#23CF5F"
          />
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
        </View>
      );
    }else{
      // we have joined a room
      let room = this.state.room;
      return (
        // implemented without image with header
        <View>
          <Header
            leftComponent={<Ionicons name="md-exit" size={22} color="#fff" onPress={this.leave} />}
            centerComponent={{ text: room.name, style: { color: '#fff' } }}
            backgroundColor="#23CF5F"
          />
          <View style={styles.container}>
            <Text>This shows after joining a room.</Text>
          </View>
        </View>
      );
    }// end if we are not in a room
    
  }// end render function
}// end class Room

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
    backgroundColor: '#23CF5F',
    margin: 5
  }
});