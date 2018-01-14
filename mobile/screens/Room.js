import React from "react";
import { View, Text, Button } from "react-native";

export default class Room extends React.Component {

  constructor(props) {
    super(props);
  }// end constructor App

  render() {
    console.log(this.props.screenProps.get('access_token'));
    return (
      <View style={{ paddingVertical: 25 }}>
        <Text>This is the room screen.</Text>
      </View>
    );
  }// end render function
}// end class Search