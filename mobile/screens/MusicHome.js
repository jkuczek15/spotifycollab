import React from "react";
import { View, Text } from "react-native";
import { List, ListItem } from 'react-native-elements';

const list = [
  {
    title: "Playlists"
  },
  {
    title: "Songs"
  }
];

export default class MusicHome extends React.Component {

  constructor(props) {
    super(props);
  }// end constructor App

  navigate(title){
    this.props.navigation.navigate(title);
  }// end function navigate

  render() {
    return (
	   <View>
      <List>
        {
          list.map((item, i) => (
            <ListItem
              onPress={() => {this.navigate(item.title)}}
              key={i}
              title={item.title}
            />
          ))
        }
      </List>
	   </View>
	  );
  }// end render function

}// end class Music
