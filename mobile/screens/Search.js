import React from "react";
import { View, Text, Platform, StatusBar, FlatList, ActivityIndicator } from "react-native";
import { Header, SearchBar } from 'react-native-elements';
import { search } from '../includes/Spotify';
import FlatListItem from '../includes/components/FlatListItem';

export default class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      loading: false
    };
    this.addTrack = this.addTrack.bind(this);
    this.token = props.screenProps.get('token');
    this.socket = props.screenProps.get('socket');
  }// end constructor App

  addTrack(track) {
    let room = this.props.screenProps.get('room');
    if(room){
      this.socket.emit('add-track', {track: track, room: room});
    }// end if we have a room
  }// end function addTrack

  search(query) {
    if(query == ''){
      this.setState({tracks: [], loading: false});
    }else{
      search(this.token, query).then((res) => {
        if(res.tracks){
          this.setState({tracks: res.tracks.items, loading: false});
        }// end if tracks
      });
    }// end if the search query is null
  }// end function search

  render() {
    if(!this.state.tracks) return null;

    return (
      <View>
        <SearchBar placeholder="Search..." onChangeText={(text) => {this.search(text)}} />
        <FlatList
            keyboardShouldPersistTaps="always"
            data={this.state.tracks}
            keyExtractor={item => item.id}
            ListFooterComponent={this.renderFooter}
            renderItem={({item}) =>
              <FlatListItem title={item.name}
                          subtitle={item.artists.map((artist) => artist.name).join(', ')} 
                          onPress={() => {this.addTrack(item)} } />}
            removeClippedSubviews={true}
        />
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
}// end class Search