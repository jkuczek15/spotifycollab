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
      offset: 0,
      loading: false
    };
    
    this.getNextTracks = this.getNextTracks.bind(this);
    this.token = props.screenProps.get('token');
  }// end constructor App

  componentDidMount(){
    this.setState({ loading: true });
    this.getNextTracks();

    getLibrary(this.token, this.state.offset).then((res) => {
      let tracks = this.state.tracks;
      this.setState({tracks: [...tracks, ...res.items], loading: false});
    });
  }// end function componentDidMount

  getNextTracks() {
    this.setState({ offset: this.state.offset+50 });
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
