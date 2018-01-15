import React from "react";
import { ScrollView, Text, Linking, View } from "react-native";
import { Card, Button, Header } from "react-native-elements";
import { getAccessToken, onSignOut } from '../includes/Auth';

export default class Home extends React.Component {
  
  constructor(props) {
    super(props);
    access_token = props.screenProps.get('access_token');
  }// end constructor App

  render() {
    let navigation = this.props.navigation;
    return (
      <View>
        <Header
          centerComponent={{ text: "Home", style: { color: '#fff' } }}
          backgroundColor="#23CF5F"
        />
        <View style={{ paddingVertical: 25 }}>
          <Text>This is the home screen.</Text>
          <Button
              backgroundColor="#23CF5F"
              title="SIGN OUT"
              onPress={() => onSignOut().then(() => navigation.navigate("SignedOut"))}
          />
        </View>
      </View>
    );
  }// end render function

}// end class Home