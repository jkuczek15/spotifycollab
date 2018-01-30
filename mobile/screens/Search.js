import React from "react";
import { search } from '../includes/Spotify';
import { addTrack } from '../includes/functions/press';
import { renderFooter } from '../includes/render/footer';
import { View, FlatList } from "react-native";
import { SearchBar } from 'react-native-elements';
import FlatListItem from '../includes/components/FlatListItem';

export default class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      loading: false
    };
    this.token = props.screenProps.get('token');
  }// end constructor App

  search(query) {
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
          ListFooterComponent={() => renderFooter(this.state.loading)}
          renderItem={({item}) =>
            <FlatListItem title={item.name}
                          subtitle={item.artists.map((artist) => artist.name).join(', ')} 
                          onPress={() => addTrack(this.props, item)}  />}
          removeClippedSubviews={true} />
      </View>
    );
  }// end render function

}// end class Search