import React from "react";
import { search } from '../includes/Spotify';
import { addTrack } from '../includes/functions/press';
import { renderFooter } from '../includes/render/footer';
import { View, FlatList } from "react-native";
import { SearchBar } from 'react-native-elements';
import FlatListItem from '../includes/components/FlatListItem';
import { getRooms } from '../includes/DB_Calls';

export default class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      rooms: [],
      loading: false,
      search: '',
      joined: props.screenProps.get('room') != null
    };
    this.token = props.screenProps.get('token');
    this.user = props.screenProps.get('user');
    this.socket = props.screenProps.get('socket');
  }// end constructor App

  componentDidMount(){
    this.socket.on('room-update', (data) => {
      if(data.room) {
        // we have room data
        if(!this.state.joined) {
          this.setState({joined: true, search: ''});
          this.props.navigation.navigate("Room", {
            room: data.room, 
            socket: this.socket, 
            user: this.user,
            token: this.token
          });
        }// end if not joined
      }else{
        this.setState({joined: false, search: ''});
      }// end if we have room
    });
  }// end function componentDidMount

  search(query) {
    if(!this.state.joined){
      getRooms(query).then((rooms) => {
        this.setState({rooms: rooms, loading: false});
      });
    }else{
      if(query == ''){
        this.setState({tracks: [], loading: false});
      }else{
        this.setState({loading: true});
        search(this.token, query).then((res) => {
          if(res.tracks){
            this.setState({tracks: res.tracks.items, loading: false});
          }// end if tracks
        });
      }// end if the search query is null
    }// end if user has joined a room
    
  }// end function search

  joinRoom(roomName){
    this.socket.emit('join-room', { user: this.user, roomName: roomName });
  }// end function joinRoom

  render() {
    if(this.state.joined){
      // searching music
      if(!this.state.tracks) return null;
      return (
        <View>
          <SearchBar placeholder="Search Music..." onChangeText={(text) => {this.search(text)}} value={this.state.search} />
          <FlatList
            keyboardShouldPersistTaps="always"
            data={this.state.tracks}
            keyExtractor={item => item.id}
            ListFooterComponent={() => renderFooter(this.state.loading)}
            renderItem={({item}) =>
              <FlatListItem title={item.name}
                            subtitle={item.artists.map((artist) => artist.name).join(', ')} 
                            onPress={() => addTrack(this.props, item)}  />}
            removeClippedSubviews={true} />
        </View>
      );
    }else{
      // searching rooms
      if(!this.state.rooms) return null;
      return (
        <View>
          <SearchBar placeholder="Search Rooms..." onChangeText={(text) => {this.search(text)}} />
          <FlatList
            keyboardShouldPersistTaps="always"
            data={this.state.rooms}
            keyExtractor={item => item.name}
            ListFooterComponent={() => renderFooter(this.state.loading)}
            renderItem={({item}) =>
              <FlatListItem title={item.name}
                            subtitle={"Created by " + item.users[0].display_name} 
                            onPress={() => this.joinRoom(item.name)}  />}
            removeClippedSubviews={true} />
        </View>
      );
    }// end if searching music
    
  }// end render function

}// end class Search