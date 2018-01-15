import React from "react";
import { View, ScrollView, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Header } from 'react-native-elements';
import { getLibrary, getLibraryNext } from '../includes/Spotify';
import { List, ListItem } from 'react-native-elements';

export default class Music extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      tracks: [],
      loading: false
    };
    
    this.getNextTracks = this.getNextTracks.bind(this);
    this.token = props.screenProps.get('token');
  }// end constructor App

  componentDidMount(){
    this.setState({ loading: true });
    getLibrary(this.token).then((res) => {
      this.setState({tracks: res.items, next: res.next, loading: false});
    });
  }// end function componentDidMount

  getNextTracks() {
    // recursivley get all the tracks from a user's library
    let next = this.state.next;
    if(next){
      this.setState({ loading: true });
      getLibraryNext(next, this.token).then((res) => {
        let tracks = this.state.tracks;
        this.setState({tracks: [...tracks, ...res.items], next: res.next, loading: false});
      });
    }// end if we have more tracks to retreieve
    
  }// end function getNextTracks

  render() {
    if(!this.state.tracks) return null;
    
    return (
      <View>
        <Header
          centerComponent={{ text: "Your Music", style: { color: '#fff' } }}
          backgroundColor="#23CF5F"
        />
        <View>
          <FlatList
            style={{marginBottom: 140}}
            extraData={this.state}
            data={this.state.tracks}
            keyExtractor={item => item.track.id}
            ListFooterComponent={this.renderFooter}
            renderItem={({item}) => 
            <ListItem 
              title={item.track.name} 
              subtitle={item.track.artists.map((artist) => artist.name).join(', ')} 
            />}
            onEndReached={this.getNextTracks}
            onEndReachedThreshold={0.5}
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
}// end class Music