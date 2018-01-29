import React from "react";
import { View, ScrollView, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { getPlaylist } from '../includes/Spotify';
import FlatListItem from '../includes/components/FlatListItem';

export default class ViewPlaylist extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      playlist_url: '',
      loading: false
    };
    this.user = props.screenProps.get('user');
    this.token = props.screenProps.get('token');
    this.socket = props.screenProps.get('socket');
  }// end constructor

  componentWillMount() {
    this.setState({playlist_url: this.props.navigation.state.params.url}, () => {
      this.getPlaylist();
    });
  }// end function componentDidMount

  addTrack(track) {
    let room = this.props.screenProps.get('room');
    if(room){
      this.socket.emit('add-track', {track: track, room: room});
    }// end if we have a room
  }// end function addTrack

  getPlaylist() {
    this.setState({ loading: true });
    getPlaylist(this.token, this.state.playlist_url).then((res) => {
      this.setState({tracks: res.items, loading: false});
    });
  }// end function getTracks
 
  render() {
    if(!this.state.tracks) return null;
    
    return (
          <FlatList
            data={this.state.tracks}
            keyExtractor={item => item.track.id}
            ListFooterComponent={this.renderFooter}
            renderItem={({item}) =>
            <FlatListItem title={item.track.name}
                          subtitle={item.track.artists.map((artist) => artist.name).join(', ')} 
                          onPress={() => {this.addTrack(item.track)} } />}
            removeClippedSubviews={true}
          />
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

}// end class ViewPlaylist
