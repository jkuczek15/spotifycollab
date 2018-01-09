import React from 'react';
import { StyleSheet, Text, Button, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { StatusBar } from 'react-native';
import { Navigation } from 'components/Navigation';

class ChatScreen extends React.Component {
  // Nav options can be defined as a function of the screen's props:
  static navigationOptions = ({ navigation }) => ({
      title: `Chat with ${navigation.state.params.user}`,
  });
  render() {
      // The screen's current route is passed in to `props.navigation.state`:
      const { params } = this.props.navigation.state;
      return (
      <View>
          <StatusBar hidden={true} />
          <Text>Chat with {params.user}</Text>
      </View>
      );
  }// end render function
}// end class ChatScreen

const SpotifyCollab = StackNavigator({
  Home: { 
    screen: Navigation,
  },
  Chat: { screen: ChatScreen },
});

export default class App extends React.Component {
  render() {
    return <SpotifyCollab />;
  }// end render function
}// end class App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
