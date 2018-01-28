import React from "react";
import { View, ScrollView, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { getPlaylists } from '../includes/Spotify';
import FlatListItem from '../includes/components/FlatListItem';

export default class Playlists extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
      offset: 0,
      loading: false
    };
    this.token = props.screenProps.get('token');
  }// end constructor

  componentDidMount() {
    this.getPlaylists();
  }// end function componentDidMount

  viewPlaylist(name, url) {
    this.props.navigation.navigate("ViewPlaylist", {name: name, url: url});
  }// end function viewPlaylist

  getPlaylists() {
    this.setState({ loading: true });
    getPlaylists(this.token, this.state.offset).then((res) => {
      this.setState({playlists: res.items, loading: false});
    });
  }// end function getTracks
 
  render() {
    if(!this.state.playlists) return null;
    
    return (
          <FlatList
            data={this.state.playlists}
            keyExtractor={item => item.id}
            ListFooterComponent={this.renderFooter}
            renderItem={({item}) =>
            <FlatListItem title={item.name}
                          onPress={() => {this.viewPlaylist(item.name, item.href)} } />}
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

}// end class Playlists
