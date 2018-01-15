import React from "react";
import { View, Text } from "react-native";
import { Header } from 'react-native-elements';

export default class Search extends React.Component {

  constructor(props) {
    super(props);
    access_token = props.screenProps.get('access_token');
  }// end constructor App

  render() {
    return (
      <View>
        <Header
          centerComponent={{ text: "Search", style: { color: '#fff' } }}
          backgroundColor="#23CF5F"
        />
        <View style={{ paddingVertical: 25 }}>
          <Text>This is the search screen.</Text>
        </View>
      </View>
    );
  }// end render function
}// end class Search