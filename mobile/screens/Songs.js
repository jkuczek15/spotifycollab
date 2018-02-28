import React from "react";
import { getLibrary } from '../includes/Spotify';
import { addTrack } from '../includes/functions/press';
import { renderFooter } from '../includes/render/footer';
import { FlatList } from "react-native";
import FlatListItem from '../includes/components/FlatListItem';
import Toast from 'react-native-root-toast';

export default class Songs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      offset: 0,
      loading: false,
      modalVisible: false,
    };
    this.getTracks = this.getTracks.bind(this);
    this.nextTracks = this.nextTracks.bind(this);
    this.token = props.screenProps.get('token');
    this.socket = props.screenProps.get('socket');
  }// end constructor App

  componentDidMount() {
    this.getTracks();
    this.socket.on('track-added', (data) => {
      Toast.show('Track added successfully', {position: -40});
    });
  }// end function componentDidMount

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.offset === this.state.offset;
  }// end function shouldComponentUpdate

  getTracks() {
    this.setState({ loading: true });
    getLibrary(this.token, this.state.offset).then((res) => {
      this.setState({tracks: [...this.state.tracks, ...res.items], loading: false});
    });
  }// end function getTracks

  nextTracks() {
    this.setState({ 
      offset: this.state.offset + 50 
    }, () => {
      this.getTracks();
    });
  }// end function getNextTracks

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
                      onPress={() => {addTrack(this.props, item.track)} } />}
        onEndReached={this.nextTracks}
        onEndReachedThreshold={0.4}
        removeClippedSubviews={true} />
    );
  }// end render function

}// end class Songs
