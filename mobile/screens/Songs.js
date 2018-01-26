import React from "react";
import { View, ScrollView, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Header } from 'react-native-elements';
import { getLibrary, getLibraryNext } from '../includes/Spotify';
import { List } from 'react-native-elements';
import FlatListItem from '../includes/components/FlatListItem';

export default class Songs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      offset: 0,
      loading: false
    };
    this.getTracks = this.getTracks.bind(this);
    this.getNextTracks = this.getNextTracks.bind(this);
    this.token = props.screenProps.get('token');
  }// end constructor App

  componentDidMount() {
    this.getTracks();
  }// end function componentDidMount

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.offset === this.state.offset;
  }// end function shouldComponentUpdate

  addTrack(track) {
    console.log(track);
  }// end function addTrack

  getTracks() {
    this.setState({ loading: true });
    getLibrary(this.token, this.state.offset).then((res) => {
      this.setState({tracks: [...this.state.tracks, ...res.items], loading: false});
    });
  }// end function getTracks

  getNextTracks() {
    this.setState({ 
      offset: this.state.offset + 50 
    }, () => {
      this.getTracks();
    });
  }// end function getNextTracks

  render() {
    if(!this.state.tracks) return null;
    
    return (
        <View>
          <FlatList
            style={{marginBottom: 0}}
            data={this.state.tracks}
            keyExtractor={item => item.track.id}
            ListFooterComponent={this.renderFooter}
            renderItem={({item}) =>
            <FlatListItem title={item.track.name} 
                          subtitle={item.track.artists.map((artist) => artist.name).join(', ')}
                          onPress={() => {this.addTrack(item.track)} } />}
            onEndReached={this.getNextTracks}
            onEndReachedThreshold={0.6}
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
}// end class Music
