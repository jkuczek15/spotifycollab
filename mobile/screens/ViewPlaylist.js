import React from "react";
import { getPlaylist } from '../includes/Spotify';
import { addTrack } from '../includes/functions/press';
import { renderFooter } from '../includes/render/footer';
import { FlatList } from "react-native";
import FlatListItem from '../includes/components/FlatListItem';
import Toast from 'react-native-root-toast';

export default class ViewPlaylist extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      playlist_url: '',
      loading: false
    };
    this.token = props.screenProps.get('token');
    this.socket = props.screenProps.get('socket');
  }// end constructor

  componentWillMount() {
    this.setState({playlist_url: this.props.navigation.state.params.url}, () => {
      this.getPlaylist();
    });
    this.socket.on('track-added', (data) => {
      Toast.show('Track added successfully', {position: -40});
    });
  }// end function componentDidMount

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
        ListFooterComponent={() => renderFooter(this.state.loading)}
        renderItem={({item}) =>
        <FlatListItem title={item.track.name}
                      subtitle={item.track.artists.map((artist) => artist.name).join(', ')} 
                      onPress={() => addTrack(this.props, item.track)} />}
        removeClippedSubviews={true}
      />
    );
  }// end render function

}// end class ViewPlaylist
