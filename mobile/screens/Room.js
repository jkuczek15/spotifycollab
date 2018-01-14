import React from "react";
import { View, Text } from "react-native";

export default class Room extends React.Component {

  constructor(props) {
    super(props);
    access_token = props.screenProps.get('access_token');
  }// end constructor App

  render() {
    return (
      <View style={{ paddingVertical: 25 }}>
        <Text>This is the room screen.</Text>
      </View>
    );
  }// end render function
}// end class Search