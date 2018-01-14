import React from "react";
import { View, Text } from "react-native";

export default class Music extends React.Component {

  constructor(props) {
    super(props);
  }// end constructor App

  render() {
    return (
      <View style={{ paddingVertical: 25 }}>
        <Text>This is the music screen.</Text>
      </View>
    );
  }// end render function
}// end class Search