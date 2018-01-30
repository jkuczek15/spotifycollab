import React from "react";
import { getPlaylists } from '../includes/Spotify';
import { renderFooter } from '../includes/render/footer';
import { FlatList } from "react-native";
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
    this.setState({ loading: true });
    getPlaylists(this.token, this.state.offset).then((res) => {
      this.setState({playlists: res.items, loading: false});
    });
  }// end function componentDidMount

  viewPlaylist(name, url) {
    this.props.navigation.navigate("ViewPlaylist", {name: name, url: url});
  }// end function viewPlaylist
 
  render() {
    if(!this.state.playlists) return null;
    return (
      <FlatList
        data={this.state.playlists}
        keyExtractor={item => item.id}
        ListFooterComponent={() => renderFooter(this.state.loading)}
        renderItem={({item}) =>
        <FlatListItem title={item.name}
                      onPress={() => this.viewPlaylist(item.name, item.href) } />}
        removeClippedSubviews={true}
      />
    );
  }// end render function

}// end class Playlists
