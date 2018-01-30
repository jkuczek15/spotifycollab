import React from "react";
import { getPlaylist } from '../includes/Spotify';
import { renderFooter } from '../includes/render/footer';
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Divider } from 'react-native-elements';
import FlatListItem from '../includes/components/FlatListItem';

export default class Room extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      room: props.screenProps.get('room'),
      queue: null
    };
    this.token = props.screenProps.get('token');
    this.user = props.screenProps.get('user');
    this.socket = props.screenProps.get('socket');
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
      console.log(data);
    });
    this.socket.on('playlist-update', (data) => {
      this.getQueue();
    });
  }// end function componentDidMount
  
  render() {
    if(!this.state.queue) return null;
    return (
      <View>
        <View style={styles.container}>
          <Text>Host: {this.state.room.users[0].display_name}</Text>
          <Divider style={{ backgroundColor: 'black' }} />
          <FlatList
            data={this.state.queue}
            keyExtractor={item => item.track.id}
            ListFooterComponent={() => renderFooter(this.state.loading)}
            renderItem={({item}) =>
            <FlatListItem title={item.track.name} 
                          subtitle={item.track.artists.map((artist) => artist.name).join(', ')} />}
            removeClippedSubviews={true} />
        </View>
      </View>
    );
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
    backgroundColor: '#3C4044',
    margin: 5
  }
});