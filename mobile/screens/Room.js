import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { FormLabel, FormInput, Card, Button, Divider, Header } from 'react-native-elements';
import { getPlaylist } from '../includes/Spotify';
import { environment } from '../environments/environment';
import { Ionicons } from '@expo/vector-icons';
import FlatListItem from '../includes/components/FlatListItem';

export default class Room extends React.Component {

    constructor(props) {
      super(props);

      // get the room from the navigation props
      let room = props.navigation.state.params.room;
      
      // get the spotify access token from our screen props
      this.token = props.screenProps.get('token');
      this.user = props.screenProps.get('user');
      this.socket = props.screenProps.get('socket');

      if(room.users[0].id == this.user.id) {
        // this user is the host, we need to store their access token
        // so that we can make further requests
        room.users[0].access_token = this.token;
      }// end if the user is the host of the room

      // set the room information in the component state
      this.state = {
        room: room,
        queue: null
      };

      // set any new room data into the screenprops for other components
      props.screenProps.set('room', room);
    }// end constructor App

    getQueue() {
      getPlaylist(this.token, this.state.room.playlistUri).then((res) => {
        this.setState({queue: res.items});
      });
    }// end function getQueue
  
    componentDidMount() {
      // set up custom handlers for socket messages
      this.getQueue();
      this.socket.on('room-update', (data) => {
        //console.log(data);
      });
      this.socket.on('playlist-update', (data) => {
        this.getQueue();
      });
    }// end function componentDidMount
  
    render() {
      if(!this.state.queue) return null;

      return (
        // implemented without image with header
        <View>
            <View style={styles.container}>
                <Text>Host: {this.state.room.users[0].display_name}</Text>
                <Divider style={{ backgroundColor: 'black' }} />
                <FlatList
                  data={this.state.queue}
                  keyExtractor={item => item.track.id}
                  ListFooterComponent={this.renderFooter}
                  renderItem={({item}) =>
                  <FlatListItem title={item.track.name} 
                                subtitle={item.track.artists.map((artist) => artist.name).join(', ')} />}
                  removeClippedSubviews={true}
                />
            </View>
        </View>
      );
    }// end render function

    renderFooter = () => {
      if (!this.state.loading) return null;
  
      return (
        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderColor: "#CED0CE"
          }}
        >
          <ActivityIndicator animating size="large" />
        </View>
      );
    };
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
      backgroundColor: '#3C4044',
      margin: 5
    }
});