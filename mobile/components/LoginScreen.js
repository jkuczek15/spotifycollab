import React from 'react';
import { StyleSheet, Text, Button, View } from 'react-native';
import { StatusBar } from 'react-native';

class LoginScreen extends React.Component {
  // Nav options can be defined as a function of the screen's props:
  static navigationOptions = ({ navigation }) => ({
      title: `Login`,
  });
  render() {
      // The screen's current route is passed in to `props.navigation.state`:
      const { params } = this.props.navigation.state;
      return (
        <View>
            <StatusBar hidden={true} />
            <Text>This is the login screen</Text>
        </View>
      );
  }// end render function
}// end class LoginScreen