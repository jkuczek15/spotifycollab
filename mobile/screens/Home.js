import React from "react";
import { ScrollView, Text, Linking, View } from "react-native";
import { Card, Button } from "react-native-elements";
import { getAccessToken, onSignOut } from '../includes/Auth';

export default class Home extends React.Component {
  
  constructor(props) {
    super(props);
  }// end constructor App

  render() {
    let navigation = this.props.navigation;
    return (
      <View style={{ paddingVertical: 25 }}>
        <Text>This is the home screen.</Text>
        <Button
            backgroundColor="#03A9F4"
            title="SIGN OUT"
            onPress={() => onSignOut().then(() => navigation.navigate("SignedOut"))}
        />
      </View>
    );
  }// end render function

}// end class Home